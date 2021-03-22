function menuView(container) {
  this.container = container;
  this.onFilterChange = null;
  this.onclickAddToOrder = null;

  this.render = function(data) {
    container.append($.parseHTML(`
      <div class="content">
        <div id="message-field"></div>
        <div id="filters">
          <input type="checkbox" class="filtercbx filter" id="beerCbx" name="beers" checked>
          <label for="beers">Beers</label>
          <input type="checkbox" class="filtercbx filter" id="wineCbx" name="wines" checked>
          <label for="wines">Wine</label>
          <input type="checkbox" class="filtercbx filter" id="spiritsCbx" name="spirits" checked>
          <label for="spirits">Spirits</label>
        </div>
        <br>
        <select name="bevSortings" id="sortings"></select>
        <div>
          <h3 id="hit-counter" style="border-bottom: 1px solid black; padding-bottom: 10px">${data.dict.hits}</h3>
          <div id="scroll-container">
            <div id="drink-list" class="list"></div>
          </div>
        </div>
        <div id="droppable" style="width: 100%; height: 50px; text-align: center; line-height: 50px; border-top: 1px solid black; margin-top: 20px;">
          Drag and drop here to add to cart
        </div>
      </div>`));

      /*
      Object.entries(data.filters).forEach(entry => {
        console.log(entry);
        $('#filters').append($.parseHTML(`
          <input type="checkbox" class="filtercbx filter" id="beerCbx" name="beers" checked>
          <label for="beers">Beers</label>
          `))
      })
      */

      Object.entries(data.sortingTypes).forEach(entry => {
        console.log(entry);
        $('#sortings').append($.parseHTML(`<option value="${entry[1].value}">${entry[1].text}</option>`));
      })


      if(data.message) {
        $('message-field').html('');
        $('#message-field').html($.parseHTML(`
          <p>Du har lagt till "${data.message}" i din beställning. <a href="MVCcart.html">Se beställningen</a></p>
        `));
      }

      let self = this;

      function onchange() {
        let beersChecked = document.getElementById('beerCbx').checked;
        let winesChecked = document.getElementById('wineCbx').checked;
        let spiritsChecked = document.getElementById('spiritsCbx').checked;
        let sortingType = document.getElementById('sortings').value;
        self.onFilterChange(sortingType, beersChecked, winesChecked, spiritsChecked, );
      }
      Array.from(document.getElementsByClassName('filter')).forEach(el => {
        el.addEventListener('click', function() {
          onchange();
        }, false);
      })
      document.getElementById('sortings').addEventListener('change', function() {
        onchange();
      })

      this.renderItems(data);
  }

  this.renderItems = function(data) {
    data.items.forEach(item => {
      $('#drink-list').append($.parseHTML(`
        <div class="item" data-articleId=${item.artikelid}>
          <h4 class="item-property-field">${item.namn}</h4>
          <div class="abv-field item-property-field">${item.alkoholhalt}</div>
          <div class="price-field item-property-field">${item.prisinklmoms + data.dict.currency}</div>
          <div class="item-property-btn item-property-field">
            <input class="add-to-cart-btn ${!data.loggedIn ? "hidden": null}" type="button" value="${data.dict.addBtnText}"/>
          </div>
        </div>`));
    });

    let self = this;

    if(data.loggedIn) {
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
          let beersChecked = document.getElementById('beerCbx').checked;
          let winesChecked = document.getElementById('wineCbx').checked;
          let spiritsChecked = document.getElementById('spiritsCbx').checked;
          let sortingType = document.getElementById('sortings').value;
          self.onclickAddToOrder(bevId, sortingType, beersChecked, winesChecked, spiritsChecked);
        }
      })
    }

    Array.from(document.getElementsByClassName('add-to-cart-btn')).forEach(el => {
      el.addEventListener('click', function() {
        let id = el.parentElement.parentElement.getAttribute('data-articleId');
        let beersChecked = document.getElementById('beerCbx').checked;
        let winesChecked = document.getElementById('wineCbx').checked;
        let spiritsChecked = document.getElementById('spiritsCbx').checked;
        let sortingType = document.getElementById('sortings').value;
        self.onclickAddToOrder(id, sortingType, beersChecked, winesChecked, spiritsChecked);
      }, false);
    })
  }

  this.renderAddMessage = function(data, beverage) {
    $('#message-field').html()
    $('#message-field').html($.parseHTML(`
        <p>"${beverage}" ${data.dict.addMessage}<a href="MVCcart.html"> ${data.dict.cartLinkText}</a></p>
      `));
  }

  this.remove = function() {
    container.html('');
  }

  this.removeItems = function() {
    $('#drink-list').html('');
  }

  return this;
}
