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

      $scope.getDefaultSignatures = function() {

          return [
              {
                  name: 'Personal',
                  code: '<p>Kind regards,<br/>John Doe</p>'
              },
              {
                  name: 'Work',
                  code: '<p>Kind regards,<br/>John Doe</p>'
              }
          ];
      };

      $scope.selectSignature = function( signature ) {

          $scope.options.selectedSignature = signature;
      };

      $scope.getSignaturePreview = function() {

          return $sce.trustAsHtml( $scope.options.selectedSignature.code );
      };

      $scope.resetFeedback = function() {

          $scope.options.feedback = { code: null, message: null };
      };

      $scope.loadOptions = function() {

          chrome.storage.sync.get(
              { signatures: $scope.getDefaultSignatures() },
              function( items ) {

                  $scope.$apply(function () {

                      $scope.options.signatures = items.signatures;
                      $scope.selectSignature( $scope.options.signatures[0] );
                  });
              }
          );
      };

      $scope.saveOptions = function() {

          chrome.storage.sync.set(
              { signatures: $scope.options.signatures },
              function() {

                  $scope.$apply(function () {

                      //Update status to let user know options were saved.
                      $scope.options.feedback = { code: 'OK', message: 'Options saved.' };
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

      $scope.options.signatures = $scope.getDefaultSignatures();
      $scope.selectSignature( $scope.options.signatures[0] );
      $scope.loadOptions();

  }])
;
