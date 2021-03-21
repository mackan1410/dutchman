function menuModel() {
    this.language = getLanguage();
    this.dict = {};

    this.getAll = function() {
      return {
        'lang': this.language,
        'dict': this.dict,
        'items': getBeverages()
      };
    }


    this.filterSort = function(sortingType, beerFilter, wineFilter, spiritsFilter) {
      let filtered = this.getFiltered(beerFilter, wineFilter, spiritsFilter);
      this.sortItems(filtered.items, sortingType);
      return filtered;
    }

    this.getFiltered = function(beerFilter, wineFilter, spiritsFilter) {
      return {
        'lang': this.language,
        'dict': this.dict,
        'items': filterBeverages(i => {
          return ( i.dryckestyp === '1' && beerFilter ) ||
                 ( i.dryckestyp === '2' && wineFilter ) ||
                 ( i.dryckestyp === '3' && spiritsFilter );
        })
      }
    }

    this.sortItems = function(items, sortingType) {
      items.sort((a, b) => {
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

    this.addToOrder = function(articleId, sortingType, beerFilter, wineFilter, spiritsFilter) {
      addToShoppingCart(articleId);
      let beverage = getBeverageFromArticleId(articleId);
      let beverages = this.filterSort(sortingType, beerFilter, wineFilter, spiritsFilter);
      beverages.message = beverage.namn;
      return beverages;
    }

}
