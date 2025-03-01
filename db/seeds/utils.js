const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  const date = created_at ? new Date(created_at) : new Date();
  return { created_at: date, ...otherProperties };
};

exports.mapDataForInsertion = (array, ...keys) => {
  return array.map((item) => keys.map((key) => item[key]));
};

exports.createLookupObject = (dataArr, keyToGetKey, keyToGetValue) => {
  const lookupObject = {};
  dataArr.forEach((item) => {
    lookupObject[item[keyToGetKey]] = item[keyToGetValue];
  });
  return lookupObject;
};

exports.addIdProperty = (dataArr, lookupObj, idKey, propertyKey) => {
  return dataArr.map((item) => {
    return { ...item, [idKey]: lookupObj[item[propertyKey]] };
  });
};
