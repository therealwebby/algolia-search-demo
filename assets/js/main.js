import Handlebars from 'handlebars';
import $ from 'jquery';

import Search from './shared/services/search';

class App {
  constructor () {
    this.search = new Search;
    this.handlebars = Handlebars;
    this.resultContainerHtml = $('#result-container').html();
    this.searchData = {
      "hits": [
        {
          "name": "Americana Restaurant",
          "address": "1454 Camino del Mar",
          "area": "San Diego",
          "city": "Del Mar",
          "country": "US",
          "image_url": "https://www.opentable.com/img/restimages/85702.jpg",
          "mobile_reserve_url": "http://mobile.opentable.com/opentable/?restId=85702",
          "payment_options": [
            "AMEX",
            "Diners Club",
            "Discover",
            "MasterCard",
            "Visa"
          ],
          "phone": "8587946838",
          "postal_code": "92014-2510",
          "price": 2,
          "reserve_url": "http://www.opentable.com/single.aspx?rid=85702",
          "state": "CA",
          "_geoloc": {
            "lat": 32.959398,
            "lng": -117.265463
          },
          "food_type": "American",
          "stars_count": "4.1",
          "reviews_count": "37",
          "neighborhood": "Del Mar",
          "phone_number": "(858) 794-6838",
          "price_range": "$30 and under",
          "dining_style": "Casual Dining",
          "objectID": "85702",
          "_highlightResult": {
            "name": {
              "value": "<em>American</em>a Restaurant",
              "matchLevel": "full",
              "fullyHighlighted": false,
              "matchedWords": [
                "american"
              ]
            },
            "food_type": {
              "value": "<em>American</em>",
              "matchLevel": "full",
              "fullyHighlighted": true,
              "matchedWords": [
                "american"
              ]
            }
          }
        },
        {
          "name": "Rico's American Grill - Pointe Hilton Squaw Peak",
          "address": "7677 N 16th St",
          "area": "Phoenix / Arizona",
          "city": "Phoenix",
          "country": "US",
          "image_url": "https://www.opentable.com/img/restimages/91453.jpg",
          "mobile_reserve_url": "http://mobile.opentable.com/opentable/?restId=91453",
          "payment_options": [
            "AMEX",
            "Diners Club",
            "Discover",
            "MasterCard",
            "Visa"
          ],
          "phone": "6029975850",
          "postal_code": "85020-4434",
          "price": 2,
          "reserve_url": "http://www.opentable.com/single.aspx?rid=91453",
          "state": "AZ",
          "_geoloc": {
            "lat": 33.547835,
            "lng": -112.047445
          },
          "food_type": "American",
          "stars_count": "3.5",
          "reviews_count": "24",
          "neighborhood": "Phoenix",
          "phone_number": "(602) 997-5850",
          "price_range": "$30 and under",
          "dining_style": "Casual Dining",
          "objectID": "91453",
          "_highlightResult": {
            "name": {
              "value": "Rico's <em>American</em> Grill - Pointe Hilton Squaw Peak",
              "matchLevel": "full",
              "fullyHighlighted": false,
              "matchedWords": [
                "american"
              ]
            },
            "food_type": {
              "value": "<em>American</em>",
              "matchLevel": "full",
              "fullyHighlighted": true,
              "matchedWords": [
                "american"
              ]
            }
          }
        },
        {
          "name": "Malabar American Cooking",
          "address": "2960 Del Paso Rd",
          "area": "Sacramento / Sacramento Valley",
          "city": "Sacramento",
          "country": "US",
          "image_url": "https://www.opentable.com/img/restimages/80584.jpg",
          "mobile_reserve_url": "http://mobile.opentable.com/opentable/?restId=80584",
          "payment_options": [
            "AMEX",
            "MasterCard",
            "Visa"
          ],
          "phone": "9165749074",
          "postal_code": "95834",
          "price": 2,
          "reserve_url": "http://www.opentable.com/single.aspx?rid=80584",
          "state": "CA",
          "_geoloc": {
            "lat": 38.655364,
            "lng": -121.52814
          },
          "food_type": "American",
          "stars_count": "4.0",
          "reviews_count": "193",
          "neighborhood": "Sacramento",
          "phone_number": "(916) 574-9074",
          "price_range": "$30 and under",
          "dining_style": "Casual Dining",
          "objectID": "80584",
          "_highlightResult": {
            "name": {
              "value": "Malabar <em>American</em> Cooking",
              "matchLevel": "full",
              "fullyHighlighted": false,
              "matchedWords": [
                "american"
              ]
            },
            "food_type": {
              "value": "<em>American</em>",
              "matchLevel": "full",
              "fullyHighlighted": true,
              "matchedWords": [
                "american"
              ]
            }
          }
        }
      ],
      "nbHits": 1588,
      "page": 0,
      "nbPages": 334,
      "hitsPerPage": 3,
      "processingTimeMS": 1,
      "exhaustiveNbHits": true,
      "query": "American",
      "params": "query=American&hitsPerPage=3"
    };

    this.registerEvents();
    this.registerHelpers();
    this.renderPage();
  }

  registerEvents () {
    $('#search-input').on('keyup', event => {
      this.search.performSearch(
        event.target.value,
        (error, content) => {
          console.log(content);
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
  }

  renderPage () {
    const template = this.handlebars.compile(this.resultContainerHtml);
    const html = template(this.searchData);

    $('#result-container').empty().append(html);
  }
}

var app = new App;
