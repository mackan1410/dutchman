function navbarController(navbarView, navbarModel) {
  this.navbarView = navbarView;
  this.navbarModel = navbarModel;

  let self = this;
  this.initialize = function() {
    self.navbarView.onclickLogout = self.logout;
  }

  this.displayNavbar = function() {
    self.navbarView.render(self.navbarModel.getAll());
  }

  this.logout = function() {
    self.navbarModel.logout();
  }

  return this;
}
