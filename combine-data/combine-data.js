'use strict';

const fs = require('fs');
const path = require('path');
const csvJson = require('csvjson');
const exisitingJson = fs.readFileSync(
  path.join(
    __dirname, '../resources/dataset/restaurants_list.json'
  ),
  { encoding : 'utf8'}
)
const csvData = fs.readFileSync(
  path.join(
    __dirname, '../resources/dataset/restaurants_info.csv'
  ),
  { encoding : 'utf8'}
);
const options = {
  delimiter : ';'
};

function mergeDataSets() {
  const parsedData = csvJson.toObject(csvData, options);
  const combinedData = JSON.parse(exisitingJson).map(item => {
    const matchingItem = parsedData.find(parsedItem => item.objectID === parseInt(parsedItem.objectID));

    return Object.assign({}, item, matchingItem);
  });

  fs.writeFileSync(
      path.join(
        __dirname, '../resources/dataset/restaurants_complete.json'
      ),
      JSON.stringify(combinedData),
      error => {
        console.error(error);
      }
  )
}

mergeDataSets();
