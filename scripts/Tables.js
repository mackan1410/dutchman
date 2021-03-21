
/*

To do:
       CSS
       MVC
       Undo-redo
       Språk


 */

/*
    lang: feth current language from localstorage.

    dict: store necessary strings for internationalization
 */

const lang = getLanguage();
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
    document.getElementById('addButton').textContent = dict.addButton[lang];
    document.getElementById('rmvButton').textContent = dict.removeButton[lang];
    document.getElementById('payButton').textContent = dict.payButton[lang];
    document.getElementById('undoButton').textContent = dict.undoButton[lang];
    document.getElementById('redoButton').textContent = dict.redoButton[lang];
    var i;
    //loop through all tables
    for(i = 1;i<=8;i++){
        document.getElementById('t' + i).getElementsByClassName('tname')[0].innerHTML = dict.tableHeader[lang] + ' ' + i + ':';
    }
}



//Selector: behöver inte vara lista. hade första plats till annat innan.
//här sparas senast selectad bord

var selector = ['','t1'];
//här laddas menyn från 'beverages' i localstorage genom fillmenu.
// menu[2][0] ger objekt och menu[2][1] ger pris för bord 2
menu = [[],[],[],[],[],[],[],[]];

/*
    temporary function that fills a temporary menu*
*/
function fillMenu(){
    menu[0] = [getBeverageFromId("25053"),100];
    menu[1] = [getBeverageFromId("190719"),101];
    menu[2] = [getBeverageFromId("51029"),102];
    menu[3] = [getBeverageFromId("407506"),103];
    menu[4] = [getBeverageFromId("513291"),104];
    menu[5] = [getBeverageFromId("723841"),105];
    menu[6] = [getBeverageFromId("733051"),106];
    menu[7] = [getBeverageFromId("25053"),107];
}

/*
    Display the scrollbar menu. fetches menu from localstorage
 */
function displayMenuScrollbar(){
    let items = getItem('beverages');

    $(document).ready(function () {
        var li = "#selectbox";
        $(li).empty();
        items.forEach(function (j) {
            $(li).append('<option value=' + j.artikelid + '>' + j.namn + ' ' + ' ' + j.stock + '</option>');

        });
    });

}

/*
    counts number of items on table bill. Used to prevent more orders when table full
 */
function itemCount() {
    var sum = 0;
    try {
        var table = getItem('table' + selector[1][1]);
        table.forEach(function (j) {
            sum += parseInt(j.quantity);
        });
    }catch(err){
    }
    console.log("sum");
    console.log(sum);
    return sum<10;

}

/*
    check the quantities of given item in localstorage. Also used to check if further additions can be made
 */
function checkStock(articleId){
    let bev = getBeverageFromId(articleId);
    console.log("stock");
    console.log(bev.stock);
    return bev.stock > 0;
}

/*
    adds selected item to selected table. Items from scroll-menu
 */
function addItemFromButton() {
    var buttonvalue = document.getElementById('selectbox');
    var article = buttonvalue.value;
    console.log(article);
    if (checkStock(article) && itemCount()) {
        console.log("added");
        /* add item to bill by article id instead of menu*/
        let bevs = getItem('beverages');
        let obj = bevs.find(u => u.artikelid === article);
        addToBill(selector[1].charAt(1), 11, obj.artikelid, obj.pris, 1);
        printTable(getItem('table' + selector[1].charAt(1)));

    }
}
    /*
        removes selected item in dropdown menu from selected table in tableview
     */
