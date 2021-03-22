

/*
    This file contains functions for navigations of the tables. Displaying menu,
    language etc. Printing and updating tables, higlighting selected table. Most functions are
    using a global variable of selector, which uses the currently highlighted table in the
    table-overview.

 */



/*
    lang: fetch current language from localstorage.

    dict: store necessary strings for internationalization
 */
const lang = getLanguage();
const cssdict = {
        'tablecolor' : {
            'old': 'lavender',
            'new': 'ivory'
        }
}
const dict = {
    'tableHeader': {
        'sv': 'bord',
        'en' : 'table'
    },
    'addButton':{
        'sv': 'lägg till',
        'en': 'add'
    },
    'removeButton': {
      'sv':'ta bort',
      'en': 'remove'
    },
    'undoButton': {
        'sv': 'ångra',
        'en' : 'undo'
    },
    'redoButton': {
        'sv': 'gör om',
        'en': 'redo'
    },
    'payButton':{
        'sv':'betala',
        'en':'pay'
    },
    'currency': {
        'sv': '.kr',
        'en': '.sek'
    }
}

/*
    print all text for table view page
 */
function languagePrint(){
    //print individual buttons
    document.getElementById('addButton').textContent = dict.addButton[lang];
    document.getElementById('rmvButton').textContent = dict.removeButton[lang];
    document.getElementById('payButton').textContent = dict.payButton[lang];
    document.getElementById('undoButton').textContent = dict.undoButton[lang];
    document.getElementById('redoButton').textContent = dict.redoButton[lang];
    var i;
    //loop through and print every existing element of "t" + numerical in localstorage
    for(i = 1;i<=8;i++){
        document.getElementById('t' + i).getElementsByClassName('tname')[0].innerHTML = dict.tableHeader[lang] + ' ' + i + ':';
    }
}


//Selector: behöver inte vara lista. hade första plats till annat innan.
//här sparas senast selectad bord


/*
    REALLY REALLY REALLY NEED CHANGE
    REALLY REALLY REALLY NEED CHANGE
    REALLY REALLY REALLY NEED CHANGE
 */
var selector = ['','t1'];
/*
    Display the scrollbar menu. fetches menu from localstorage
 */
function displayMenuScrollbar(){
    //fetch what is to be printed in menu
    /*--------------------------------MIGHT NEED MVC---------------*/
    let items = getItem('beverages');


    //add each item to list
    $(document).ready(function () {
        /*--------------------------------MIGHT NEED MVC---------------*/
        var li = "#selectbox";
        $(li).empty();
        //loop and append
        items.forEach(function (j) {
            $(li).append('<option value=' + j.artikelid + '>' + j.namn + ' ' + ' ' + j.stock + '</option>');

        });
    });

}

/*
    Highlights selected table. Performs a switch between old and new element and its css.
 */
function selectTable(tNo){
    //fetch last selected table
    let selectedTable = document.getElementById(tNo);
    let lastSelect = selector[1]
    //återställ css från förra selected
    document.getElementById(lastSelect).style.background = cssdict.tablecolor['old'];
    //sätt css för selected
    selectedTable.style.background = cssdict.tablecolor['new'];
    //uppdatera selectorvariabel
    selector[1] = tNo;
}


/*
    function to print a table when given a bill.
 */
function printTable(tablebill) {
    let table = tablebill
    /*--------------------------------MIGHT NEED MVC---------------*/
    $(document).ready(function () {
        try {
            var li = "#li" + table[0].table;
        } catch (err) {
            var li = "#li" + selector[1][1];
        }
        $(li).empty();
        var sum = 0;
        var artikel = "";

        table.forEach(function (j) {
            try {
                $(li).append('<li>' + getBeverageFromId(j.artikel_id).namn + " " + j.quantity + " " + getBeverageFromId(j.artikel_id).stock +
                    '</li>');
                artikel = getBeverageFromId(j.artikel_id).prisinklmoms;
                sum += parseInt(j.quantity) * parseInt(artikel);
            }catch(err){
                $(li).empty();
            }
        });

        document.getElementById(('s' + selector[1].charAt(1))).innerHTML = sum.toString() + dict.currency.en;
    });
}


