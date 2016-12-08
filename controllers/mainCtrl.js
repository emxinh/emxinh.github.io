angular.module('mainCtrl', [])

.controller('MainController', function ($scope, $http, $q, $mdDialog, $firebaseArray) {

	var vm = this;
	vm.ref = firebase.database().ref('items');
	vm.cateRef = firebase.database().ref('categories');

	vm.listItems = [];
	vm.listCategories = $firebaseArray(vm.cateRef);
	vm.selectedTopics = [];
	vm.lastCreatedValue = 0;  	 
  	vm.loadingMore = false;  		
	vm.page = 0; 
	vm.selectedItem = null;
	vm.searchText = "";
	vm.autocompleteDemoRequireMatch = true;
	vm.transformChip =  transformChip;

	vm.loadItems = function() {
		if(vm.loadingMore) return;

		vm.loadingMore = true; 
  		var query = vm.ref;

  		if (vm.page == 0) {
  			query = vm.ref.orderByChild("created_at").limitToLast(10);			
  		} else {
  			query = vm.ref.orderByChild("created_at").endAt(vm.lastCreatedValue).limitToLast(10);
  		}
	  	
	  	var listTempItems = $firebaseArray(query);
	  	listTempItems.$loaded().then(function() {	  		
	  		
	  		console.log("done");
	  		listTempItems = listTempItems.sort(function(a,b) {
	        	return b.created_at - a.created_at;
	        });

	        var listOrderdItems = listTempItems;
	        if (vm.page != 0) {
	        	listOrderdItems = listOrderdItems.splice(1,listOrderdItems.length -1);
	        }	        

	        if (listOrderdItems.length > 0) {
	        	vm.lastCreatedValue = listOrderdItems[listOrderdItems.length - 1].created_at;
		        if (vm.page == 0) {
		        	vm.listItems = listOrderdItems;	
		        } else {
		        	vm.listItems = vm.listItems.concat(listOrderdItems);
		        }

		        vm.page++;		  		
	        }

	        vm.loadingMore = false;	        		        
	  	});  	  	
	}; 	

	vm.loadItems();

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

  	function getLastCreatedValue(listItems) {
  		var value = 0;
  		for (var i = 0; i< listItems.length; i++) {
  			if (i == 0) {
  				value = listItems[i].created_at;
  			} else if (listItems[i].created_at < value ) {
  				value = listItems[i].created_at;
  			}
  		}
  		return value;
  	}

  	function orderingListItem(listItems) {  		
  		listItems = listItems.sort(function(a,b) {
        	return b.created_at - a.created_at;
        });
  	}

  	function transformChip (chip) {
	    if (angular.isObject(chip)) {
	      return chip;
	    }
    	// Otherwise, create a new one
    	return { name: chip, type: 'new' }
  	}

});