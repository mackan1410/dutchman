

function jsonModel() {
  this.users = [];
  this.beverages = [];

  this.loadJSON = function(callback, file) {
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
  }

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
      self.loadJSON(function(response){
        self.users = JSON.parse(response);
        resolve();
      }, 'DBFilesJSON/dutchman_table_users.json');
    });
  };

  this.loadBeverages = function(){
    let self = this;
    return new Promise(function(resolve, reject) {
      self.loadJSON(function(response){
        self.beverages = JSON.parse(response);
        resolve();
      }, 'DBFilesJSON/dutchman_table_sbl_beer.json');
    });
  }

  return this;
}


function localStorageModel() {

  this.initData = function(callback) {
    new langModel().initLanguage(); // set the system language if not set
    let jsonFuncs = new jsonModel();
    jsonFuncs.loadAll(function() {
      let userFuncs = new userModel();
      if(userFuncs.getUsers() === null){
        userFuncs.setUsers(jsonFuncs.users);
        console.log('storing users in localStorage');
      }
      let bevFuncs = new beverageModel();
      if(bevFuncs.getBeverages() === null){
        bevFuncs.setBeverages(jsonFuncs.beverages);
        console.log('Storing beverages in localstorage');
      }
      let orderFuncs = new orderModel();
      if(orderFuncs.getOrders() === null){
        orderFuncs.setOrders([]);
      }
      if(callback) callback();
    });
  }

  this.setItem = function(key, value) {
    localStorage.setItem(key, value);
  }

  this.removeItem = function(key) {
    localStorage.removeItem(key);
  }

  this.getItem = function(key) {
    let item = localStorage.getItem(key);
    return !item ? null : JSON.parse(item);
  }

  return this;
}

function cookieModel() {
  this.setCookie = function(name, value, days) {
    let d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    let expires = 'expires='+ d.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
  }

  this.getCookie = function(name) {
    let cookie =  document.cookie.split('; ').find(row => row.startsWith(name+'='));
    return cookie ? cookie.split('=')[1] : null;
  }

  this.cookieIsSet = function(name) {
    return document.cookie.split(';').some((item) => item.trim().startsWith(name+'='));
  }

  return this;
}


function loginModel() {
  this.dict = {
    'sv': {
      'header': 'Logga in',
      'userFieldText': 'Användarnamn...',
      'passwordFieldText': 'Lösenord...',
      'submitBtnText': 'Logga in',
      'loginErrorMessage': 'Felaktigt användarnamn eller lösenord'
    },
    'en': {
      'header': 'Login',
      'userFieldText': 'Username...',
      'passwordFieldText': 'Password...',
      'submitBtnText': 'Login',
      'loginErrorMessage': 'Wrong username or password'
    },
    'hi': {
      'header': 'लॉग इन करें',
      'userFieldText': 'उपयोगकर्ता नाम...',
      'passwordFieldText': 'कुंजिका...',
      'submitBtnText': 'लॉग इन करें',
      'loginErrorMessage': 'उपयोगकर्ता का गलत नाम और पासवर्ड। पुनः प्रयास करें।'
    }
  }

  this.getAll = function() {
    return {
      'dict': this.dict[new langModel().getLanguage()],
      'loggedIn': this.loggedIn(),
      'userId': this.getUserId(),
      'userCredentials': this.getUserCredentials(),
      'loginError': this.loginError()
    }
  }

  this.login = function(username, password) {
    console.log(username, password);
    let userFuncs = new userModel();
    let cookieFuncs = new cookieModel();
    let user = userFuncs.getUserFromUsername(username);//DB.getUserFromUsername(username);
    if(!user || ( password != user.password )) {
      cookieFuncs.setCookie('loginerror', null, 0.01) //set cookie for login error
      return false;
    }
    cookieFuncs.setCookie('user', JSON.stringify({'id': user.user_id, 'credentials': user.credentials}), 0.1); //store the users id and credentials
    cookieFuncs.setCookie('loginerror', null, 0); //remove cookie for login error in case it's set
    return true;
  }

  /*
    Logs out the currently logged in user.
  */
  this.logout = function() {
    let cookieFuncs = new cookieModel();
    cookieFuncs.setCookie('shoppingCart', null, 0); // remove the shopping cart
    cookieFuncs.setCookie('cartUndoRedo', null, 0); // remove the undo and redo stack for the cart
    cookieModel.setCookie('user', null, 0); // set expiry time to 0 in order to remove cookie
  }

  /*
    Get the id of the currently logged in user
  */
  this.getUserId = function() {
    let cookieFuncs = new cookieModel();
    let userObject = JSON.parse(cookieFuncs.getCookie('user'));
    return userObject ? userObject.id : null;
  }

  /*
    Get the credentials of the currently logged in user
  */
  this.getUserCredentials = function() {
    let cookieFuncs = new cookieModel();
    let userObject = JSON.parse(cookieFuncs.getCookie('user'));
    return userObject ? userObject.credentials : null;
  }

  /*
    Checks if there is a login error.
  */
  this.loginError = function() {
    let cookieFuncs = new cookieModel();
    return cookieFuncs.cookieIsSet('loginerror');
  }

  this.loggedIn = function() {
    let cookieFuncs = new cookieModel();
    return cookieFuncs.cookieIsSet('user');
  }

  return this;
}

