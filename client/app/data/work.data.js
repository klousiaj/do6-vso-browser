'use strict';
function Work() {
  this.planned = 0;
  this.completed = 0;
  this.remaining = 0;

  this.toString = function () {
    return '{' + this.planned + ', ' + this.completed + ', ' + this.remaining + '}';
  };
}