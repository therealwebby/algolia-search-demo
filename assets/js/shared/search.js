import algoliasearch from 'algoliasearch';

export default class Search {
  constructor () {
    this.client = algoliasearch('KJFGZM4A60', '72047bd135d6775dc2f140ef22edf8fb');
    this.index = this.client.initIndex('restaurants');

    this.currentSearch = {
      query: '',
      facetFilters: {
        food_type: ''
      },
      hitsPerPage: 3
    }
  }

  performSearch (queryString='', facetFilters={}, cb) {
    this.currentSearch.query = queryString || this.currentSearch.query;

    if (facetFilters.food_type && (facetFilters.food_type !== this.currentSearch.facetFilters.food_type)) {
      this.currentSearch.facetFilters = Object.assign({}, this.currentSearch.facetFilters, facetFilters);
      this.currentSearch.hitsPerPage = 3;
    }

    let parsedFacetFilters = '';

    Object.keys(this.currentSearch.facetFilters)
      .map(key => {
          parsedFacetFilters = `${parsedFacetFilters} ${key}:${this.currentSearch.facetFilters[key]}`
        }
      );

    this.index.search(
      this.currentSearch.query,
      {
        hitsPerPage: this.currentSearch.hitsPerPage,
        facets: Object.keys(this.currentSearch.facetFilters),
        attributesToRetrieve: '*',
        facetFilters: parsedFacetFilters
      },
      (error, content) => {
        cb(error, content);
      }
    );
  }

  loadMore (cb) {
    this.currentSearch.hitsPerPage = this.currentSearch.hitsPerPage + 3;
    console.log(this.currentSearch)
    this.performSearch(undefined, undefined, cb);
  }
}
