
function createManagerView(container, beverages) {
  const lang = getLanguage();
  const dict = {
    'mainHeader': {
      'sv': 'Alla drycker',
      'en': 'All beverages',
      'hi' : 'सभी पेय पदार्थ'
    },
    'addNewDropdownBtnText': {
      'sv': 'Lägg till ny dryck',
      'en': 'Add new beverage',
      'hi' : 'नया पेय जोड़ें'
    },
    'addNewNameFieldText': {
      'sv': 'Namn',
      'en': 'Name',
      'hi' : 'नाम'
    },
    'addNewIdFieldText': {
      'sv': 'Artikel ID',
      'en': 'Article ID',
      'hi' : 'अनुच्छेद आईडी'
    },
    'addNewPriceFieldText': {
      'sv': 'Pris',
      'en': 'Price',
      'hi' : 'पंचायती राज संस्थाओं'
    },
    'addNewAbvFieldText': {
      'sv': 'Volymprocent alkohol(vol)',
      'en': 'Alcohol by volume(abv)',
      'hi' : 'मात्रा द्वारा शराब (abv)'
    },
    'addNewAmountFieldText': {
      'sv': 'Antal i lager',
      'en': 'Number in stock',
      'hi' : 'स्टॉक में नंबर'
    },
    'addNewTypeFieldText': {
      'sv': 'Dryckeskategori',
      'en': 'Beverage category',
      'hi' : 'पेय की श्रेणी'
    },
    'addNewBeerOptText': {
      'sv': 'Öl',
      'en': 'Beer',
      'hi' : 'बीयर'
    },
    'addNewWineOptText': {
      'sv': 'Vin',
      'en': 'Wine',
      'hi' : 'शराब'
    },
    'addNewSpiritsOptText': {
      'sv': 'Sprit',
      'en': 'Spirits',
      'hi' : 'आत्माओं'
    },
    'addNewBtnText': {
      'sv': 'Lägg till',
      'en': 'Add',
      'hi' : 'जोड़ना'
    },
    'nameFieldCategoryText': {
      'sv': 'Dryck(id)',
      'en': 'Beverage(id)',
      'hi' : 'सदाबहार (आईडी)'
    },
    'removeBtnCategoryText': {
      'sv': 'Ta bort',
      'en': 'Delete',
      'hi' : 'हटाएं'
    },
    'editBtnCategoryText': {
      'sv': 'Redigera',
      'en': 'Edit',
      'hi' : 'संपादित करें'
    },
    'removeConfirmMessage': {
      'sv': 'Vill du verkligen ta bort den här drycken?',
      'en': 'Do you really want to remove this item?',
      'hi' : 'क्या आप वास्तव में इस आइटम को निकालना चाहते हैं?'
    },
    'editConfirmMessage': {
      'sv': 'Vill du verkligen redigera den här drycken?',
      'en': 'Do you really want to edit this item?',
      'hi' : 'क्या आप वास्तव में इस आइटम को संपादित करना चाहते हैं?'
    }
  }

  container.append($.parseHTML(`
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
          <div id="edit-btn" class=" edit-btn item-property-btn item-property-field" onclick="toggleEditDropdown($(this))"><i class="fas fa-edit"></i></div>
          <div class="edit-dropdown">
            <form>
              <label for="bevPrice">Price</label><br>
              <input type="text" class="peditfield" name="bevPrice" value="${beverage.prisinklmoms}" oninput="markAsChanged(this)">
              <label for="amount">Amount</label><br>
              <input type="text" class="aeditfield" name="amount" value="${beverage.antal}" oninput="markAsChanged(this)">
              <input class="add-new-btn" type="button" value="Update" onclick="submitEditForm(this, this.parentElement.parentElement.parentElement.getAttribute('data-articleId'), '${dict.editConfirmMessage[lang]}')"/>
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
  document.getElementById('content-container').innerHTML = '';
  createManagerView($('#content-container'), getBeverages());
}

function toggleEditDropdown(el) {
  el.parent().find('.edit-dropdown').slideToggle(300);
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

//"edit($(this), this.parentElement.parentElement.parentElement.getAttribute('data-articleId'), '${dict.editConfirmMessage[lang]}')"

function markAsChanged(el) {
  el.setAttribute('data-ischanged', true);
}

/*
  Submit update of a beverage
*/
function submitEditForm(el, articleId, confirmMessage) {
  if(!articleId) return;

  let priceField = el.parentElement.getElementsByClassName('peditfield')[0];
  let amountField = el.parentElement.getElementsByClassName('aeditfield')[0];
  let beverage = getBeverageFromArticleId(articleId);

  if(priceField.getAttribute('data-ischanged') == 'true' && priceField.value !== '')
    beverage.prisinklmoms = priceField.value;
  if(amountField.getAttribute('data-ischanged') == 'true' && amountField.value !== '')
    beverage.antal = amountField.value;

  changeBeverageByArticleId(articleId, beverage);
  document.getElementById('content-container').innerHTML = '';
  createManagerView($('#content-container'), getBeverages());
}
