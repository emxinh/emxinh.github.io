angular.module('GXinh', ['ngMaterial','mainCtrl','angularGrid'])
.filter('unsafe', function($sce) { return $sce.trustAsHtml; });