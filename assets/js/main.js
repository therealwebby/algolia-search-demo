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
    )
  }

  _registerEvents () {
    $('#search-input').off().on('keyup', event => {
      this._performSearch(event.target.value);
    });

    $('.filter__label').off().on('click', event => {
      this._labelClickHandler(event)
    });

    $('.rating--sidebar').off().on('click', event => {
      this._ratingsClickHandler(event);
    })

    $('#show-more').off().on('click', () => {
      this.searchService.loadMore(
        (error, content) => {
          this.searchData = content;
          this._renderPageResults();
        }
      );
    })
  }

  _labelClickHandler(event) {
    const filterObject = {}

    if ($(event.target).attr('data-food')) {
      filterObject.food_type = $(event.target).attr('data-food');
    };

    if ($(event.target).attr('data-payment')) {
      filterObject.payment_options = $(event.target).attr('data-payment');
    }

    this._performSearch(undefined, filterObject);

    $(event.target).parent().children('.filter__label--active').removeClass('filter__label--active');
    $(event.target).addClass('filter__label--active');
  }

  _ratingsClickHandler(event) {
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