function removeItemFromBill() {
        var buttonvalue = document.getElementById('selectbox');
        var articleId = buttonvalue.value;
        let table = getItem('table' + selector[1][1]);
        removeFromBill(selector[1][1], articleId);
        printTable(table);



}
fillMenu();
function addItemToBill(int){
    let obj = orderList[int-1];
    document.getElementById(('s' + selector[1].charAt(1))).innerHTML = bills[selector[1].charAt(1)].toString() + 'kr.';

    /*
    real stuff
     */
    addToBill(selector[1].charAt(1),obj.user_id,obj.artikel_id,obj.pris,obj.quantity);

    $(document).ready(function() {
            var tNr = selector[1].charAt(1);
            let item = getBeverageFromId(obj.artikel_id);
            let li = "#li" + selector[1][1];
            try {
                let table = getTableBills(parseInt(selector[1][1]));
                $(li).empty();
                let sum = 0;
                table.forEach(function (j) {
                    $(li).append('<li>' + getBeverageFromId(j.artikel_id).namn  + " " + j.quantity + '</li>');
                    sum += parseInt(j.quantity) * parseInt(j.pris);
                });
                document.getElementById(('s' + selector[1].charAt(1))).innerHTML =
                    sum.toString() + 'kr.';
            }catch(err){
                console.log(err);
            }
        }
    );
}




/*
    Highlightar senast klickade bord. Återställer färg för den förra. Fixa css.
 */
function selectTable(tNo){
    let selectedTable = document.getElementById(tNo);
    let lastSelect = selector[1]
    //återställ css från förra selected
    document.getElementById(lastSelect).style.background = 'lavender';
    //sätt css för selected
    selectedTable.style.background = 'ivory';
    //uppdatera selectorvariabel
    selector[1] = tNo
}

/*
    fetch the selected tables bill and store in localstorage.
 */
function pay_bill(){
    let order =  getTableBills(parseInt(selector[1].charAt(1)));
    addPayment(order);
    clearTable(parseInt(selector[1].charAt(1)));

    $(document).ready(function () {
        let li = "#li" + selector[1].charAt(1);
        $(li).empty();
    });
    document.getElementById(('s' + selector[1].charAt(1))).innerHTML = bills[selector[1].charAt(1)].toString() + 'kr.';
}


/*
    function to print a table when given a bill.
 */
function printTable(tablebill) {
    let table = tablebill
    $(document).ready(function () {
        try{
            var li = "#li" + table[0].table;
        }catch(err){
            console.log("null mannen");
            /* TODO: should get correct table instead of selector */
            var li = "#li" + selector[1][1];}
        $(li).empty();
        var sum = 0;
        var artikel = "";
        table.forEach(function (j) {
            $(li).append('<li>' + getBeverageFromId(j.artikel_id).namn + " " + j.quantity + " " + getBeverageFromId(j.artikel_id).stock +
            '</li>');
            artikel = getBeverageFromId(j.artikel_id).prisinklmoms;
            sum += parseInt(j.quantity) * parseInt(artikel);
        });
        document.getElementById(('s' + selector[1].charAt(1))).innerHTML= sum.toString() + dict.currency.en;

    });
}

/*
  get beverage information by id
 */
function getBeverageFromId(id) {
    let bevs = getBeverages();
    if(bevs === null) return null;
    return bevs.find(u => u.artikelid === id);
}

/*
    just example orders. Going to remove
 */

let order1 = {
    "table":"1",
    "user_id":"2",
    "artikel_id":"25053",
    "pris":"123",
    "quantity":"1"
}
let order2 = {
    "table":"5",
    "user_id":"6",
    "artikel_id":"190719",
    "pris":"120",
    "quantity":"1"
}
let order3 = {
    "table":"1",
    "user_id":"123",
    "artikel_id":"51029",
    "pris":"120",
    "quantity":"1"
}
let order4 = {
    "table":"1",
    "user_id":"11",
    "artikel_id":"407506",
    "pris":"1250",
    "quantity":"1"
}
let order5 = {
    "table":"5",
    "user_id":"11",
    "artikel_id":"513291",
    "pris":"1250",
    "quantity":"1"
}
let order6 = {
    "table":"5",
    "user_id":"11",
    "artikel_id":"723841",
    "pris":"1250",
    "quantity":"1"
}
let order7 = {
    "table":"5",
    "user_id":"11",
    "artikel_id":"733051",
    "pris":"1250",
    "quantity":"1"
}
let order8 = {
    "table":"5",
    "user_id":"11",
    "artikel_id":"733051",
    "pris":"1250",
    "quantity":"10"
}

orderList = [order1,order2,order3,order4,order5,order6,order7,order8];


