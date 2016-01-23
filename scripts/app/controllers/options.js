angular.module('sigjar')
  .controller('OptionsController', ['$scope', '$timeout', '$sce', function($scope, $timeout, $sce) {

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //
      // Variables
      //
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      $scope.options =
      {
          feedback: { code: null, message: null },
          signatures: [],
          selectedSignature: null
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //
      // Functions
      //
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      $scope.selectSignature = function( signature ) {

          $scope.options.selectedSignature = signature;
      };

      $scope.createSignature = function() {

          $scope.options.signatures.push(
              {
                  name: 'Signature ' + ($scope.options.signatures.length + 1),
                  code: '<p>Kind regards,<br/>John Doe</p>'
              }
          );

          $scope.options.selectedSignature = $scope.options.signatures[$scope.options.signatures.length-1];

          $scope.saveOptions( 'The signature has been created.' );
      };

      $scope.removeSignature = function() {

          if ($scope.options.signatures.length == 1) {

              return;
          }

          var index = -1;
          for (var i = 0; i < $scope.options.signatures.length; i++) {

              var sig = $scope.options.signatures[i];

              if (sig.name == $scope.options.selectedSignature.name) {

                  index = i;
                  break;
              }
          }

          if (i > -1) {

              $scope.options.signatures.splice( index, 1 );
          }

          $scope.options.selectedSignature = $scope.options.signatures[index == 0? 0: index-1];

          $scope.saveOptions( 'The signature has been removed.' );
      };

      $scope.getSignaturePreview = function() {

          return $sce.trustAsHtml( $scope.options.selectedSignature.code );
      };

      $scope.resetFeedback = function() {

          $scope.options.feedback = { code: null, message: null };
      };

      $scope.loadOptions = function() {

          chrome.storage.sync.get(
              { signatures: [] },
              function( items ) {

                  $scope.$apply(function () {

                      $scope.options.signatures = items.signatures;
                      $scope.selectSignature( $scope.options.signatures[0] );
                  });
              }
          );
      };

      $scope.saveOptions = function( message ) {

          message = message || 'Options saved.';

          chrome.storage.sync.set(
              { signatures: $scope.options.signatures },
              function() {

                  $scope.$apply(function () {

                      //Update status to let user know options were saved.
                      $scope.options.feedback = { code: 'OK', message: message };
                      $timeout( function() { $scope.resetFeedback(); }, 3000 );
                  });
              }
          );
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //
      // Init app
      //
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      $scope.loadOptions();

  }])
;
