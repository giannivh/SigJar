angular.module('sigjar')
  .controller('OptionsController', ['$scope', '$timeout', '$sce', function($scope, $timeout, $sce) {

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //
      // Variables
      //
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      $scope.options =
      {
          view: 'EDITOR',
          feedback: { code: null, message: null },
          templates: [],
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

      $scope.getNameHits = function( name ) {

          var hits = 0;

          for (var i = 0; i < $scope.options.signatures.length; i++) {

              if ($scope.options.signatures[i].name == name) {

                  hits++;
              }
          }

          return hits;
      };

      $scope.isNameTaken = function( name ) {

          return $scope.getNameHits( name ) > 0;
      };

      $scope.createSignature = function() {

          var index = $scope.options.signatures.length + 1;

          while ($scope.isNameTaken( 'Signature ' + index )) {

              index++;
          }

          $scope.options.signatures.push(
              {
                  name: 'Signature ' + index,
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

          alertify.set({ labels: {
              ok     : "Yes",
              cancel : "No"
          } });

          alertify.confirm( 'Are you sure you want to remove this signature?', function (e) {

              if (e) {

                  // user clicked "ok"
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
              }
          });
      };

      $scope.openTemplates = function() {

          $scope.options.view = 'TEMPLATES';
      };

      $scope.openEditor = function() {

          $scope.options.view = 'EDITOR';
      };

      $scope.useTemplate = function( template ) {

          if (!template) {

              return;
          }

          $scope.options.selectedSignature.code = template.code;
          $scope.openEditor();
      };

      $scope.getTrustedHTML = function( code ) {

          return $sce.trustAsHtml( code );
      };

      $scope.getSignaturePreview = function() {

          return $scope.getTrustedHTML( $scope.options.selectedSignature.code );
      };

      $scope.resetFeedback = function() {

          $scope.options.feedback = { code: null, message: null };
      };

      $scope.loadOptions = function() {

          chrome.storage.sync.get(
              { templates: [] },
              function( items ) {

                  $scope.$apply(function () {

                      $scope.options.templates = items.templates;
                  });
              }
          );

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
      // Watchers
      //
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      $scope.$watch( 'options.selectedSignature.name', function( value ) {

          if ($scope.options.selectedSignature && $scope.options.selectedSignature.name) {

              if ($scope.getNameHits( $scope.options.selectedSignature.name ) > 1) {

                  $scope.options.selectedSignature.name = $scope.options.selectedSignature.name + ' (1)';
              }
          }

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //
      // Init app
      //
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      $scope.loadOptions();

  }])
;
