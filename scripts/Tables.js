
/*

viktigt: undo redo
         mvc


next: -översättning
      -spara betalning i local
      -spara "carts" i local
      -Skriv ut riktiga menyn
      -kunna beställa och betala "på plats" ej kopplat till bord
      -fixa selector
      -fixa .charAt(1)
      -minska i lager
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

/*
    får p == 'p' när man klickar på pay-knappen.
    om 'p', töm listan hos selected-table
    resten används ej
 */
function pay_bill(){

    //nollställ summan
    bills[selector[1].charAt(1)] = 0;

    //nollställ tab
    tablebills[selector[1].charAt(1)] = [];

    //i have no idea what im doing
    $(document).ready(function () {
        let li = "#li" + selector[1].charAt(1);
        $(li).empty();
    });
    document.getElementById(('s' + selector[1].charAt(1))).innerHTML = bills[selector[1].charAt(1)].toString() + 'kr.';
}

function addItemToBill(p){
    var tNr = parseInt(p);
    let x = menu[tNr][1];
    bills[selector[1].charAt(1)] += parseInt(x);
    tablebills[selector[1].charAt(1)].push(addItem(menu[tNr][0],menu[tNr][1]));
    document.getElementById(('s' + selector[1].charAt(1))).innerHTML = bills[selector[1].charAt(1)].toString() + 'kr.';


    $(document).ready(function() {
        let item = menu[tNr][0].namn;
        let li = "#li" + selector[1].charAt(1);
        $(li).append('<li>' + item + '</li>');
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

function addItem(bev,price){
    return [bev.namn,price]
}











