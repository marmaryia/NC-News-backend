const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  const date = created_at ? new Date(created_at) : new Date();
  return { created_at: date, ...otherProperties };
};

exports.mapDataForInsertion = (array, ...keys) => {
  return array.map((item) => {
    return keys.map((key) => {
      return item[key];
    });
  });
};

exports.createLookupObject = (dataArr, keyToGetKey, keyToGetValue) => {
  const lookupObject = {};
  dataArr.forEach((item) => {
    lookupObject[item[keyToGetKey]] = item[keyToGetValue];
  });
  return lookupObject;
};
