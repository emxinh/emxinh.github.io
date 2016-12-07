angular.module('mainCtrl', [])

.controller('MainController', function ($scope, $http, $q, $mdDialog) {

	var vm = this;
	$scope.card = {};
  	$scope.card.title = 'test';
  	vm.page = 0;
  	vm.shots = [];
  	vm.listItems = [];
  	vm.loadingMore = false;  		

  	vm.loadMoreShots = function() {
		console.log('aaa');
    	if(vm.loadingMore) return;
    	vm.page++;
    	// var deferred = $q.defer();
    	vm.loadingMore = true;
    	var promise = $http.get('https://api.dribbble.com/v1/shots/?per_page=24&page='+vm.page+'&access_token=3df6bcfc60b54b131ac04f132af615e60b0bd0b1cadca89a4761cd5d125d608f');
    	promise.then(function(data) {
      		var shotsTmp = angular.copy(vm.shots);
      		shotsTmp = shotsTmp.concat(data.data);
      		vm.shots = shotsTmp;
      		vm.loadingMore = false;
    	}, function() {
      		vm.loadingMore = false;
    	});
    	return promise;
  	};

  	vm.getData = function() {
  		firebase.database().ref('items/').on('value',function(snapshot) {          
          if (snapshot.hasChildren()) {
          	vm.loadingMore = true;
            snapshot.forEach(function(value) {
              	console.log(value.val());
              	var item = value.val(); 
              vm.listItems.push(item);              
            });
          }
  		})
  	}

  	vm.getData();
  	//vm.loadMoreShots();

  	vm.showDialog = function(item) {
  		console.log(item);
  		$mdDialog.show({
          clickOutsideToClose: true,

          scope: $scope,        // use parent scope in template
          preserveScope: true,  // do not forget this if use parent scope

          // Since GreetingController is instantiated with ControllerAs syntax
          // AND we are passing the parent '$scope' to the dialog, we MUST
          // use 'vm.<xxx>' in the template markup

          template: '<md-dialog aria-label="'+item.title+'">' +
					'  <form ng-cloak>'+
					'    <md-toolbar>'+
					'      <div class="md-toolbar-tools">'+
					'        <h2>'+item.title+'</h2>'+
					'        <span flex></span>'+
					'       <md-button class="md-icon-button" ng-click="cancel()">'+
					'          <md-icon md-svg-src="https://raw.githubusercontent.com/angular/material/master/docs/app/img/icons/ic_close_24px.svg" aria-label="Close dialog"></md-icon>'+
					'        </md-button>'+
					'      </div>'+
					'    </md-toolbar>'+

					'    <md-dialog-content>'+
					'      <div class="md-dialog-content">'+
					'      	<div class="img">'+
					'			<img src="'+item.url+'" style="width: 100%;">'+
					'		</div>'+
					'      </div>'+
					'    </md-dialog-content>'+
					'  </form>'+
					'</md-dialog>',
          controller: function DialogController($scope, $mdDialog) {
            $scope.closeDialog = function() {
              $mdDialog.hide();
            };

            $scope.cancel = function() {
		      $mdDialog.cancel();
		    };
          }
       });
  	}

  	function getMeta(url){   
    	var img = new Image();
    	img.addEventListener("load", function(){
        	alert( this.naturalWidth +' '+ this.naturalHeight );
    	});
    	img.src = url;
	}

});