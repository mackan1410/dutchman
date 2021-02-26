function displayShoppingCart(container) {
  const lang = getLanguage();
  const dict = {
      'itemCategoryHeader': {
        'sv': 'Dryck',
        'en': 'Beverage'
      } ,
      'priceCategoryHeader': {
        'sv': 'Pris',
        'en': 'Price'
      } ,
      'totalPrice': {
        'sv': 'Totalt pris',
        'en': 'Total price'
      },
      'btnText': {
        'sv': 'Beställ',
        'en': 'Order'
      },
      'cartEmptyMessage': {
        'sv': 'Din beställning är tom',
        'en': 'Your order is empty'
      },
      'currency': {
        'sv': 'sek',
        'en': '$'
      }
  }

  $('body').append($.parseHTML(`
    <div class="shopping-cart">
  		<div class="categories">
  			<div class="name item-property">${dict.itemCategoryHeader[lang]}</div>
  			<div class="price item-property">${dict.priceCategoryHeader[lang]}</div>
  		</div>
  		<div id="item-list">
  		</div>
  		<div class="checkout-section">
          <div>${dict.totalPrice[lang]}: <span id="total-price">0</span> ${dict.currency[lang]}</div><br>
  	      <input type="button" value="${dict.btnText[lang]}" />
  		</div>
  	</div>`))


  let cart = getShoppingCart();
  if(!cart || !cart.items.length){
    container.append($.parseHTML(`<div>${dict.cartEmptyMessage[lang]}</div>`));
    return;
  }

  cart.items.forEach(item => {
    let beverage = getBeverageFromArticleId(item);
    if(!beverage) return;
    $('#item-list').append($.parseHTML(`
      <div class="shopping-cart-item">
          <div class="name item-property">${beverage.namn}</div>
          <div class="price item-property">${beverage.prisinklmoms}</div>
          <div class="remove-btn item-property" data-articleId="${item}" onclick="remove(this)"><i class="fas fa-trash"></i></div>
      </div>`));
  })
  document.getElementById('total-price').innerHTML = getShoppingCartCost();
}


function remove(el) {
  removeFromShoppingCart(el.getAttribute('data-articleId'));
  el.parentElement.classList.add('hidden');
  document.getElementById('total-price').innerHTML = getShoppingCartCost();
}


/*
  returns the shopping cart object
*/
function getShoppingCart() {
  let cart = getCookie('shoppingCart'); // get the shopping cart cookie
  return cart ? JSON.parse(cart) : null; // if the cookie was set, return the parsed result, else return null
}

/*
  adds an articleId to the shopping cart.
  If the cart doesn't exist, a new one will be created
*/
function addToShoppingCart(articleId) {
  let cart = getShoppingCart(); // get the shopping cart object
  if(cart === null){ // if the cart does not exist, create one
    createShoppingCart();
  }

  cart = getShoppingCart();
  cart.items.push(articleId);  // add the new item to the existing cart
  let beverage = getBeverageFromArticleId(articleId);
  cart.cost += parseFloat(beverage.prisinklmoms);
  setCookie('shoppingCart', JSON.stringify(cart)); // reset the shoppng cart cookie
}

/*
  Remove an articleId from the shopping cart
*/
function removeFromShoppingCart(articleId) {
  let cart = getShoppingCart(); // get the shopping cart object
  if(cart === null || cart.items.length === 0) return; // if the cart does not exist or is empty, we can't remove from it

  let firstIdx = cart.items.findIndex(itm => itm == articleId);
  cart.items.splice(firstIdx,1);
  let beverage = getBeverageFromArticleId(articleId);
  cart.cost -= parseFloat(beverage.prisinklmoms);
  setCookie('shoppingCart', JSON.stringify(cart)); // restore the cookie
}

/*
  Creates an empty shopping cart
*/
function createShoppingCart() {
  if(getShoppingCart() !== null) return; // if a cart already exists
  let cart = {
    'items': [],
    'cost': 0
  };
  setCookie('shoppingCart', JSON.stringify(cart));
}

/*
  Completely removes the shopping cart
*/
function destroyShoppingCart() {
  setCookie('shoppingCart', null, 0); // destroys the shopping cart
}

/*
  returns the total cost of the shopping cart
*/
function getShoppingCartCost() {
  let cart = getShoppingCart();
  return cart ? cart.cost : 0;
}

/*
  Checkout the shopping cart and place an order
*/
function checkoutShoppingCart() {
  // Store the order in an order table in localStorage
  // Delete the shopping cart
}
