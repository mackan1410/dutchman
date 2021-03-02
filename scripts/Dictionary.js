var language = 'sv'
var languges = {
    'en': {
        'welcome': "Welcome to The Flying Dutchman",
        'switch': "Change language",
        'login' : "Log in",
        'menu' : "Menu",
        'without' : "Continue without log in"
    },
    'sv' : {
        'welcome': "Välkommen till The Flying Dutchman",
        'switch': "Byt språk",
        'login' : "Logga in",
        'menu' : "Meny",
        'without' : "Fortsätt utan att logga in"
    }
}

function get_string(key) {
    return languges[language][key];
}

function update_view(){
    for (word in languges[language]){
        document.getElementById(word).innerHTML = languges[language][word];
    }
}

function change_lang() {
    if (language=='en') {
        language = 'sv';
    } else {language = 'en'};
    update_view();
}