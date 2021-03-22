function managerController(managerView, managerModel) {
  this.managerView = managerView;
  this.managerModel = managerModel;

  this.initialize = function() {
    this.managerView.onclickSubmitNewItem = this.submitNew;
    this.managerView.onclickRemoveItem = this.remove;
    this.managerView.onclickUpdateItem = this.update;
  }

  this.displayManager = function() {
    this.managerView.render(this.managerModel.getAll());
  }

  let self = this;
  this.submitNew = function(name, price, id, abv, amount, type) {
    if(!name || !price || !id || !abv || !amount || !type) return;
    let newItem = {
      'namn': name,
      'prisinklmoms': price,
      'artikelid': id,
      'alkoholhalt': abv+'%',
      'antal': amount,
      'dryckestyp': type
    };
    self.managerView.remove();
    self.managerModel.submitNewItem(newItem);
    self.displayManager();
  }

  this.update = function(id, newPrice, newAmount) {
    self.managerView.remove();
    self.managerModel.updateItem(id, newPrice, newAmount);
    self.displayManager();
  }

  this.remove = function(id) {
    console.log(id);
    self.managerView.remove();
    self.managerModel.removeItem(id);
    self.displayManager();
  }

  return this;
}
