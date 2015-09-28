'use strict';

Object.size = function (obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      size++;
    }
  }
  return size;
};

Object.values = function (obj) {
  var values = [], key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      values.push(obj[key]);
    }
  }
  return values;
};

Object.keyByValue = function (obj, value) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (obj[prop] === value) {
        return prop;
      }
    }
  }
};