angular.module('GXinh', ['ngMaterial','mainCtrl','angularGrid','firebase'])
.filter('unsafe', function($sce) { return $sce.trustAsHtml; });