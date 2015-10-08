'use strict';

angular.module('do6VsoBrowserApp')
    .controller('NavbarCtrl', function ($scope, $location, $http) {
    $scope.menu = [];
    $scope.selectedSite = 'Select a Site...';
    // set the selected site based on the chosen value.
    $scope.updateSelectedSite = function(site){
      $scope.selectedSite = site;
    };
    // get the list of projects from the server API.
    $http.get('/api/projects/').success(function (sites) {
      for (var ii = 0; ii < sites.length; ii++) {
        var site = {
          'title': sites[ii].name,
          'link': '/project/' + sites[ii].id
        };
        $scope.menu[ii] = site;
      }
    });

    $scope.isCollapsed = true;
    
    $scope.isActive = function (route) {
      return route === $location.path();
    };
  });