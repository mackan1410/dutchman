function managerView(container) {
  this.container = container;
  this.onclickSubmitNewItem = null;
  this.onclickUpdateItem = null;
  this.onclickRemoveItem = null;

  this.render = function(data) {
    console.log(data);
    this.container.append($.parseHTML(`
      <div class="content">
        <h3 id="add-item-toggler" class="add-new-dropdown-toggler">${data.dict.addNewDropdownBtnText} <i class="fas fa-caret-down"></i></h3>
        <form class="new-item-form">
          <label for="pname">${data.dict.addNewNameFieldText}</label><br>
          <input type="text" id="pname" name="pname"><br>
          <label for="articleId">${data.dict.addNewIdFieldText}</label><br>
          <input type="text" id="articleId" name="articleId">
          <label for="price">${data.dict.addNewPriceFieldText}</label><br>
          <input type="text" id="price" name="price">
          <label for="abv">${data.dict.addNewAbvFieldText}</label><br>
          <input type="text" id="abv" name="abv">
          <label for="amount">${data.dict.addNewAmountFieldText}</label><br>
          <input type="text" id="amount" name="amount">
          <label for="bevtypes">${data.dict.addNewTypeFieldText}</label><br>
          <select name="bevtypes" id="bev-type-selector">
            <option value="" selected="selected"></option>
            <option value="1">${data.dict.addNewBeerOptText}</option>
            <option value="2">${data.dict.addNewWineOptText}</option>
            <option value="3">${data.dict.addNewSpiritsOptText}</option>
          </select>
          <input id="submit-item-btn" class="add-new-btn" type="button" value="${data.dict.addNewBtnText}"/>
        </form>

        <h1>${data.dict.mainHeader}</h1>
        <div class="categories">
          <div class="name-field item-property-field">${data.dict.nameFieldCategoryText}</div>
          <div class="item-property-btn item-property-field">${data.dict.removeBtnCategoryText}</div>
          <div class="item-property-btn item-property-field">${data.dict.editBtnCategoryText}</div>
        </div>
        <div id="item-list"></div>
      </div>`));

      document.getElementById('add-item-toggler').addEventListener('click', function() {
          $('.new-item-form').slideToggle(300);
      })

      let self = this;
      document.getElementById('submit-item-btn').addEventListener('click', function() {
        let name = document.getElementById('pname').value;
        let price = document.getElementById('price').value;
        let id = document.getElementById('articleId').value;
        let abv = document.getElementById('abv').value;
        let amount = document.getElementById('amount').value;
        let type = document.getElementById('bev-type-selector').value;
        self.onclickSubmitNewItem(name, price, id, abv, amount, type);
      })

      this.renderItems(data);
  }


  this.renderItems = function(data) {
    data.items.forEach(item => {
      $('#item-list').append($.parseHTML(`
        <div class="item" data-articleId=${item.artikelid}>
          <div class="name-field item-property-field">${item.namn}(${item.artikelid})</div>
          <div id="remove-btn" class="remove-btn item-property-btn item-property-field"><i class="fas fa-trash trashcan"></i></div>
          <div id="edit-btn" class=" edit-btn item-property-btn item-property-field"><i class="fas fa-edit"></i></div>
          <div class="edit-dropdown">
            <form>
              <label for="bevPrice">${data.dict.addNewPriceFieldText}</label><br>
              <input type="text" class="peditfield" name="bevPrice" value="${item.prisinklmoms}">
              <label for="amount">${data.dict.addNewAmountFieldText}</label><br>
              <input type="text" class="aeditfield" name="amount" value="${item.antal}">
              <input class="edit-submit-btn add-new-btn" type="button" value="${data.dict.updateBtnText}"/>
            </form>
          </div>
        </div>`));
    });

    let self = this;
    Array.from(document.getElementsByClassName('edit-btn')).forEach(el => {
      el.addEventListener('click', function() {
        $(el).parent().find('.edit-dropdown').slideToggle(300);
      }, false);
    })
    Array.from(document.getElementsByClassName('edit-submit-btn')).forEach(el => {
      el.addEventListener('click', function() {
        let id = el.parentElement.parentElement.parentElement.getAttribute('data-articleId');
        let price = el.parentElement.getElementsByClassName('peditfield')[0].value;
        let amount = el.parentElement.getElementsByClassName('aeditfield')[0].value;
        self.onclickUpdateItem(id, price, amount);
      }, false);
    })
    Array.from(document.getElementsByClassName('remove-btn')).forEach(el => {
      el.addEventListener('click', function() {
        if(!confirm(data.dict.removeConfirmMessage)) return;
        let id = el.parentElement.getAttribute('data-articleId');
        self.onclickRemoveItem(id);
      }, false);
    })

  }

  this.remove = function() {
    container.html('');
  }

  return this;
}
