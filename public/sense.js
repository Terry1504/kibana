require('ace');

require('ui-bootstrap-custom');
require('ui/modules').get('kibana', ['sense.ui.bootstrap']);

require('ui/tooltip');
require('./css/sense.less');
require('./src/directives/senseHistory');
require('./src/directives/senseSettings');
require('./src/directives/senseHelp');
require('./src/directives/senseWelcome');
require('./src/directives/senseNavbar');

require('ui/chrome')
.setBrand({
  logo: 'url(/plugins/sense/icon.png) center no-repeat',
  smallLogo: 'url(/plugins/sense/icon.png) center no-repeat'
})
.setRootTemplate(require('./index.html'))
.setRootController('sense', function ($scope) {
  // require the root app code, which expects to execute once the dom is loaded up
  require('./src/app');
  const ConfigTemplate = require('ui/ConfigTemplate');
  const input = require('./src/input');
  const es = require('./src/es');
  const storage = require('./src/storage');

  this.dropdown = new ConfigTemplate({
    welcome: '<sense-welcome></sense-welcome>',
    history: '<sense-history></sense-history>',
    settings: '<sense-settings></sense-settings>',
    help: '<sense-help></sense-help>',
  });

  /**
   * Display the welcome dropdown if it has not been shown yet
   */
  if (!storage.get('version_welcome_shown')) {
    this.dropdown.open('welcome');
    storage.set('version_welcome_shown', '@@SENSE_REVISION');
  }

  this.sendSelected = () => {
    input.focus();
    input.sendCurrentRequestToES();
    return false;
  };

  this.autoIndent = (event) => {
    input.autoIndent();
    event.preventDefault();
    input.focus();
  };

  this.serverUrl = es.getBaseUrl();

  // read server url changes into scope
  es.addServerChangeListener((server) => {
    this.serverUrl = server;
  });

  // sync ui changes back to the es module
  $scope.$watch('sense.serverUrl', (serverUrl) => {
    es.setBaseUrl(serverUrl);
  });
});
