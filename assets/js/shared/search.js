import algoliasearch from 'algoliasearch';

export default class Search {
  constructor () {
    this.client = algoliasearch('KJFGZM4A60', '72047bd135d6775dc2f140ef22edf8fb');
    this.index = this.client.initIndex('restaurants');

    this.currentSearch = {
      query: '',
      facetFilters: {
        'food_type': ''
      },
      numericFilters: {},
      hitsPerPage: 3
    }
  }

  _isNewFilter (filters) {
    return filters.food_type && (filters.food_type !== this.currentSearch.facetFilters.food_type) ||
      filters.payment_options && (filters.payment_options !== this.currentSearch.facetFilters.payment_options) ||
      filters.stars_count && (filters.stars_count !== this.currentSearch.numericFilters.stars_count)
  }

  _buildFilterString (type) {
    let parsedFilters = '';

    Object.keys(this.currentSearch[type])
      .map(key => {
          parsedFilters = `${parsedFilters}${parsedFilters && ', '}${type === 'numericFilters' ? key : key+':'} ${this.currentSearch[type][key]}`
        }
      );

    return parsedFilters;
  }

  performSearch (queryString='', facetFilters={}, numericFilters={}, cb) {
    this.currentSearch.query = queryString || this.currentSearch.query;

    if (this._isNewFilter(facetFilters) || this._isNewFilter(numericFilters)) {
      this.currentSearch.facetFilters = Object.assign({}, this.currentSearch.facetFilters, facetFilters);
      this.currentSearch.numericFilters = Object.assign({}, this.currentSearch.numericFilters, numericFilters);
      this.currentSearch.hitsPerPage = 3;
    }

    this.index.search(
      this.currentSearch.query,
      {
        hitsPerPage: this.currentSearch.hitsPerPage,
        facets: Object.keys(this.currentSearch.facetFilters),
        attributesToRetrieve: '*',
        facetFilters: this._buildFilterString('facetFilters'),
        numericFilters: this._buildFilterString('numericFilters')
      },
      (error, content) => {
        cb(error, content);
      }
    );
  }

  loadMore (cb) {
    this.currentSearch.hitsPerPage = this.currentSearch.hitsPerPage + 3;
    this.performSearch(undefined, undefined, undefined, cb);
  }
}
