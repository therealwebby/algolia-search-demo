import Handlebars from 'handlebars';
import $ from 'jquery';

export default class Templates {
  constructor () {
    this.handlebars = Handlebars;
    this._registerHelpers();
  }

  renderPageResults (searchData) {
    const template = this.handlebars.compile(this._resultsTemplate());
    const html = template(searchData);

    $('#result-container').empty().append(html);
  }

  renderSidebar (searchData) {
    const template = this.handlebars.compile(this._sidebarTemplate());
    const html = template(searchData);

    $('#filter-container').empty().append(html);
  }

  _registerHelpers () {
    this.handlebars.registerHelper('toSeconds', value => {
      return value ? value / 1000 : 0;
    });

    this.handlebars.registerHelper('roundRating', value => {
      return value ? Math.round(value * 2) : 0;
    });
  }

  _sidebarTemplate () {
    return `
      <header id="filter-header" class="filter__header">
        <h3 class="filter__header-text">Filters</h3>
      </header>
      <div class="filter__container">
        <div class="filter__section">
          <h3 class="filter__title">Cuisine/Food Type</h3>
          <a class="filter__label" data-food="italian">
            <span class="filter__label-text">Italian</span>
            <span class="filter__label-number">{{facets.food_type.Italian}}</span>
          </a>
          <a class="filter__label" data-food="american">
            <span class="filter__label-text">American</span>
            <span class="filter__label-number">{{facets.food_type.American}}</span>
          </a>
          <a class="filter__label" data-food="californian">
            <span class="filter__label-text">Californian</span>
            <span class="filter__label-number">{{facets.food_type.Californian}}</span>
          </a>
          <a class="filter__label" data-food="french">
            <span class="filter__label-text">French</span>
            <span class="filter__label-number">{{facets.food_type.French}}</span>
          </a>
          <a class="filter__label" data-food="seafood">
            <span class="filter__label-text">Seafood</span>
            <span class="filter__label-number">{{facets.food_type.Seafood}}</span>
          </a>
          <a class="filter__label" data-food="japanese">
            <span class="filter__label-text">Japanese</span>
            <span class="filter__label-number">{{facets.food_type.Japanese}}</span>
          </a>
          <a class="filter__label" data-food="indian">
            <span class="filter__label-text">Indian</span>
            <span class="filter__label-number">{{facets.food_type.Indian}}</span>
          </a>
        </div>
        <div class="filter__section">
          <h3 class="filter__title">Rating</h3>
          <span class="rating rating--0 rating--sidebar" data-rating="0">
          </span>
          <span class="rating rating--2 rating--sidebar" data-rating="1">
          </span>
          <span class="rating rating--4 rating--sidebar" data-rating="2">
          </span>
          <span class="rating rating--6 rating--sidebar" data-rating="3">
          </span>
          <span class="rating rating--8 rating--sidebar" data-rating="4">
          </span>
          <span class="rating rating--10 rating--sidebar" data-rating="5">
          </span>
        </div>
        <div class="filter__section">
          <h3 class="filter__title">Payment Options</h3>
          <a class="filter__label" data-payment="amex">
            <span class="filter__label-text">American Express</span>
          </a>
          <a class="filter__label" data-payment="visa">
            <span class="filter__label-text">Visa</span>
          </a>
          <a class="filter__label" data-payment="discover">
            <span class="filter__label-text">Discover</span>
          </a>
          <a class="filter__label" data-payment="mastercard">
            <span class="filter__label-text">MasterCard</span>
          </a>
        </div>
      </div>`;
  }

  _resultsTemplate () {
    return `
      <div class="results__container">
        <div class="results__stats-bar">
          <h2 class="results__count-text">{{#if nbHits}} {{nbHits}} {{else}} 0 {{/if}} results found <span class="results__time-text">in {{toSeconds processingTimeMS}} seconds</span></h2>
        </div>
        {{#each hits as |result|}}
          <div class="results__item">
            <div class="result">
              <div class="result__image-container">
                {{#if result.image_url}}
                  <img class="result__image" src="{{result.image_url}}" />
                {{/if}}
              </div>
              <div class="result__text-container">
                <h1 class="result__title">{{result.name}}</h1>
                <p class="result__rating">
                  {{result.stars_count}} <span class="rating rating--{{roundRating result.stars_count}}" /></span> <span class="result__summary">({{result.reviews_count}} reviews)</span>
                </p>
                <p class="result__summary">
                  {{result.food_type}} | {{result.neighborhood}} | {{result.price_range}}
                </p>
              </div>
            </div>
          </div>
        {{/each}}
        <div id="show-more" class="results__button">
          <div class="button">
            <a class="button__link">
              Show More
            </a>
          </div>
        </div>
      </div>`;
  }
}
