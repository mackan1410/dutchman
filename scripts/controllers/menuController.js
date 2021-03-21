function menuController(menuView, menuModel) {
  this.menuView = menuView;
  this.menuModel = menuModel;

  this.initialize = function() {
    this.menuView.onFilterChange = this.filterChange;
    this.menuView.onclickAddToOrder = this.add;
  }

  this.displayMenu = function() {
    this.menuView.render(this.menuModel.getAll());
  }

  let self = this;
  this.filterChange = function(sortingType, beerFilter, wineFilter, spiritsFilter) {
    self.menuView.removeItems();
    let all = self.menuModel.getAll();
    let filters = [beerFilter, wineFilter, spiritsFilter];
    all.items = self.menuModel.filterSort(sortingType, filters);
    self.menuView.renderItems(all);
    return all;
  }

  this.add = function(articleId, sortingType, beerFilter, wineFilter, spiritsFilter) {
    let addedName = self.menuModel.addToOrder(articleId);
    let data = self.filterChange(sortingType, beerFilter, wineFilter, spiritsFilter);
    console.log(data, addedName);
    self.menuView.renderAddMessage(data, addedName);
  }

  return this;
}
