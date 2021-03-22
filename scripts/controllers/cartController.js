function cartController(cartView, cartModel) {
  this.cartView = cartView;
  this.cartModel = cartModel;

  this.initialize = function() {
    this.cartView.onclickRemove = this.remove;
    this.cartView.onclickUndo = this.undo;
    this.cartView.onclickRedo = this.redo;
    this.cartView.onclickCheckout = this.checkout;
  }

  let self = this;
  this.displayCart = function() {
    self.cartView.render(self.cartModel.getAll());
  }

  this.displayCartItems = function() {
    self.cartView.renderCartItems(self.cartModel.getAll());
  }

  this.remove = function(id) {
    console.log(id);
    console.log(self.cartModel);
    self.cartView.remove();
    self.cartModel.removeFromCart(id);
    self.displayCart();
  }

  this.undo = function() {
    self.cartView.remove();
    self.cartModel.undoCart();
    self.displayCart();
  }

  this.redo = function() {
    self.cartView.remove();
    self.cartModel.redoCart();
    self.displayCart();
  }

  this.checkout = function(table) {
    self.cartView.remove();
    self.cartModel.checkoutCart(table);
    self.displayCart();
  }

  return this;
}
