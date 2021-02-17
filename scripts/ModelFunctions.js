
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

  this.getUserFromUsername = function(username){
    return this.users.find(u => u.username == username);
  }

  this.getUserFromId = function(id){
    return this.users.find(u => u.user_id == id);
  }

  return this;
}

var DB = new Data();
