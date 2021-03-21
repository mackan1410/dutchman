function cartModel() {
  this.language = getLanguage();
  this.dict = {
      'itemCategoryHeader': {
        'sv': 'Dryck',
        'en': 'Beverage',
        'hi' : 'पेय पदार्थ'
      } ,
      'priceCategoryHeader': {
        'sv': 'Pris',
        'en': 'Price',
        'hi' : 'कीमत'
      } ,
      'totalPrice': {
        'sv': 'Totalt pris',
        'en': 'Total price',
        'hi' : 'कुल कीमत'
      },
      'btnText': {
        'sv': 'Beställ',
        'en': 'Order',
        'hi' : 'गण'
      },
      'cartEmptyMessage': {
        'sv': 'Din beställning är tom',
        'en': 'Your order is empty',
        'hi' : 'आपका आदेश खाली है'
      },
      'currency': {
        'sv': 'kr',
        'en': '$',
        'hi' : '₹'
      },
      'undoBtnText': {
        'sv': 'Ångra?',
        'en': 'Undo?',
        'hi' : 'पूर्ववत करें?'
      },
      'redoBtnText': {
        'sv': 'Ta tillbaka?',
        'en': 'Redo?',
        'hi' : 'फिर से करें?'
      },
      'selectTablePrompt': {
        'sv': 'Välj ditt bord',
        'en': 'Select your table',
        'hi' : 'अपनी तालिका का चयन करें'
      }
  };

  this.getAll = function() {
    return {
      lang: this.language,
      dict: this.dict,
      items: this.getCartItems(),
      totalCost: this.getCartCost(),
      undoRedo: this.getCartUndoRedo()
    };
  }

  // get the cart cookie. A list of article IDs along with the total cart cost
  this.getCart = function() {
    let cart = getCookie('shoppingCart');
    return cart ? JSON.parse(cart) : null;
  }

  // get the actual item objects for the IDs in the cart
  this.getCartItems = function() {
    let cart = this.getCart();
    return cart ? cart.items.map(id => getBeverageFromArticleId(id)) : null;
  }

  // get the total cost of the cart
  this.getCartCost = function() {
    let cart = this.getCart();
    return cart ? cart.cost : 0;
  }

  this.getCartUndoRedo = function() {
    let undoRedo = getCookie('cartUndoRedo');
    return undoRedo ? JSON.parse(undoRedo) : null;
  }

  this.undoCart = function() {
    let cart = this.getCart();
    let savedUndoRedo = this.getCartUndoRedo();
    let undoRedo = new undoRedoManager(savedUndoRedo.undoStack, savedUndoRedo.redoStack);
    undoRedo.undo(cart, function(prev) {
      setCookie('shoppingCart', JSON.stringify(prev));
    });
    setCookie('cartUndoRedo', JSON.stringify(undoRedo));
  }

  this.redoCart = function() {
    let cart = this.getCart();
    let savedUndoRedo = this.getCartUndoRedo();
    let undoRedo = new undoRedoManager(savedUndoRedo.undoStack, savedUndoRedo.redoStack);
    undoRedo.redo(cart, function(prev) {
      setCookie('shoppingCart', JSON.stringify(prev));
    });
    setCookie('cartUndoRedo', JSON.stringify(undoRedo));
  }

  this.createShoppingCart = function() {
    if(this.getCart() !== null) return; // if a cart already exists
    let cart = {
      'items': [],
      'cost': 0
    };
    setCookie('shoppingCart', JSON.stringify(cart));

    let undoRedo = new undoRedoManager();
    setCookie('cartUndoRedo', JSON.stringify(undoRedo));
  }

  this.addToCart = function(articleId) {
    let cart = this.getCart(); // get the shopping cart object
    if(cart === null){ // if the cart does not exist, create one
      this.createShoppingCart();
    }

    let savedUndoRedo = JSON.parse(getCookie('cartUndoRedo'));
    let undoRedo = new undoRedoManager(savedUndoRedo.undoStack, savedUndoRedo.redoStack);
    undoRedo.pushUndo(cart);
    setCookie('cartUndoRedo', JSON.stringify(undoRedo));

    cart = this.getCart();
    cart.items.push(articleId);  // add the new item to the existing cart
    let beverage = getBeverageFromArticleId(articleId);
    cart.cost += parseFloat(beverage.prisinklmoms);
    setCookie('shoppingCart', JSON.stringify(cart)); // reset the shoppng cart cookie
  }


  this.removeFromCart = function(articleId) {
    let cart = this.getCart(); // get the shopping cart object
    if(cart === null || cart.items.length === 0) return; // if the cart does not exist or is empty, we can't remove from it

    // push to the undo queue
    let savedUndoRedo = JSON.parse(getCookie('cartUndoRedo'));
    let undoRedo = new undoRedoManager(savedUndoRedo.undoStack, savedUndoRedo.redoStack);
    undoRedo.pushUndo(cart);
    setCookie('cartUndoRedo', JSON.stringify(undoRedo));

    let firstIdx = cart.items.findIndex(itm => itm == articleId);
    cart.items.splice(firstIdx,1);
    let beverage = getBeverageFromArticleId(articleId);
    cart.cost -= parseFloat(beverage.prisinklmoms);
    setCookie('shoppingCart', JSON.stringify(cart)); // restore the cookie
  }

  this.checkoutCart = function(table) {
    // Store the order in an order table in localStorage
    // Delete the shopping cart
    let cart = this.getCart();
    if(cart === null || !cart.items.length) return null;

    //let table = document.getElementById('table-selector').value;
    //if(!table) return null;

    let userId = getUserId();
    let order = {
      'user': userId,
      'table': table,
      'order': cart
    };

    //TODO: make sure the shopping cart cost is removed from the users account
    addOrder(order);
    setCookie('shoppingCart', null, 0);
    setCookie('cartUndoRedo', null, 0);
  }

  return this;
}