function langModel() {
  this.getLanguage = function() {
    //let localS = new localStorageModel();
    return localStorage.getItem('language');
    //return localS.getItem('language');
  }

  this.setLanguage = function(lang) {
    let localS = new localStorageModel();
    localS.setItem('language', lang);
  }

  this.initLanguage = function() {
    if(this.getLanguage()) return;
    this.setItem('language', 'sv');
  }
  return this;
}


function userModel() {
  this.setUsers = function(users) {
    let localS = new localStorageModel();
    localS.setItem('users', JSON.stringify(users));
  }

  this.getUsers = function() {
    let localS = new localStorageModel();
    return localS.getItem('users');
  }

  this.getUserFromUsername = function(username) {
    let users = this.getUsers();
    if(users === null) return null;
    return users.find(u => u.username === username);
  }

  this.getUserFromId = function(id) {
    let users = this.getUsers();
    if(users === null) return null;
    return users.find(u => u.user_id === id);
  }

  return this;
}


function beverageModel() {
  this.sortingTypes = {
    'sv': {
      'standard': {
        'text': 'Standardsortering',
        'value': '0'
      },
      'lowAbv': {
        'text': 'Sortera efter alkoholhalt(lägst först)',
        'value': '1'
      },
      'highAbv': {
        'text': 'Sortera efter alkoholhalt(högst först)',
        'value': '2'
      },
      'lowPrice': {
        'text': 'Sortera efter pris(lägst först)',
        'value': '3'
      },
      'highPrice': {
        'text': 'Sortera efter pris(högst först)',
        'value': '4'
      }
    },
    'en': {
      'standard': {
        'text': 'Standard',
        'value': '0'
      },
      'lowAbv': {
        'text': 'Alcohol content(lowest first)',
        'value': '1'
      },
      'highAbv': {
        'text': 'Alcohol content(highest first)',
        'value': '2'
      },
      'lowPrice': {
        'text': 'Price(lowest first)',
        'value': '3'
      },
      'highPrice': {
        'text': 'Price(highest first)',
        'value': '4'
      }
    },
    'hi': {
      'standard': {
        'text': 'मानक',
        'value': '0'
      },
      'lowAbv': {
        'text': 'शराब की मात्रा (सबसे पहले)',
        'value': '1'
      },
      'highAbv': {
        'text': 'शराब की मात्रा (सबसे पहले)',
        'value': '2'
      },
      'lowPrice': {
        'text': 'क़ीमत: पहला सबसे कम)',
        'value': '3'
      },
      'highPrice': {
        'text': 'मूल्य: उच्चतम पहले)',
        'value': '4'
      }
    }
  };
  this.beverageTypes = {
    'sv': {
      'beer': {
        'text': 'öl',
        'value': '1'
      },
      'wine': {
        'text': 'vin',
        'value': '2'
      },
      'spirits': {
        'text': 'sprit',
        'value': '3'
      }
    },
    'en': {
      'beer': {
        'text': 'beer',
        'value': '1'
      },
      'wine': {
        'text': 'wine',
        'value': '2'
      },
      'spirits': {
        'text': 'spirits',
        'value': '3'
      }
    },
    'hi': {
      'beer': {
        'text': 'बीयर',
        'value': '1'
      },
      'wine': {
        'text': 'शराब',
        'value': '2'
      },
      'spirits': {
        'text': 'शराब',
        'value': '3'
      }
    }
  };

  this.getSortingTypes = function() {
    return this.sortingTypes[new langModel().getLanguage()];
  }

  this.getBeverageTypes = function() {
    return this.beverageTypes[new langModel().getLanguage()];
  }

  this.getBeverages = function() {
    let localS = new localStorageModel();
    return localS.getItem('beverages');
  }

  this.setBeverages = function(beverages) {
    let localS = new localStorageModel();
    localS.setItem('beverages', JSON.stringify(beverages));
  }

  this.beverageExists = function(articleId) {
    let beverages = this.getBeverages();
    if(beverages === null) return null;
    return beverages.find(bev => bev.artikelid === articleId);
  }

  this.getBeverageFromArticleId = function(articleId) {
    let beverages = this.getBeverages();
    if(beverages === null) return null;
    return beverages.find(b => b.artikelid === articleId);
  }

  this.removeBeverageByArticleId = function(articleId) {
    let beverages = this.getBeverages();
    if(beverages === null) return null;
    let afterRemoval = beverages.filter(b => b.artikelid !== articleId);
    this.setBeverages(afterRemoval);
  }

  this.addBeverage = function(beverage) {
    if(!beverage) return;
    let beverages = this.getBeverages();
    if(beverages === null) return null;
    beverages.push(beverage);
    this.setBeverages(beverages);
  }

  this.changeBeverageByArticleId = function(articleId, newBeverage) {
    let beverages = this.getBeverages();
    let changed = beverages.map(b => b.artikelid === articleId ? newBeverage : b);
    this.setBeverages(changed);
  }

  this.filterBeverages = function(filters) {
    let beverages = this.getBeverages();
    if(beverages === null) return null;
    let self = this;
    return beverages.filter(i => {
      return ( i.dryckestyp === self.getBeverageTypes().beer.value && filters[0] ) ||
             ( i.dryckestyp === self.getBeverageTypes().wine.value && filters[1] ) ||
             ( i.dryckestyp === self.getBeverageTypes().spirits.value && filters[2] );
    });
  }

  this.sortBeverages = function(beverages, sortingType) {
    let self = this;
    beverages.sort((a, b) => {
      // sort by alcohol content(lowest first)
      if(sortingType === self.getSortingTypes().lowAbv.value) {
        return (parseFloat(a.alkoholhalt.slice(0, -1)) - parseFloat(b.alkoholhalt.slice(0, -1)));
      }
      // sort by alcohol content(highest first)
      if(sortingType === self.getSortingTypes().highAbv.value) {
        return (parseFloat(b.alkoholhalt.slice(0, -1)) - parseFloat(a.alkoholhalt.slice(0, -1)));
      }
      // sort by price(lowest price first)
      if(sortingType === self.getSortingTypes().lowPrice.value) {
        return (parseFloat(a.prisinklmoms) - parseFloat(b.prisinklmoms));
      }
      // sort by price(highest price first)
      if(sortingType === self.getSortingTypes().highPrice.value) {
        return (parseFloat(b.prisinklmoms) - parseFloat(a.prisinklmoms));
      }
    })
  }

  return this;
}


