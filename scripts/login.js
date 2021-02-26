/*
  This file contains functions for logging a user in/out.
  It also contains functions for creating the login page user interface.

  Author: Markus Hellgren
*/

function displayLoginForm(container) {
  const lang = getLanguage();
  const dict = {
    'header': {
      'sv': 'Logga in',
      'en': 'Login'
    },
    'userFieldText': {
      'sv': 'Användarnamn...',
      'en': 'Username...',
    },
    'passwordFieldText': {
      'sv': 'Lösenord',
      'en': 'Password'
    },
    'submitBtnText': {
      'sv': 'Logga in',
      'en': 'Login'
    },
    'loginErrorMessage': {
      'sv': 'Felaktigt användarnamn eller lösenord',
      'en': 'Wrong username or password. Try again.'
    }
  }

  container.append($.parseHTML(`
    <div class="form-container">
      <h1>${dict.header[lang]}</h1>
      <form id="login-form" onsubmit="loginFormSubmit()">
        <input type="text" id="username" name="username" value="" placeholder="${dict.userFieldText[lang]}"><!--br><br-->
        <input type="text" id="password" name="password" value="" placeholder="${dict.passwordFieldText[lang]}"><br>
        <p class="error-message">${loginError() ? dict.loginErrorMessage[lang] : ''}</p>
        <input type="submit" value="${dict.submitBtnText[lang]}"  />
      </form>
    </div>`));
}

function loginFormSubmit() {
  let username = document.getElementById('username').value; //get submitted username
  let password = document.getElementById('password').value; //get submitted password
  login(username, password);
}

/*
  Handles login of a user.
  If the username and password matches a db entry the user is logged in and true is returned.
  Otherwise a login error is set and false is returned.
*/
function login(username, password) {
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
function logout() {
  setCookie('shoppingCart', null, 0);
  setCookie('user', null, 0); // set expiry time to 0 in order to remove cookie
}

/*
  Get the id of the currently logged in user
*/
function getUserId() {
  let userObject = JSON.parse(getCookie('user'));
  return userObject ? userObject.id : null;
}

/*
  Get the credentials of the currently logged in user
*/
function getUserCredentials() {
  let userObject = JSON.parse(getCookie('user'));
  return userObject ? userObject.credentials : null;
}

/*
  Checks if a user is logged in.
*/
function loggedIn() {
  return cookieIsSet('user');
}

/*
  Checks if there is a login error.
*/
function loginError() {
  return cookieIsSet('loginerror');
}
