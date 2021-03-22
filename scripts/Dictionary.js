var language = 'sv'
var languages = {
    'en': {
        'welcome': "Welcome to The Flying Dutchman",
        'login' : "Log in",
        'menu' : "Menu"
    },
    'sv' : {
        'welcome': "Välkommen till The Flying Dutchman",
        'login' : "Logga in",
        'menu' : "Meny"
    },
    'hi' : {
        'welcome' : "The Flying Dutchman आपका स्वागत है",
        'login' : "लॉग इन करें",
        'menu' : "मेन्यू"
    }
}

function update_view(){
    for (word in languages[language]){
        document.getElementById(word).innerHTML = languages[language][word];
    }
}
function changeLanguage(lang){
    language = lang;
    setLanguage(lang);
    update_view();
}

