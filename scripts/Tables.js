
/*

To do:
       CSS
       MVC
       Undo-redo
       Språk


 */


//Selector: behöver inte vara lista. hade första plats till annat innan.
//här sparas senast selectad bord

var selector = ['','t1'];

// bills: sparar totalsumman. Inte integrerad med tablebills. kommer räknas ut bordsvis
//från localstorage
bills = [0,0,0,0,0,0,0,0];

//listorna innehåller listor med [Objekt(dricka),pris]. fixas i localstorage
tablebills = [[],[],[],[],[],[],[],[]];

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

fillMenu();

/* --------


KÄNSLIGA TITTARE VARNAS

redoing functions after undo redo is done prob.

-----------
 */


/*
Highlightar senast klickade bord. Återställer färg för den förra.
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

function pay_bill(){

    //nollställ summan
    //get tab:
    let order =  getTableBills(parseInt(selector[1].charAt(1)));
    addPayment(order);
    clearTable(parseInt(selector[1].charAt(1)));

    $(document).ready(function () {
        let li = "#li" + selector[1].charAt(1);
        $(li).empty();
    });
    document.getElementById(('s' + selector[1].charAt(1))).innerHTML = bills[selector[1].charAt(1)].toString() + 'kr.';
}

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
                $(li).append('<li>' + getBeverageFromId(j.artikel_id).namn + " " + j.quantity + '</li>');
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
  get beverage information by id
 */
function getBeverageFromId(id) {
    let bevs = getBeverages();
    if(bevs === null) return null;
    return bevs.find(u => u.artikelid === id);
}




/* temporary orders until i know how to fetch prices and User_id*/

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
    "table":"5",
    "user_id":"123",
    "artikel_id":"51029",
    "pris":"120",
    "quantity":"1"
}
let order4 = {
    "table":"5",
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

orderList = [order1,order2,order3,order4,order5,order6,order7,order8]

