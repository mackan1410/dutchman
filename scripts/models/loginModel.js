function loginModel() {
  this.language = getLanguage();
  this.dict = {
    'header': {
      'sv': 'Logga in',
      'en': 'Login',
      'hi' : 'लॉग इन करें'
    },
    'userFieldText': {
      'sv': 'Användarnamn...',
      'en': 'Username...',
      'hi' : 'उपयोगकर्ता नाम...'
    },
    'passwordFieldText': {
      'sv': 'Lösenord...',
      'en': 'Password...',
      'hi' : 'कुंजिका...'
    },
    'submitBtnText': {
      'sv': 'Logga in',
      'en': 'Login',
      'hi' : 'लॉग इन करें'
    },
    'loginErrorMessage': {
      'sv': 'Felaktigt användarnamn eller lösenord',
      'en': 'Wrong username or password. Try again.',
      'hi' : 'उपयोगकर्ता का गलत नाम और पासवर्ड। पुनः प्रयास करें।'
    }
  };

  this.getAll = function() {
    console.log("get all");
    return {
      'lang': this.language,
      'dict': this.dict,
      'loggedIn': this.loggedIn(),
      'userId': this.getUserId(),
      'userCredentials': this.getUserCredentials(),
      'loginError': this.loginError()
    };
  }

  this.login = function(username, password) {
    let user = getUserFromUsername(username);//DB.getUserFromUsername(username);
    if(!user || ( password != user.password )) {
      setCookie('loginerror', null, 0.01) //set cookie for login error
      return false;
    }
    setCookie('user', JSON.stringify({'id': user.user_id, 'credentials': user.credentials}), 0.1); //store the users id and credentials
    setCookie('loginerror', null, 0); //remove cookie for login error in case it's set
    return true;
  }

  /*
    Logs out the currently logged in user.
  */
  this.logout = function() {
    setCookie('shoppingCart', null, 0); // remove the shopping cart
    setCookie('cartUndoRedo', null, 0); // remove the undo and redo stack for the cart
    setCookie('user', null, 0); // set expiry time to 0 in order to remove cookie
  }

  /*
    Get the id of the currently logged in user
  */
  this.getUserId = function() {
    let userObject = JSON.parse(getCookie('user'));
    return userObject ? userObject.id : null;
  }

  /*
    Get the credentials of the currently logged in user
  */
  this.getUserCredentials = function() {
    let userObject = JSON.parse(getCookie('user'));
    return userObject ? userObject.credentials : null;
  }

  /*
    Checks if there is a login error.
  */
  this.loginError = function() {
    return cookieIsSet('loginerror');
  }

  this.loggedIn = function() {
    return cookieIsSet('user');
  }
}
