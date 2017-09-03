import Handlebars from 'handlebars';
import $ from 'jquery';

import SearchService from './search';
import LocationService from './location';

class App {
  constructor () {
    this.handlebars = Handlebars;
    this.locationService = new LocationService;
    this.searchService = new SearchService(this.locationService);

    this.resultContainerHtml = $('#result-container').html();
    this.filterContainerHtml = $('#filter-container').html();

    this.locationService.getUserLocation();

    this._registerHelpers();
    this._renderPageResults();
    this._performSearch('', undefined, undefined, true);
  }

  _registerHelpers () {
    this.handlebars.registerHelper('toSeconds', value => {
      return value ? value / 1000 : 0;
    });

    this.handlebars.registerHelper('roundRating', value => {
      return value ? Math.round(value * 2) : 0;
    });
  }

  _renderPageResults () {
    const template = this.handlebars.compile(this.resultContainerHtml);
    const html = template(this.searchData);

    $('#result-container').empty().append(html);
    this._registerEvents();
  }

  _renderSidebar () {
    const template = this.handlebars.compile(this.filterContainerHtml);
    const html = template(this.searchData);

    $('#filter-container').empty().append(html);
    this._registerEvents();
  }

  _performSearch (value, filters={}, numericFilters={}, isRenderingSidebar=false) {
    this.searchService.performSearch(
      value,
      filters,
      numericFilters,
      (error, content) => {
        this.searchData = content;
        this._renderPageResults();
        isRenderingSidebar && this._renderSidebar();
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
          this._renderPageResults();
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
