angular.module('sigjar')
  .controller('OptionsController', ['$scope', '$timeout', '$sce', '$http', function($scope, $timeout, $sce, $http) {

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //
      // Variables
      //
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      $scope.options =
      {
          view: 'LOADING', //LOADING, WIZARD, OVERVIEW, TEMPLATES
          advanced: false,
          feedback: { code: null, message: null },
          userInfo:
          {
              name: '',
              picture: '',
              mobile: '',
              phone: '',
              fax: '',
              skype: '',
              facebook: '',
              twitter: '',
              linkedin: '',
              address:
              {
                  line1: '',
                  line2: ''
              },
              job:
              {
                  title: '',
                  company: ''
              },
              website:
              {
                  url: '',
                  name: ''
              },
              apps:
              {
                  appStore: '',
                  googlePlay: '',
                  microsoftStore: '',
                  amazonAppstore: ''
              }
          },
          wizard:
          {
              message: '',
              view: 'GENERAL'
          },
          messages: [],
          templates: [],
          signatures: [],
          selectedSignature: null,
          newSignature:
          {
              useTemplate: true,
              name: '',
              template: null,
              messages: []
          }
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //
      // Functions
      //
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      $scope.openTemplates = function() {

          var index = $scope.options.signatures.length + 1;

          while ($scope.isNameTaken( 'Signature ' + index )) {

              index++;
          }

          $scope.options.newSignature.name = 'Signature ' + index;

          $scope.options.view = 'TEMPLATES';
      };

      $scope.openOverview = function() {

          $scope.options.view = 'OVERVIEW';
      };

      $scope.openUserInfoWizard = function() {

          $scope.options.view = 'WIZARD';
      };

      $scope.showWizardTab = function( tab ) {

          $scope.options.wizard.view = tab;
          $scope.options.wizard.message = '';
      };

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

      $scope.getTrustedHTML = function( code ) {

          return $sce.trustAsHtml( code );
      };

      $scope.getSignaturePreview = function() {

          return $scope.getTrustedHTML( $scope.options.selectedSignature.code );
      };

      $scope.resetFeedback = function() {

          $scope.options.feedback = { code: null, message: null };
      };

      $scope.setWizardMessage = function( message ) {

          $scope.options.wizard.message = message;
      };

      $scope.replaceAll = function(target, search, replaceBy) {

          return target.replace( new RegExp( search, 'g' ), replaceBy );
      };

      $scope.parseCode = function( code ) {

          if (!code) {

              return code;
          }

          //
          // Replace all variables
          //

          //General
          code = $scope.replaceAll( code, '\\${name}', $scope.options.userInfo.name );
          code = $scope.replaceAll( code, '\\${job.title}', $scope.options.userInfo.job.title );
          code = $scope.replaceAll( code, '\\${job.company}', $scope.options.userInfo.job.company );
          code = $scope.replaceAll( code, '\\${mobile}', $scope.options.userInfo.mobile );
          code = $scope.replaceAll( code, '\\${tel}', $scope.replaceAll( $scope.options.userInfo.mobile, ' ', '' ) );
          code = $scope.replaceAll( code, '\\${website.url}', $scope.options.userInfo.website.url );
          code = $scope.replaceAll( code, '\\${website.name}', $scope.options.userInfo.website.name? $scope.options.userInfo.website.name: $scope.options.userInfo.website.url );
          code = $scope.replaceAll( code, '\\${picture}', $scope.options.userInfo.picture );

          //Other info
          code = $scope.replaceAll( code, '\\${phone}', $scope.options.userInfo.phone );
          code = $scope.replaceAll( code, '\\${fax}', $scope.options.userInfo.fax );
          code = $scope.replaceAll( code, '\\${address.line1}', $scope.options.userInfo.address.line1 );
          code = $scope.replaceAll( code, '\\${address.line2}', $scope.options.userInfo.address.line2 );

          //Social
          code = $scope.replaceAll( code, '\\${skype}', $scope.options.userInfo.skype );
          code = $scope.replaceAll( code, '\\${facebook}', $scope.options.userInfo.facebook );
          code = $scope.replaceAll( code, '\\${twitter}', $scope.options.userInfo.twitter );
          code = $scope.replaceAll( code, '\\${linkedin}', $scope.options.userInfo.linkedin );

          //Apps
          code = $scope.replaceAll( code, '\\${apps.appStore}', $scope.options.userInfo.apps.appStore );
          code = $scope.replaceAll( code, '\\${apps.googlePlay}', $scope.options.userInfo.apps.googlePlay );
          code = $scope.replaceAll( code, '\\${apps.microsoftStore}', $scope.options.userInfo.apps.microsoftStore );
          code = $scope.replaceAll( code, '\\${apps.amazonAppstore}', $scope.options.userInfo.apps.amazonAppstore );

          //Replace all newlines
          code = $scope.replaceAll( code, '\r?\n|\r', ' ' );

          //Replace all duplicate spaces with 1 space
          code = $scope.replaceAll( code, ' +(?= )', '' );

          //
          // Filter out unused tags
          //

          //Create element
          var element = $( '<div>' + code + '</div>' );

          //General
          if (!$scope.options.userInfo.job.title) {

              element.find( "#job\\.title" ).remove();
          }
          if (!$scope.options.userInfo.job.company) {

              element.find( "#job\\.company" ).remove();
          }
          if (!$scope.options.userInfo.mobile) {

              element.find( "#mobile" ).remove();
          }
          if (!$scope.options.userInfo.website.url) {

              element.find( "#website" ).remove();
          }
          if (!$scope.options.userInfo.picture) {

              element.find( "#picture" ).remove();
          }

          //Other info
          if (!$scope.options.userInfo.phone) {

              element.find( "#phone" ).remove();
          }
          if (!$scope.options.userInfo.fax) {

              element.find( "#fax" ).remove();
          }
          if (!$scope.options.userInfo.address.line1) {

              element.find( "#address\\.line1" ).remove();
          }
          if (!$scope.options.userInfo.address.line2) {

              element.find( "#address\\.line2" ).remove();
          }

          //Social
          if (!$scope.options.userInfo.skype) {

              element.find( "#skype" ).remove();
          }
          if (!$scope.options.userInfo.facebook) {

              element.find( "#facebook" ).remove();
          }
          if (!$scope.options.userInfo.twitter) {

              element.find( "#twitter" ).remove();
          }
          if (!$scope.options.userInfo.linkedin) {

              element.find( "#linkedin" ).remove();
          }

          //Apps
          if (!$scope.options.userInfo.apps.appStore) {

              element.find( "#apps\\.appStore" ).remove();
          }
          if (!$scope.options.userInfo.apps.googlePlay) {

              element.find( "#apps\\.googlePlay" ).remove();
          }
          if (!$scope.options.userInfo.apps.microsoftStore) {

              element.find( "#apps\\.microsoftStore" ).remove();
          }
          if (!$scope.options.userInfo.apps.amazonAppstore) {

              element.find( "#apps\\.amazonAppstore" ).remove();
          }

          return element.html();
      };

      $scope.getCodeFromTemplateWithMessages = function( template ) {

          var code = '';

          if (template) {

              code = template.code;

              //Add messages if needed
              for (var i = 0; i < $scope.options.messages.length; i++) {

                  var message = $scope.options.messages[i];

                  if (message.selected) {

                      code = code + message.code;
                  }
              }

              return $scope.parseCode( code );
          }

          return '';
      };

      $scope.newSignatureFromTemplate = function( name, template ) {

          var code = '';

          if (template) {

              code = $scope.getCodeFromTemplateWithMessages( template );
          }
          else {

              code = '<p>Kind regards,<br />' + $scope.options.userInfo.name + '</p>';
          }

          $scope.options.signatures.push(
              {
                  name: name,
                  code: code
              }
          );
      };

      $scope.createSignature = function() {

          var useTemplate = $scope.options.newSignature.useTemplate;

          $scope.newSignatureFromTemplate( $scope.options.newSignature.name, useTemplate? $scope.options.newSignature.template: null );
          $scope.selectSignature( $scope.options.signatures[$scope.options.signatures.length-1] );
          $scope.saveOptions( 'The signature has been created.' );

          if (!useTemplate) {

              $scope.options.advanced = true;
          }

          $scope.options.view = 'OVERVIEW';
      };

      $scope.saveUserInfo = function() {

          //If no signatures available, create one
          if ($scope.options.signatures.length == 0) {

              $scope.newSignatureFromTemplate( 'Personal', $scope.options.templates[1] );
              $scope.selectSignature( $scope.options.signatures[0] );
          }

          $scope.saveOptions();
          $scope.options.view = 'OVERVIEW';
      };

      $scope.loadTemplateCode = function( template ) {

          $http.get( template.file ).then(function(response) {

              template.code = response.data;
          });
      };

      $scope.nextTemplate = function() {

          $scope.selectTemplate( $scope.options.newSignature.template.id + 1 );
      };

      $scope.previousTemplate = function() {

          $scope.selectTemplate( $scope.options.newSignature.template.id - 1 );
      };

      $scope.selectTemplate = function( index ) {

          if (index >= $scope.options.templates.length) {

              index = 0;
          }
          else if (index < 0) {

              index = $scope.options.templates.length - 1;
          }

          $scope.options.newSignature.template = $scope.options.templates[index];
      };

      $scope.loadOptions = function() {

          //
          // Load templates...
          //

          $http.get( 'templates/templates.json' ).success(function (data) {

              //Messages
              $scope.options.messages = data.messages;

              //Load messages code
              for (var i = 0; i < $scope.options.messages.length; i++) {

                  $scope.loadTemplateCode( $scope.options.messages[i] );
              }

              //Templates
              $scope.options.templates = data.templates;

              //Load templates code
              for (i = 0; i < $scope.options.templates.length; i++) {

                  $scope.loadTemplateCode( $scope.options.templates[i] );
              }

              $scope.options.newSignature.template = $scope.options.templates[0];
          });

          //
          // Load saved settings
          //

          chrome.storage.sync.get(
              { data: {} },
              function( items ) {

                  $scope.$apply(function () {

                      //
                      // Load signatures...
                      //

                      $scope.options.signatures = items.data.signatures;
                      if ($scope.options.signatures.length > 0) {

                          $scope.selectSignature( $scope.options.signatures[0] );
                      }

                      //
                      // Load user info...
                      //

                      var userInfo = items.data.userInfo;

                      if (userInfo && userInfo.name) {

                          $scope.options.userInfo = userInfo;
                          $scope.options.view = 'OVERVIEW';
                      }
                      else {

                          $scope.options.view = 'WIZARD';
                      }
                  });
              }
          );
      };

      $scope.saveOptions = function( message ) {

          message = message || 'Settings saved.';

          for (var i = 0 ; i < $scope.options.signatures.length; i++) {

              if (!$scope.options.signatures[i].name) {

                  $scope.selectSignature( $scope.options.signatures[i] );
                  $scope.options.feedback = { code: 'NOK', message: 'Name cannot be empty!' };
                  $timeout( function() { $scope.resetFeedback(); }, 3000 );

                  return;
              }
          }

          var data =
          {
              userInfo: $scope.options.userInfo,
              signatures: $scope.options.signatures
          };

          chrome.storage.sync.set(
              { data: data },
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

      $scope.$watch( 'options.newSignature.name', function( value ) {

          if ($scope.options.newSignature && $scope.options.newSignature.name) {

              if ($scope.getNameHits( $scope.options.newSignature.name ) > 0) {

                  $scope.options.newSignature.name = $scope.options.newSignature.name + ' (1)';
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
