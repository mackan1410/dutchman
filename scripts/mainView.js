

function onFilterChange(container) {
  container.html('');
  let beersChecked = document.getElementById('beerCbx').checked;
  let winesChecked = document.getElementById('wineCbx').checked;
  let spiritsChecked = document.getElementById('spiritsCbx').checked;
  let sortingType = document.getElementById('sortings').value;
  createMenuCards(container, getBeverages(), getLanguage(), beersChecked, winesChecked, spiritsChecked, sortingType, loggedIn());
}

function createMenuView(container, beverages, lang, beerFilter, wineFilter, spiritsFilter, sortingType, isLoggedIn) {
  const dict = {};

  container.append($.parseHTML(`

    <div class="content">
      <div id="message-field"></div>
      <div>
        <input type="checkbox" class="filtercbx" id="beerCbx" name="beers" onclick="onFilterChange($('#drink-list'))" checked>
        <label for="beers">Beers</label>
        <input type="checkbox" class="filtercbx" id="wineCbx" name="wines" onclick="onFilterChange($('#drink-list'))" checked>
        <label for="wines">Wine</label>
        <input type="checkbox" class="filtercbx" id="spiritsCbx" name="spirits" onclick="onFilterChange($('#drink-list'))" checked>
        <label for="spirits">Spirits</label>
      </div>
      <br>
      <select name="bevSortings" id="sortings" onchange="onFilterChange($('#drink-list'))">
        <option value="0">Standardsortering</option>
        <option value="1">Sortera efter alkoholhalt(lägst först)</option>
        <option value="2">Sortera efter alkoholhalt(högs först)</option>
        <option value="3">Sortera efter pris(lägst först)</option>
        <option value="4">Sortera efter pris(högst först)</option>
      </select>

      <div>
        <h3 id="hit-counter" style="border-bottom: 1px solid black; padding-bottom: 10px">Träffar</h3>
        <div id="scroll-container">
        <div id="drink-list" class="list"></div>
        </div>
      </div>
      <div id="droppable" style="width: 100%; height: 50px; text-align: center; line-height: 50px; border-top: 1px solid black; margin-top: 20px;">
        Drag and drop here to add to cart
      </div>
    </div>`));

    if(!isLoggedIn) document.getElementById('droppable').classList.add('hidden');

    createMenuCards($('#drink-list'), beverages, lang, beerFilter, wineFilter, spiritsFilter, sortingType, isLoggedIn);
}


function addToOrder(articleId) {
  console.log(articleId);
  let beverage = getBeverageFromArticleId(articleId);

  $('#message-field').html()
  $('#message-field').html($.parseHTML(`
      <p>Du har lagt till "${beverage.namn}" i din beställning. <a href="cart.html">Se beställningen</a></p>
    `));

  addToShoppingCart(articleId);
}


function createMenuCards(container, beverages, lang, beerFilter, wineFilter, spiritsFilter, sortingType, isLoggedIn) {
  console.log("sorting type: " + sortingType);
  //Filter out beverages that are not in a selected category
  //Only display beverage types that are selected.
  let bevs = filterBeverages(b => {
    return ( b.dryckestyp === '1' && beerFilter ) ||
           ( b.dryckestyp === '2' && wineFilter ) ||
           ( b.dryckestyp === '3' && spiritsFilter );
  });

  if(sortingType !== '0') {
    bevs.sort((a, b) => {
      // sort by alcohol content(lowest first)
      if(sortingType === '1') {
        return (parseFloat(a.alkoholhalt.slice(0, -1)) - parseFloat(b.alkoholhalt.slice(0, -1)));
      }
      // sort by alcohol content(highest first)
      if(sortingType === '2') {
        return (parseFloat(b.alkoholhalt.slice(0, -1)) - parseFloat(a.alkoholhalt.slice(0, -1)));
      }
      // sort by price(lowest price first)
      if(sortingType === '3') {
        return (parseFloat(a.prisinklmoms) - parseFloat(b.prisinklmoms));
      }
      // sort by price(highest price first)
      if(sortingType === '4') {
        return (parseFloat(b.prisinklmoms) - parseFloat(a.prisinklmoms));
      }
    })
  }
  console.log(bevs);
  bevs.forEach(b => {
    container.append($.parseHTML(`
      <div class="item" data-articleId=${b.artikelid}>
        <h4 class="item-property-field">${b.namn}</h4>
        <div class="abv-field item-property-field">${b.alkoholhalt}</div>
        <div class="price-field item-property-field">${b.prisinklmoms}kr</div>
        <div class="item-property-btn item-property-field">
          <input class="add-to-cart-btn ${!isLoggedIn ? "hidden": null}" type="button" value="add to order" onclick="addToOrder(this.parentElement.parentElement.getAttribute('data-articleId'))"/>
        </div>
      </div>`));
  });

  if(isLoggedIn) {
    $('.item').draggable({
      cursor: "move",
      cursorAt: { top: 10, left: -10 },
      helper: function( event) {
          return $( "<div class='ui-widget-header'>" + $(this)[0].childNodes[1].innerHTML + "</div>" );
        }

      });
    $('#droppable').droppable({
      drop: function(event, ui) {
        let bevId = ui.draggable[0].getAttribute('data-articleId');
        addToOrder(bevId);
      }
    })
  }

}