function orderModel() {
  this.tables = ['1','2','3','4','5','6'];

  this.getTables = function() {
    return this.tables;
  }

  this.getOrders = function() {
    let localS = new localStorageModel();
    return localS.getItem('orders');
  }

  this.setOrders = function(orders) {
    let localS = new localStorageModel();
    localS.setItem('orders', JSON.stringify(orders));
  }

  this.getOrdersByUserId = function(id) {
    let orders = this.getOrders();
    if(orders === null) return [];

    return orders.filter(o => o.id != id);
  }

  this.addOrder = function(order) {
    let orders = this.getOrders();
    orders.push(order);
    this.setOrders(orders);
  }

  return this;
}



function cartModel() {
  this.dict = {
    'sv': {
      'itemCategoryHeader': 'Dryck',
      'priceCategoryHeader': 'Pris',
      'totalPrice': 'Totalt pris',
      'btnText': 'Beställ',
      'cartEmptyMessage': 'Din beställning är tom',
      'currency': 'kr',
      'undoBtnText': 'Ångra?',
      'redoBtnText': 'Ta tillbaka?',
      'selectTablePrompt': 'Välj ditt bord'
    },
    'en': {
      'itemCategoryHeader': 'Beverage',
      'priceCategoryHeader': 'Price',
      'totalPrice': 'Total price',
      'btnText': 'Order',
      'cartEmptyMessage': 'Your order is empty',
      'currency': '$',
      'undoBtnText':  'Undo?',
      'redoBtnText': 'Redo?',
      'selectTablePrompt': 'Select your table'
    },
    'hi': {
      'itemCategoryHeader': 'पेय पदार्थ',
      'priceCategoryHeader': 'कीमत',
      'totalPrice': 'कुल कीमत',
      'btnText': 'गण',
      'cartEmptyMessage': 'आपका आदेश खाली है',
      'currency': '₹',
      'undoBtnText':  'पूर्ववत करें?',
      'redoBtnText': 'फिर से करें?',
      'selectTablePrompt': 'अपनी तालिका का चयन करें'
    }
  }

  this.getAll = function() {
    let lang = new langModel().getLanguage();
    return {
      dict: this.dict[lang],
      items: this.getCartItems(),
      totalCost: this.getCartCost(),
      undoRedo: this.getCartUndoRedo()
    };
  }

  this.getCart = function() {
    let cookieFuncs = new cookieModel();
    let cart = cookieFuncs.getCookie('shoppingCart');
    return cart ? JSON.parse(cart) : null;
  }

  this.setCart = function(cart) {
    let cookieFuncs = new cookieModel();
    cookieFuncs.setCookie('shoppingCart', JSON.stringify(cart));
  }

  this.getCartItems = function() {
    let bevFuncs = new beverageModel();
    let cart = this.getCart();
    return cart ? cart.items.map(id => bevFuncs.getBeverageFromArticleId(id)) : null;
  }

  this.getCartCost = function() {
    let cart = this.getCart();
    return cart ? cart.cost : 0;
  }

  this.getCartUndoRedo = function() {
    let cookieFuncs= new cookieModel();
    let undoRedo = cookieFuncs.getCookie('cartUndoRedo');
    return undoRedo ? JSON.parse(undoRedo) : null;
  }

  this.setCartUndoRedo = function(undoRedo) {
    let cookieFuncs = new cookieModel();
    cookieFuncs.setCookie('cartUndoRedo', JSON.stringify(undoRedo));
  }

  this.undoCart = function() {
    let cart = this.getCart();
    let savedUndoRedo = this.getCartUndoRedo();
    let undoRedo = new undoRedoManager(savedUndoRedo.undoStack, savedUndoRedo.redoStack);
    let self = this;
    undoRedo.undo(cart, function(prev) {
      self.setCart(prev);
    });
    this.setCartUndoRedo(undoRedo);
  }

  this.redoCart = function() {
    let cart = this.getCart();
    let savedUndoRedo = this.getCartUndoRedo();
    let undoRedo = new undoRedoManager(savedUndoRedo.undoStack, savedUndoRedo.redoStack);
    let self = this;
    undoRedo.redo(cart, function(prev) {
      self.setCart(prev);
    });
    this.setCartUndoRedo(undoRedo);
  }

  this.createShoppingCart = function() {
    if(this.getCart() !== null) return; // if a cart already exists
    let cart = {
      'items': [],
      'cost': 0
    };
    this.setCart(cart);
    let undoRedo = new undoRedoManager();
    this.setCartUndoRedo(undoRedo);
  }

  this.onCartAction = function(cart) {
    let savedUndoRedo = this.getCartUndoRedo();
    let undoRedo = new undoRedoManager(savedUndoRedo.undoStack, savedUndoRedo.redoStack);
    undoRedo.pushUndo(cart);
    this.setCartUndoRedo(undoRedo);
  }

  this.addToCart = function(articleId) {
    let bevFuncs = new beverageModel();
    let cart = this.getCart(); // get the shopping cart object
    if(cart === null) this.createShoppingCart();
    this.onCartAction(cart);
    cart = this.getCart();
    cart.items.push(articleId);  // add the new item to the existing cart
    let beverage = bevFuncs.getBeverageFromArticleId(articleId);
    cart.cost += parseFloat(beverage.prisinklmoms);
    this.setCart(cart);
  }

  this.removeFromCart = function(articleId) {
    let bevFuncs = new beverageModel();
    let cart = this.getCart(); // get the shopping cart object
    if(cart === null || cart.items.length === 0) return; // if the cart does not exist or is empty, we can't remove from it
    this.onCartAction(cart);
    let firstIdx = cart.items.findIndex(itm => itm == articleId);
    cart.items.splice(firstIdx,1);
    let beverage = bevFuncs.getBeverageFromArticleId(articleId);
    cart.cost -= parseFloat(beverage.prisinklmoms);
    this.setCart(cart);
  }

  this.checkoutCart = function(table) {
    // Store the order in an order table in localStorage
    // Delete the shopping cart
    let cart = this.getCart();
    if(cart === null || !cart.items.length) return null;

    let loginFuncs = new loginModel();
    let userId = loginFuncs.getUserId();
    let order = {
      'user': userId,
      'table': table,
      'order': cart
    };

    //TODO: make sure the shopping cart cost is removed from the users account
    let orderFuncs = new orderModel();
    let cookieFuncs = new cookieModel();
    orderFuncs.addOrder(order);
    cookieFuncs.setCookie('shoppingCart', null, 0);
    cookieFuncs.setCookie('cartUndoRedo', null, 0);
  }

  return this;
}


