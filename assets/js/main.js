import Handlebars from 'handlebars';
import $ from 'jquery';

import Search from './shared/search';

class App {
  constructor () {
    this.search = new Search;
    this.handlebars = Handlebars;
    this.resultContainerHtml = $('#result-container').html();
    this.filterContainerHtml = $('#filter-container').html();

    this.registerHelpers();
    this.renderPageResults();
    this.registerEvents();
    this._triggerSearch('', undefined, true);
  }

  _triggerSearch (value, filters={}, isRenderingSidebar=false) {
    this.search.performSearch(
      value,
      filters,
      (error, content) => {
        this.searchData = content;
        this.renderPageResults();
        isRenderingSidebar && this.renderSidebar();
      }
    )
  }

  registerEvents () {
    $('#search-input').on('keyup', event => {
      this._triggerSearch(event.target.value);
    });

    $('.filter__label').on('click', event => {
      this._triggerSearch(undefined, {
        'food_type': $(event.target).attr('data-value')
      });

      $('.filter__label--active').removeClass('filter__label--active');
      $(event.target).addClass('filter__label--active');
    });

    $('#show-more').on('click', () => {
      this.search.loadMore(
        (error, content) => {
          console.log('callback', content);
          this.searchData = content;
          this.renderPageResults();
        }
      );
    })
  }

  registerHelpers () {
    this.handlebars.registerHelper('toSeconds', value => {
      return value ? value / 1000 : 0;
    });

    this.handlebars.registerHelper('roundRating', value => {
      return value ? Math.round(value * 2) : 0;
    });
  }

  renderPageResults () {
    const template = this.handlebars.compile(this.resultContainerHtml);
    const html = template(this.searchData);

    $('#result-container').empty().append(html);
    this.registerEvents();
  }

  renderSidebar () {
    const template = this.handlebars.compile(this.filterContainerHtml);
    const html = template(this.searchData);

    $('#filter-container').empty().append(html);
    this.registerEvents();
  }
}

var app = new App;
