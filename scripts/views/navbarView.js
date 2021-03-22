function navbarView(container, currentPage) {
  this.container = container;
  this.currentPage = currentPage;
  this.onclickLogout = null;

  this.render = function(data) {
    this.container.append($.parseHTML( `
      <div class="navbar">
        <a class="navbar-header" href="./">The Flying Dutchman</a>
        <div id="navbar-btn" class="collapse-navbar-btn"><i class="fas fa-bars"></i><i class="fas fa-times"></i></div>
        <div class="navbar-content">
          <div id="menu-opt" data-page="menu" class="navbar-item"><a href="${data.dict.menuOptText.href}">${data.dict.menuOptText.text}</a></div>
          <div id="cart-opt" data-page="cart" class="navbar-item"><a href="${data.dict.cartOptText.href}"><i class="fas fa-shopping-cart"></i>&nbsp;${data.dict.cartOptText.text}</a></div>
          <div id="manager-sec" data-page="manager" class="navbar-item"><a onclick="alert('${data.dict.secAlert.text}')"><i class="fas fa-shield-alt"></i>&nbsp;${data.dict.managerSecText.text}</a></div>
          <!--div id="cart-opt" data-page="tableview" class="navbar-item"><a href="${data.dict.barviewOptText.text}"><i class="fas fa-table-view"></i>${data.dict.barviewOptText.text}</a></div-->
          <!--div id="manager-opt" data-page="manager" class="navbar-item"><a href="${data.dict.managerOptText.href}"><i class="fas fa-users-cog"></i>&nbsp;${data.dict.managerOptText.text}</a></div-->
          <div id="user-dropdown" class="navbar-item">
            <span class="dropdown-text"></span> <i class="fas fa-caret-down"></i>
            <div class="dropdown hidden">
              <div class="dropdown-item"><a href="${data.dict.myAccountOptText.href}">${data.dict.myAccountOptText.text}</a></div>
              <div id="manager-opt" class="dropdown-item"><a href="${data.dict.managerOptText.href}"><i class="fas fa-users-cog"></i>&nbsp;${data.dict.managerOptText.text}</a></div>
              <div id="bartender-opt" class="dropdown-item"><a href="${data.dict.barviewOptText.href}"><i class="fas fa-table-view"></i>${data.dict.barviewOptText.text}</a></div>
              <div id="logout-btn" class="dropdown-item"><a href="${data.dict.logoutOpt.href}">${data.dict.logoutOpt.text}</a></div>
            </div>
          </div>
          <div id="login-opt" data-page="login" class="navbar-item"><a href="${data.dict.loginOptText.href}">${data.dict.loginOptText.text}</a></div>
        </div>
      </div>` ));

      document.getElementById('navbar-btn').addEventListener('click', function() {
        $('.navbar-content').slideToggle(300);
        $('.fa-bars').toggle();
        $('.fa-times').toggle();
      });
      document.getElementById('logout-btn').addEventListener('click', this.onclickLogout);
      document.getElementById('user-dropdown').addEventListener('click', function() {
        $('.dropdown').slideToggle(300);
      });

      if(!data.credentials) {
        $('#user-dropdown').hide();
        $('#cart-opt').hide();
        $('#manager-opt').hide();
        $('bartender-opt').hide();
        $('#manager-sec').hide();
        return;
      }

      $('#login-opt').hide();
      $('.dropdown-text').html(data.username);

      if(data.credentials === '3') {
        $('#manager-opt').hide();
        $('bartender-opt').hide();
        $('#manager-sec').hide();
      }
  }

  return this;
}
