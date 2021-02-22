
/*
  This file contains functions for loading and handling the data used by
  the application.

  Author: Markus Hellgren
*/

function loadJSON(callback, file) {
    // We load the file using an XMLHttpRequest, which is part of AJAX
    //
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    // Open the file for reading. Filename is relative to the script file.
    //
    xobj.open('GET', file, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // It is necessary to use an anonymous callback as .open will NOT
            // return a value but simply returns undefined in asynchronous mode.
            //
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
};

function Data() {
  this.users = [];
  this.beverages = [];

  this.loadAll = function(callback) {
    let self = this;
    this.loadUsers()
      .then(this.loadBeverages()
        .then(function(){
          console.log(self.users, self.beverages);
          callback();
        }).catch(function(){
          console.log('failed loading resources');
        })
      ).catch(function(){
        console.log('failed loading resources');
      });
  };

  this.loadUsers = function(){
    let self = this;
    return new Promise(function(resolve, reject) {
      loadJSON(function(response){
        self.users = JSON.parse(response);
        resolve();
      }, '/thedutchman/DBFilesJSON/dutchman_table_users.json');
    });
  };

  this.loadBeverages = function(){
    let self = this;
    return new Promise(function(resolve, reject) {
      loadJSON(function(response){
        self.beverages = JSON.parse(response);
        resolve();
      }, '/thedutchman/DBFilesJSON/dutchman_table_sbl_beer.json');
    });
  }

  return this;
}

var DB = new Data();

/*
  The below functions are used for storing/loading from localStorage
*/
function initData(callback) {
  DB.loadAll(function() {
    if(getUsers() === null){
      setUsers(DB.users);
      console.log('storing users in localStorage');
    }
    if(getBeverages() === null){
      setBeverages(DB.beverages);
      console.log('Storing beverages in localstorage');
    }
    if(callback) callback();
  });
}

function removeItem(key) {
  localstorage.removeItem(key);
}

function setItem(key, value) {
  localStorage.setItem(key, value);
}

function setUsers(users) {
  setItem('users', JSON.stringify(users));
}

function setBeverages(beverages) {
  setItem('beverages', JSON.stringify(beverages));
}

function getItem(key) {
  let item = localStorage.getItem(key);
  return !item ? null : JSON.parse(item);
}

function getUsers() {
  return getItem('users');
}

function getBeverages() {
  return getItem('beverages');
}

function getUserFromUsername(username) {
  let users = getUsers();
  if(users === null) return null;
  return users.find(u => u.username === username);
}

function getUserFromId(id) {
  let users = getUsers();
  if(users === null) return null;
  return users.find(u => u.user_id === id);
}
