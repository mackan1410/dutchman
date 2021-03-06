
function createManagerView(beverages) {
  const lang = getLanguage();
  const dict = {
    'mainHeader': {
      'sv': 'Alla drycker',
      'en': 'All beverages'
    },
    'addNewDropdownBtnText': {
      'sv': 'Lägg till ny dryck',
      'en': 'Add new beverage'
    },
    'addNewNameFieldText': {
      'sv': 'Namn',
      'en': 'Name'
    },
    'addNewIdFieldText': {
      'sv': 'Artikel ID',
      'en': 'Article ID'
    },
    'addNewPriceFieldText': {
      'sv': 'Pris',
      'en': 'Price'
    },
    'addNewAbvFieldText': {
      'sv': 'Volymprocent alkohol(vol)',
      'en': 'Alcohol by volume(abv)'
    },
    'addNewAmountFieldText': {
      'sv': 'Antal i lager',
      'en': 'Number in stock'
    },
    'addNewTypeFieldText': {
      'sv': 'Dryckeskategori',
      'en': 'Beverage category'
    },
    'addNewBeerOptText': {
      'sv': 'Öl',
      'en': 'Beer'
    },
    'addNewWineOptText': {
      'sv': 'Vin',
      'en': 'Wine'
    },
    'addNewSpiritsOptText': {
      'sv': 'Sprit',
      'en': 'Spirits'
    },
    'addNewBtnText': {
      'sv': 'Lägg till',
      'en': 'Add'
    },
    'nameFieldCategoryText': {
      'sv': 'Dryck(id)',
      'en': 'Beverage(id)'
    },
    'removeBtnCategoryText': {
      'sv': 'Ta bort',
      'en': 'Delete'
    },
    'editBtnCategoryText': {
      'sv': 'Redigera',
      'en': 'Edit'
    },
    'removeConfirmMessage': {
      'sv': 'Vill du verkligen ta bort den här drycken?',
      'en': 'Do you really want to remove this item?'
    },
    'editConfirmMessage': {
      'sv': 'Vill du verkligen redigera den här drycken?',
      'en': 'Do you really want to edit this item?'
    }
  }

  $('body').append($.parseHTML(`
    <div class="content">
      <!--input class="add-new-btn" type="button" value="${dict.addNewDropdownBtnText[lang]}" onclick="displayAddItemForm()"/-->
      <h3 class="add-new-dropdown-toggler" onclick="toggleAddItemForm()">${dict.addNewDropdownBtnText[lang]} <i class="fas fa-caret-down"></i></h3>
      <form class="new-item-form">
        <label for="pname">${dict.addNewNameFieldText[lang]}</label><br>
        <input type="text" id="pname" name="pname"><br>
        <label for="articleId">${dict.addNewIdFieldText[lang]}</label><br>
        <input type="text" id="articleId" name="articleId">
        <label for="price">${dict.addNewPriceFieldText[lang]}</label><br>
        <input type="text" id="price" name="price">
        <label for="abv">${dict.addNewAbvFieldText[lang]}</label><br>
        <input type="text" id="abv" name="abv">
        <label for="amount">${dict.addNewAmountFieldText[lang]}</label><br>
        <input type="text" id="amount" name="amount">
        <label for="bevtypes">${dict.addNewTypeFieldText[lang]}</label><br>
        <select name="bevtypes" id="bev-type-selector">
          <option value="" selected="selected"></option>
          <option value="1">${dict.addNewBeerOptText[lang]}</option>
          <option value="2">${dict.addNewWineOptText[lang]}</option>
          <option value="3">${dict.addNewSpiritsOptText[lang]}</option>
        </select>
        <input class="add-new-btn" type="button" value="${dict.addNewBtnText[lang]}" onclick="submitNewItem()"/>
      </form>

      <h1>${dict.mainHeader[lang]}</h1>
      <div class="categories">
        <div class="name-field item-property-field">${dict.nameFieldCategoryText[lang]}</div>
        <div class="item-property-btn item-property-field">${dict.removeBtnCategoryText[lang]}</div>
        <div class="item-property-btn item-property-field">${dict.editBtnCategoryText[lang]}</div>
      </div>
      <div id="item-list"></div>
    </div>
    `))

    beverages.forEach(beverage => {
      $('#item-list').append($.parseHTML(`
        <div class="item" data-articleId=${beverage.artikelid}>
          <div class="name-field item-property-field">${beverage.namn}(${beverage.artikelid})</div>
          <div id="remove-btn" class="remove-btn item-property-btn item-property-field" onclick="remove(this, this.parentElement.getAttribute('data-articleId'), '${dict.removeConfirmMessage[lang]}')"><i class="fas fa-trash trashcan"></i></div>
          <div id="edit-btn" class=" edit-btn item-property-btn item-property-field" onclick="edit($(this), this.parentElement.getAttribute('data-articleId'), '${dict.editConfirmMessage[lang]}')"><i class="fas fa-edit"></i></div>
          <div class="edit-dropdown">
            <form>
              <label for="bevPrice">Price</label><br>
              <input type="text" name="bevPrice" value="${beverage.prisinklmoms}">
              <label for="amount">Amount</label><br>
              <input type="text" name="amount" value="${beverage.antal}">
              <input class="add-new-btn" type="button" value="Update" onclick=""/>
            </form>
          </div>
        </div>
        `))
    })
}


function toggleAddItemForm() {
  $('.new-item-form').slideToggle(300);
}

function submitNewItem() {
  let name = document.getElementById('pname').value;
  let price = document.getElementById('price').value;
  let id = document.getElementById('articleId').value;
  let abv = document.getElementById('abv').value;
  let amount = document.getElementById('amount').value;
  let type = document.getElementById('bev-type-selector').value;
  if(!name || !price || !id || !abv || !amount || !type) return;
  if(beverageExists(id)) return;

  let newItem = {
    'namn': name,
    'prisinklmoms': price,
    'artikelid': id,
    'alkoholhalt': abv+'%',
    'antal': amount,
    'dryckestyp': type
  }

  addBeverage(newItem);
  window.location.reload();
}


/*
  Called when remove button is clicked on an item
*/
function remove(el, articleId, confirmMessage) {
  if(!articleId) return;
  if(!confirm(confirmMessage)) return;
  removeBeverageByArticleId(articleId);
  el.parentElement.classList.add('hidden');
}

function edit(el, articleId, confirmMessage) {
  if(!articleId) return;
  //el.parentElement.getElementsByClassName('edit-dropdown')[0].classList.toggle('hidden');
  el.parent().find('.edit-dropdown').slideToggle(300);
  //display edit view
  //hide item view

}
