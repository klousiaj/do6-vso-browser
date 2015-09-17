'use strict';

angular.module('do6VsoBrowserApp')
    .controller('NavbarCtrl', function ($scope, $location, $http) {
    $scope.menu = [];
    $scope.selectedSite = 'OjpApplicationMaintenance';

    $http.get('/api/projects/').success(function (sites) {
      for (var ii = 0; ii < sites.length; ii++) {
        var site = {
          'title': sites[ii].name,
          'link': 'queries/' + sites[ii].id
        }
        $scope.menu[ii] = site;
      }
    });

    $scope.isCollapsed = true;

    $scope.isActive = function (route) {
      return route === $location.path();
    };
  });