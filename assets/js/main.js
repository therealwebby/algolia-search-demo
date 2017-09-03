import $ from 'jquery';

import SearchService from './search';
import LocationService from './location';
import TemplaingService from './templating'

class App {
  constructor () {
    this.locationService = new LocationService;
    this.searchService = new SearchService(this.locationService);
    this.templaingService = new TemplaingService;

    this.locationService.getUserLocation();

    this._performSearch('', undefined, undefined, true);
  }

  _performSearch (value, filters={}, numericFilters={}, isRenderingSidebar=false) {
    this.searchService.performSearch(
      value,
      filters,
      numericFilters,
      (error, content) => {
        this.searchData = content;

        this.templaingService.renderPageResults(this.searchData);
        isRenderingSidebar && this.templaingService.renderSidebar(this.searchData);
        this._registerEvents();
      }
    );
  }

  _registerEvents () {
    $('#search-input').off().on('keyup', event => {
      this._performSearch(event.target.value);
    });

    $('#filter-header').off().on('click', event => {
      $(event.target)
        .toggleClass('filter__header--open');
      $('.filter__container')
        .toggleClass('filter__container--open');
    });

    $('#show-more').off().on('click', () => {
      this.searchService.loadMore(
        (error, content) => {
          this.searchData = content;
          this.templaingService.renderPageResults(this.searchData);
          this._registerEvents();
        }
      );
    });

    $('.filter__label').off().on('click', event => {
      this._labelClickHandler(event);
    });

    $('.rating--sidebar').off().on('click', event => {
      this._ratingsClickHandler(event);
    })
  }

  _expandDiscoverCards (paymentData) {
    if (paymentData === 'discover') {
      return ['discover', 'Diners Club', 'Carte Blanche'];
    }

    return paymentData;
  }

  _labelClickHandler (event) {
    const foodTypeData = $(event.target).attr('data-food');
    let paymentData = $(event.target).attr('data-payment');
    const filterObject = {};

    if (foodTypeData) {
      filterObject.food_type = foodTypeData;
    };

    if (paymentData) {
      paymentData = this._expandDiscoverCards(paymentData);
      filterObject.payment_options = paymentData;
    }

    this._performSearch(undefined, filterObject);

    $(event.target).parent().children('.filter__label--active').removeClass('filter__label--active');
    $(event.target).addClass('filter__label--active');
  }

  _ratingsClickHandler (event) {
    this._performSearch(undefined, undefined, {
      stars_count: `>= ${$(event.target).attr('data-rating')}`
    });

    $(event.target).parent().children('.rating--active').removeClass('rating--active');
    $(event.target).parent().removeClass('filter__section--active');
    $(event.target).parent().addClass('filter__section--active');
    $(event.target).addClass('rating--active');
  }
}

var app = new App;
