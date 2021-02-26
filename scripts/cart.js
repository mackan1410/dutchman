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
