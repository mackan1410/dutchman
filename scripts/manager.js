
function createItemView() {

  $('body').append($.parseHTML(`
    <div class="content">
      <input class="add-new-btn" type="button" value="Add new item"/>
      <div class="categories item">
        <div class="name-field item-property-field">Beverage</div>
        <div class="price-field item-property-field">Price</div>
        <div class="edit-btn item-property-field">Edit</div>
        <div class="remove-btn item-property-field">Remove</div>
      </div>
      <div id="item-list"></div>
    </div>
    `))


    let beverages = getBeverages();
    beverages.forEach(beverage => {
      $('#item-list').append($.parseHTML(`
        <div class="item">
          <div class="name-field item-property-field">${beverage.namn}</div>
          <div class="price-field item-property-field">${beverage.prisinklmoms}</div>
          <div class="edit-btn item-property-field">edit</div>
          <div class="remove-btn item-property-field" data-articleId=${beverage.artikelid} onclick="remove(this)">remove</div>
        </div>
        `))
    })
}

/*
  Called when remove button is clicked on an item
*/
function remove(el) {
  let articleId = el.getAttribute('data-articleId');
  if(!confirm('Do you really want to remove item with article id ' + articleId)) return;
  removeBeverageByArticleId(articleId);
  el.parentElement.classList.add('hidden');
}
