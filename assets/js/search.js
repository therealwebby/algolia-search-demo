import algoliasearch from 'algoliasearch';
import _ from 'lodash';

export default class Search {
  constructor (locationService) {
    this.locationService = locationService;

    this.client = algoliasearch('VYLEWMPKEZ', '8940a18fde155adf3f74b0912c267aa4');
    this.index = this.client.initIndex('restaurants');

    this.currentSearch = {
      query: '',
      facetFilters: {
        'food_type': ''
      },
      numericFilters: {},
      hitsPerPage: 3
    };
  }

  _isNewFilter (filters) {
    return filters.food_type && (filters.food_type !== this.currentSearch.facetFilters.food_type) ||
      filters.payment_options && (filters.payment_options !== this.currentSearch.facetFilters.payment_options) ||
      filters.stars_count && (filters.stars_count !== this.currentSearch.numericFilters.stars_count);
  }

  _buildFilterString (type) {
    let parsedFilters = '';

    Object.keys(this.currentSearch[type])
      .map(key => {
          if (_.isArray(this.currentSearch[type][key])) {
            this.currentSearch[type][key].forEach(item => {
              parsedFilters = `${parsedFilters}${parsedFilters && ', '}${type === 'numericFilters' ? key : key+':'} ${item}`;
            })
          } else {
            parsedFilters = `${parsedFilters}${parsedFilters && ', '}${type === 'numericFilters' ? key : key+':'} ${this.currentSearch[type][key]}`;
          }
        }
      );

    return parsedFilters;
  }

  performSearch (queryString='', facetFilters={}, numericFilters={}, cb) {
    this.currentSearch.query = queryString;

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
        numericFilters: this._buildFilterString('numericFilters'),
        aroundLatLng: this.locationService.currentLocation && `${this.locationService.currentLocation.lat}, ${this.locationService.currentLocation.lng}`,
        aroundLatLngViaIP: true
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
