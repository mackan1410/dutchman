
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
        <label for="pname">Product name</label><br>
        <input type="text" id="pname" name="pname"><br>
        <label for="articleId">Article id</label><br>
        <input type="text" id="articleId" name="articleId">
        <label for="price">Price</label><br>
        <input type="text" id="price" name="price">
        <label for="abv">alcohol by volume(abv)</label><br>
        <input type="text" id="abv" name="abv">
        <label for="amount">Amount</label><br>
        <input type="text" id="amount" name="amount">
        <label for="bevtypes">Beverage type</label><br>
        <select name="bevtypes" id="bev-type-selector">
          <option value="" selected="selected"></option>
          <option value="1">beer</option>
          <option value="2">wine</option>
          <option value="3">spirit</option>
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
          <div id="remove-btn" class="item-property-btn item-property-field" onclick="remove(this, this.parentElement.getAttribute('data-articleId'), '${dict.removeConfirmMessage[lang]}')"><i class="fas fa-trash trashcan"></i></div>
          <div id="edit-btn" class="item-property-btn item-property-field" onclick="edit(this.parentElement.getAttribute('data-articleId'), '${dict.editConfirmMessage[lang]}')"><i class="fas fa-edit"></i></div>
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

function edit(articleId, confirmMessage) {
  if(!articleId) return;
  if(!confirm(confirmMessage)) return;

  //display edit view
  //hide item view

}
