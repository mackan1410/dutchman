function managerModel()  {
  this.language = getLanguage();
  this.dict = {
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
    'updateBtnText': {
      'sv': 'Uppdatera',
      'en': 'Update',
      'hi': 'Update'
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
  };

  this.getAll = function() {
    return {
      'lang': this.language,
      'dict': this.dict,
      'items': getBeverages()
    };
  }

  this.submitNewItem = function(newItem) {
    if(beverageExists(newItem.artikelid)) return;
    addBeverage(newItem);
  }

  this.updateItem = function(id, newPrice, newAmount) {
    let beverage = getBeverageFromArticleId(id);
    beverage.prisinklmoms = newPrice;
    beverage.amount = newAmount;
    changeBeverageByArticleId(id, beverage);
  }

  this.removeItem = function(id) {
    removeBeverageByArticleId(id);
  }

  return this;
}
