const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
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