function menuModel() {
    this.dict = {
      'sv': {
        'addBtnText': 'Lägg till',
        'dragNdropText': 'Dra produkt hit för att lägga till',
        'currency': 'kr',
        'hits': 'Träffar',
        'cartLinkText': 'Se din beställning',
        'addMessage': 'har lagts till i din beställning.'
      },
      'en': {
        'addBtnText': 'Add to order',
        'dragNdropText': 'Drag and drop here',
        'currency': '$',
        'hits': 'Hits',
        'cartLinkText': 'See order',
        'addMessage': 'has been added to your order.'
      },
      'hi': {
        'addBtnText': 'आदेश में जोड़ें',
        'dragNdropText': 'यहां खींचें और छोड़ें',
        'currency': '₹',
        'hits': 'हिट्स',
        'cartLinkText': 'आदेश देखें',
        'addMessage': 'आपके आदेश में जोड़ दिया गया है.'
      }
    };

    this.getAll = function() {
      let bevFuncs = new beverageModel();
      let lang = new langModel().getLanguage();
      return {
        dict: this.dict[lang],
        items: bevFuncs.getBeverages(),
        sortingTypes: bevFuncs.getSortingTypes(),
        filters: bevFuncs.getBeverageTypes(),
        loggedIn: new loginModel().loggedIn()
      };
    }

    this.filterSort = function(sortingType, beerFilter, wineFilter, spiritsFilter) {
      let bevFuncs = new beverageModel();
      let filtered = bevFuncs.filterBeverages(beerFilter, wineFilter, spiritsFilter);
      bevFuncs.sortBeverages(filtered, sortingType);
      return filtered;
    }

    this.addToOrder = function(articleId, sortingType, beerFilter, wineFilter, spiritsFilter) {
      let cartFuncs = new cartModel();
      let bevFuncs = new beverageModel();
      cartFuncs.addToCart(articleId);
      let beverage = bevFuncs.getBeverageFromArticleId(articleId);
      return beverage.namn;
    }

    return this;
}


