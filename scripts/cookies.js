/*
  This file contains functions for handling browser cookies.

  Author: Markus Hellgren
*/

/*
  Sets a cookie.
  The days parameter means for how many days the cookie should exist.
*/
function setCookie(name, value, days) {
  let d = new Date();
  d.setTime(d.getTime() + (days*24*60*60*1000));
  let expires = 'expires='+ d.toUTCString();
  document.cookie = name + '=' + value + ';' + expires + ';path=/';
}

/*
  Gets the value of a cookie.
*/
function getCookie(name) {
  let cookie =  document.cookie.split('; ').find(row => row.startsWith(name+'='));
  return cookie ? cookie.split('=')[1] : null;
}

/*
  Checks if a cookie is set.
*/
function cookieIsSet(name) {
  return document.cookie.split(';').some((item) => item.trim().startsWith(name+'='));
}
