import Handlebars from 'handlebars';
import $ from 'jquery';

import Search from './shared/services/search';

class App {
  constructor () {
    this.search = new Search;
    this.handlebars = Handlebars;
    this.resultContainerHtml = $('#result-container').html();

    this.registerEvents();
    this.registerHelpers();
    this.renderPage();
  }

  registerEvents () {
    $('#search-input').on('keyup', event => {
      this.search.performSearch(
        event.target.value,
        (error, content) => {
          this.searchData = content;
          this.renderPage();
        }
      )
    });
  }

  registerHelpers () {
    this.handlebars.registerHelper('toSeconds', value => {
      return value / 1000;
    });

    this.handlebars.registerHelper('roundRating', value => {
      console.log(value);
      return Math.round(value * 2);
    });
  }

  renderPage () {
    const template = this.handlebars.compile(this.resultContainerHtml);
    const html = template(this.searchData);

    $('#result-container').empty().append(html);
  }
}

var app = new App;