function managerModel() {
  this.dict = {
    'sv': {
      'mainHeader': 'Alla drycker',
      'addNewDropdownBtnText': 'Lägg till ny dryck',
      'addNewNameFieldText': 'Namn',
      'addNewIdFieldText': 'Artikel ID',
      'addNewPriceFieldText': 'Pris',
      'addNewAbvFieldText': 'Volymprocent alkohol(vol)',
      'addNewAmountFieldText': 'Antal i lager',
      'addNewTypeFieldText': 'Dryckeskategori',
      'addNewBeerOptText': 'Öl',
      'addNewWineOptText': 'Vin',
      'addNewSpiritsOptText': 'Sprit',
      'addNewBtnText': 'Lägg till',
      'nameFieldCategoryText': 'Dryck(id)',
      'removeBtnCategoryText': 'Ta bort',
      'editBtnCategoryText': 'Redigera',
      'updateBtnText': 'Uppdatera',
      'removeConfirmMessage': 'Vill du verkligen ta bort den här drycken?',
      'editConfirmMessage': 'Vill du verkligen redigera den här drycken?'
    },
    'en': {
      'mainHeader': 'All beverages',
      'addNewDropdownBtnText': 'Add new beverage',
      'addNewNameFieldText': 'Name',
      'addNewIdFieldText': 'Article ID',
      'addNewPriceFieldText': 'Price',
      'addNewAbvFieldText': 'Alcohol by volume(abv)',
      'addNewAmountFieldText': 'Number in stock',
      'addNewTypeFieldText': 'Beverage category',
      'addNewBeerOptText': 'Beer',
      'addNewWineOptText': 'Wine',
      'addNewSpiritsOptText': 'Spirits',
      'addNewBtnText': 'Add',
      'nameFieldCategoryText': 'Beverage(id)',
      'removeBtnCategoryText': 'Remove',
      'editBtnCategoryText': 'Edit',
      'updateBtnText': 'Update',
      'removeConfirmMessage': 'Do you really want to remove this item?',
      'editConfirmMessage': 'Do you really want to edit this item?'
    },
    'hi': {
      'mainHeader': 'सभी पेय पदार्थ',
      'addNewDropdownBtnText': 'नया पेय जोड़ें',
      'addNewNameFieldText': 'नाम',
      'addNewIdFieldText': 'अनुच्छेद आईडी',
      'addNewPriceFieldText': 'पंचायती राज संस्थाओं',
      'addNewAbvFieldText': 'मात्रा द्वारा शराब (abv)',
      'addNewAmountFieldText': 'स्टॉक में नंबर',
      'addNewTypeFieldText': 'पेय की श्रेणी',
      'addNewBeerOptText': 'बीयर',
      'addNewWineOptText': 'शराब',
      'addNewSpiritsOptText': 'आत्माओं',
      'addNewBtnText': 'जोड़ना',
      'nameFieldCategoryText': 'सदाबहार (आईडी)',
      'removeBtnCategoryText': 'हटाएं',
      'editBtnCategoryText': 'संपादित करें',
      'updateBtnText': 'अपडेट करें',
      'removeConfirmMessage': 'क्या आप वास्तव में इस आइटम को निकालना चाहते हैं?',
      'editConfirmMessage': 'क्या आप वास्तव में इस आइटम को संपादित करना चाहते हैं?'
    }
  }

  this.getAll = function() {
    return {
      'dict': this.dict[new langModel().getLanguage()],
      'items': new beverageModel().getBeverages()
    };
  }

  this.submitNewItem = function(newItem) {
    let bevFuncs = new beverageModel();
    if(bevFuncs.beverageExists(newItem.artikelid)) return;
    bevFuncs.addBeverage(newItem);
  }

  this.updateItem = function(id, newPrice, newAmount) {
    let bevFuncs = new beverageModel();
    let beverage = bevFuncs.getBeverageFromArticleId(id);
    beverage.prisinklmoms = newPrice;
    beverage.amount = newAmount;
    bevFuncs.changeBeverageByArticleId(id, beverage);
  }

  this.removeItem = function(id) {
    let bevFuncs = new beverageModel();
    bevFuncs.removeBeverageByArticleId(id);
  }

  return this;
}


