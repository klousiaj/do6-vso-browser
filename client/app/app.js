'use strict';

var app = angular.module('do6VsoBrowserApp', [
  'angular-loading-bar',
  'angular-sly',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.bootstrap',
  'ui.grid',
  'ui.grid.resizeColumns',
  'ui.grid.exporter',
  'ui.select',
  'ui.router'
]).config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider
    .otherwise('/');
  $locationProvider.html5Mode(true);
});
  
  
// app.run(function ($rootScope) {
//     // these are here for debugging. Can/should be removed at some point.
//     $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
//       console.log('$stateChangeStart to ' + toState.to + '- fired when the transition begins. toState,toParams : \n', toState, toParams);
//     });
//     $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
//       console.log('$stateChangeError - fired when an error occurs during transition.');
//       console.log(arguments);
//     });
//     $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
//       console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
//     });
//     // $rootScope.$on('$viewContentLoading',function(event, viewConfig){
//     //   // runs on individual scopes, so putting it in "run" doesn't work.
//     //   console.log('$viewContentLoading - view begins loading - dom not rendered',viewConfig);
//     // });
//     $rootScope.$on('$viewContentLoaded', function (event) {
//       console.log('$viewContentLoaded - fired after dom rendered', event);
//     });
//     $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
//       console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
//       console.log(unfoundState, fromState, fromParams);
//     });
//   });
