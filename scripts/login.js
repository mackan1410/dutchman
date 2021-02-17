/*
  This file contains functions for logging a user in/out.

  Author: Markus Hellgren
*/

/*
  Handles login of a user.
  If the username and password matches a db entry the user is logged in and true is returned.
  Otherwise a login error is set and false is returned.
*/
function login(username, password) {
  let user = DB.getUserFromUsername(username);
  if(!user || ( password != user.password )) {
    setCookie('loginerror', null, 0.01) //set cookie for login error
    return false;
  }

  setCookie('user', user.user_id, 0.1); //store the users id
  setCookie('loginerror', null, 0); //remove cookie for login error in case it's set
  return true;
}

/*
  Logs out the currently logged in user.
*/
function logout() {
  setCookie('user', null, 0); // set expiry time to 0 in order to remove cookie
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