function navbarModel() {
  this.dict = {
    'sv': {
      'cartOptText': {
        'text': 'Min order',
        'href': 'MVCcart.html'
      },
      'menuOptText': {
        'text': 'Meny',
        'href': 'MVCmenu.html'
      },
      'specialDrink': {
        'text' : 'Special drinkar',
        'href' : 'MVCspecialDrinks.html'
      },
      'managerSecText': {
        'text': 'Ring Securitas',
        'href': 'MVCmanager.html'
      },
      'secAlert': {
        'text': 'Säkerhetsvakterna är på väg',
        'href': 'MVCmanager.html'
      },
      'managerOptText': {
        'text': 'Hantera lagret',
        'href': 'MVCmanager.html'
      },
      'myAccountOptText': {
        'text': 'Mitt konto',
        'href': 'user.html'
      },
      'loginOptText': {
        'text': 'Logga in',
        'href': 'MVClogin.html'
      },
      'logoutOpt': {
        'text': 'Logga ut',
        'href': './'
      },
      'barviewOptText': {
        'text': 'Bordsöversikt',
        'href': 'tableview.html'
      }
    },
    'en': {
      'cartOptText': {
        'text': 'My order',
        'href': 'MVCcart.html'
      },
      'managerSecText': {
        'text': 'Call sercurity',
        'href': 'MVCmanager.html'
      },
      'specialDrink': {
        'text' : 'Special drink',
        'href' : 'MVCspecialDrinks.html'
      },
      'secAlert': {
        'text': 'Security is on its way',
        'href': 'MVCmanager.html'
      },
      'menuOptText': {
        'text': 'Menu',
        'href': 'MVCmenu.html'
      },
      'managerOptText': {
        'text': 'Manage stock',
        'href': 'MVCmanager.html'
      },
      'myAccountOptText': {
        'text': 'My account',
        'href': 'user.html'
      },
      'loginOptText': {
        'text': 'Login',
        'href': 'MVClogin.html'
      },
      'logoutOpt': {
        'text': 'Logout',
        'href': './'
      },
      'barviewOptText': {
        'text': 'Table overview',
        'href': 'tableview.html'
      }
    },
    'hi': {
      'cartOptText': {
        'text': 'मेरा आदेश',
        'href': 'MVCcart.html'
      },
      'menuOptText': {
        'text': 'मेन्य',
        'href': 'MVCmenu.html'
      },
      'managerSecText': {
        'text': 'सुरक्षा को बुलाओ',
        'href': 'MVCmanager.html'
      },
      'specialDrink': {
        'text' : 'विशेष पेय',
        'href' : 'MVCspecialDrinks.html'
      },
      'secAlert': {
        'text': 'सुरक्षा जारी है',
        'href': 'MVCmanager.html'
      },
      'managerOptText': {
        'text': 'स्टॉक प्रबंधित करें',
        'href': 'MVCmanager.html'
      },
      'myAccountOptText': {
        'text': 'मेरा खाता',
        'href': 'user.html'
      },
      'loginOptText': {
        'text': 'लॉग इन करें',
        'href': 'MVClogin.html'
      },
      'logoutOpt': {
        'text': 'लॉग आउट',
        'href': './'
      },
      'barviewOptText': {
        'text': 'तालिका अवलोकन',
        'href': 'tableview.html'
      }
    }
  }

  this.getAll = function() {
    let userFuncs = new userModel();
    let loginFuncs = new loginModel();
    let user = loginFuncs.loggedIn() ? userFuncs.getUserFromId(loginFuncs.getUserId()) : null;
    return {
      'dict': this.dict[new langModel().getLanguage()],
      'username': user ? user.username : null,
      'credentials': user ? user.credentials : null
    }
  }

  this.logout = function() {
    new loginModel().logout();
  }

  return this;
}
