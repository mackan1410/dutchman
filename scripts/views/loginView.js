function loginView(container) {
  this.container = container;
  this.onclickLogin = null;

  this.render = function(data) {
    if(data.loggedIn) window.location.replace('MVCmenu.html');
    console.log(data);
    console.log("kommer hit");
    container.append($.parseHTML(`
      <div class="form-container">
        <h1>${data.dict.header}</h1>
        <form id="login-form" onsubmit="loginFormSubmit()">
          <input type="text" id="username" name="username" value="" placeholder="${data.dict.userFieldText}"><!--br><br-->
          <input type="text" id="password" name="password" value="" placeholder="${data.dict.passwordFieldText}"><br>
          <p class="error-message">${data.loginError ? data.dict.loginErrorMessage : ''}</p>
          <input type="submit" value="${data.dict.submitBtnText}"  />
        </form>
      </div>`));

      let self = this;
      document.getElementById('login-form').addEventListener('submit', function() {
        let username = document.getElementById('username').value; //get submitted username
        let password = document.getElementById('password').value; //get submitted password
        self.onclickLogin(username, password);
      })

  }

  this.remove = function() {
    container.html('');
  }

  return this;
}
