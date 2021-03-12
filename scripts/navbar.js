/*
  This file contains functions for handling the main navigation bar.

  Author: Markus Hellgren
*/


function toggleDropdown(){
  $('.dropdown').slideToggle(300);
}

function toggleNavbarContent() {
  $('.navbar-content').slideToggle(300);
  $('.fa-bars').toggle();
  $('.fa-times').toggle();
}

function navbar(container, page){
  const lang = getLanguage();
  const dict = {
    'cartOptText': {
      'sv': 'Min order',
      'en': 'My order'
    },
    'menuOptText': {
      'sv': 'Meny',
      'en': 'Menu'
    },
    'managerOptText': {
      'sv': 'Hantera lagret',
      'en': 'Manage stock'
    },
    'myAccountOptText': {
      'sv': 'Mitt konto',
      'en': 'My account'
    },
    'loginOptText': {
      'sv': 'Logga in',
      'en': 'Login'
    },
    'logoutOpt': {
      'sv': 'Logga ut',
      'en': 'Logout'
    }
  }

  //append the html to our container element
  container.append($.parseHTML( `
    <div class="navbar">
      <a class="navbar-header" href="./">The Flying Dutchman</a>
      <div class="collapse-navbar-btn" onclick="toggleNavbarContent()"><i class="fas fa-bars"></i><i class="fas fa-times"></i></div>
      <div class="navbar-content">
        <div id="menu-opt" data-page="menu" class="navbar-item"><a href="./">${dict.menuOptText[lang]}</a></div>
        <div id="cart-opt" data-page="cart" class="navbar-item"><a href="cart.html"><i class="fas fa-shopping-cart"></i>&nbsp;${dict.cartOptText[lang]}</a></div>
        <div id="manager-opt" data-page="manager" class="navbar-item"><a href="manager.html"><i class="fas fa-users-cog"></i>&nbsp;${dict.managerOptText[lang]}</a></div>
        <div id="user-dropdown" class="navbar-item" onclick="toggleDropdown()">
          <span class="dropdown-text"></span> <i class="fas fa-caret-down"></i>
          <div class="dropdown hidden">
            <div class="dropdown-item"><a href="user.html">${dict.myAccountOptText[lang]}</a></div>
            <div class="dropdown-item"><a href="./" onclick="logout()">${dict.logoutOpt[lang]}</a></div>
          </div>
        </div>
        <div id="login-opt" data-page="login" class="navbar-item"><a href="login.html">${dict.loginOptText[lang]}</a></div>
      </div>
    </div>` ));

    //if the page argument is present, activate current page link
    if(page) {
      let str = '[data-page=' + page + ']';
      $(str).addClass('active');
    }

    // hide appropriate links of we're not logged in
    if(!loggedIn()) {
      $('#user-dropdown').hide();
      $('#cart-opt').hide();
      $('#manager-opt').hide();
      return null;
    }

    // hide the login option and display the username if logged in
    $('#login-opt').hide();
    let username = getUserFromId(getUserId()).username;//DB.getUserFromId(getUserId()).username;
    $('.dropdown-text').html(username);

    //disable the admin page if user is a vip customer
    if(getUserCredentials() === '3') $('#manager-opt').hide();

}
