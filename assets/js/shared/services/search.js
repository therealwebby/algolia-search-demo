import algoliasearch from 'algoliasearch';

export default class Search {
  constructor() {
    this.client = algoliasearch('KJFGZM4A60', '72047bd135d6775dc2f140ef22edf8fb');
    this.index = this.client.initIndex('restaurants');
  }

  performSearch(queryString, cb) {
    this.index.search(
      queryString,
      {
        hitsPerPage: 3
      },
      (error, content) => {
        cb(error, content);
      }
    );
  }
}
