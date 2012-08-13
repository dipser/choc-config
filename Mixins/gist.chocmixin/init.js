var Gister = require('gister')
  , keychain = require('keychain');

Hooks.addMenuItem('Actions/Gist/Public Gist Current Document', 'control-shift-g', function() {
  keychain.getPassword({ account: 'drudge', service: 'Chocolat Gist Plugin' }, function(err, pass) {
    if (!pass) {
      showLoginWindow();
      return;
    }
    
    var gist = new Gister({username: 'drudge', password: pass});
    var doc = Document.current()
      , file = doc.filename()
      , payload = {};
    
    file = file || 'untitled';
    payload[file] = doc.text;
    
    gist.create(payload);
    
    gist.on('created', function (d) {
      d = d || {};
      url = d.html_url;
      
      if (url) {
        Alert.show('Gist created', url, [ 'OK']);
        Clipboard.copy(url);
      }      
    });
  });
  
  showLoginWindow();
});

function saveCredentials(user) {
  Alert.show('Thing', 'other thing', ['OK']);
}

function showLoginWindow() {
  var loginWindow = new Window();
  
  loginWindow.title = 'Login to Gist';
  loginWindow.useDefaultCSS = false;
  loginWindow.htmlPath = 'login.html';
  loginWindow.buttons = [ 'Login', 'Cancel' ];
  loginWindow.setFrame({x: 0, y: 0, width: 259, height: 211}, true);
  loginWindow.onButtonClick = function(title) {
    if (title == 'Cancel') {
      loginWindow.close();
      return;
    }
    
    loginWindow.applyFunction(function() {
      var un = document.getElementById("username").value;
      var pw = document.getElementById("password").value;
      chocolat.applyFunction("saveCredentials", [un, pw]);
    }, []);    
  };
  loginWindow.onLoad = function() {
   loginWindow.applyFunction(function (data) { 
     document.getElementById('username').focus();
   }, []);
  };
  
  loginWindow.run(); 
}