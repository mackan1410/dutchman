function loginController(loginView, loginModel) {
  this.loginView = loginView;
  this.loginModel = loginModel;

  this.initialize = function() {
    this.loginView.onclickLogin = this.onLogin;
  }

  this.displayLoginForm = function() {
    console.log("kommer hit");
    this.loginView.render(this.loginModel.getAll());
  }

  let self = this;
  this.onLogin = function(username, password) {
    self.loginView.remove();
    self.loginModel.login(username, password);
    self.displayLoginForm();
  }

  return this;
}
