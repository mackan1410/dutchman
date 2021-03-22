function cartView(container) {
  this.container = container;
  this.onclickRedo = null;
  this.onclickUndo = null;
  this.onclickRemove = null;
  this.onclickCheckout = null;

  //renders the cart html
  this.render = function(data) {
    // append the html view code to the container
    this.container.append($.parseHTML(`
      <div class="shopping-cart">
        <div id="undo-btn" class="hidden shopping-cart-extra">${data.dict.undoBtnText}</div>
        <div id="redo-btn" class="hidden shopping-cart-extra">${data.dict.redoBtnText}</div>
    		<div class="categories">
    			<div class="name item-property">${data.dict.itemCategoryHeader}</div>
    			<div class="price item-property">${data.dict.priceCategoryHeader}</div>
    		</div>
    		<div id="item-list" class="shopping-cart-item-list">
    		</div>
    		<div class="checkout-section">
            <div>${data.dict.totalPrice}: <span id="total-price">${data.totalCost}</span> ${data.dict.currency}</div><br>
            <label for="tables">${data.dict.selectTablePrompt}:</label>
            <select name="tables" id="table-selector">
              <option value="" selected="selected"></option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <br>
    	      <input id="checkout-btn" type="button" value="${data.dict.btnText}"/>
    		</div>
    	</div>`));

      //show undo/redo buttons
      if(data.undoRedo) {
        if(data.undoRedo.undoStack.length) document.getElementById('undo-btn').classList.remove('hidden');
        if(data.undoRedo.redoStack.length) document.getElementById('redo-btn').classList.remove('hidden');
      }

      //add event listeners to the various buttons
      document.getElementById('undo-btn').addEventListener('click', this.onclickUndo);
      document.getElementById('redo-btn').addEventListener('click', this.onclickRedo);
      let self = this;
      document.getElementById('checkout-btn').addEventListener('click', function() {
        self.onclickCheckout(document.getElementById('table-selector').value);
      });

      this.renderCartItems(data);
  }

  //renders the html for each of the cart items
  this.renderCartItems = function(data) {
    if(!data.items) return;

    //loop over the items and render them
    data.items.forEach(item => {
      $('#item-list').append($.parseHTML(`
        <div class="shopping-cart-item">
            <div class="name item-property">${item.namn}</div>
            <div class="price item-property">${item.prisinklmoms + data.dict.currency}</div>
            <div class="remove-btn item-property" data-articleId="${item.artikelid}"><i class="fas fa-trash trashcan-cart"></i></div>
        </div>`));
    });

    //add event listener for remove button
    let self = this;
    Array.from(document.getElementsByClassName('remove-btn')).forEach(el => {
      el.addEventListener('click', function() {
        self.onclickRemove(el.getAttribute('data-articleId'));
      }, false);
    })
  }

  this.remove = function() {
    container.html('');
  }

  return this;
}
