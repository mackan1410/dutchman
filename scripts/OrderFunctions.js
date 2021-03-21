
/*

- Now, objects can be added to table bill

To do:



 */

displayMenuScrollbar();
var x = new undoRedoManager();

/*
    clear table when given table number. F
 */
function clearTable(tNr) {
    localStorage.removeItem('table' + tNr.toString());
    /*--------------------------------MIGHT NEED MVC---------------*/
    setItem('table' + tNr.toString(), []);
}

/*
    adds item to bill in localstorage. Also adds item to undo-stack. Extensive error checking for null and undefined.
 */

function onTheHouse(){
    //remove item
    //decrease lager
}
function addToBill(table,uId,product,price,qt){
        let newtab = {'table':table,
                  'user_id':uId,
                  'artikel_id':product,
                  'pris': price,
                  'quantity': qt
        };
        addBillToUndo(table);

        let tbills = getTableBills(table);

        if (tbills === null || tbills === undefined) {
            tbills = [];
            tbills.push(newtab);
        }else{
        try{
        let newtable = tbills.find(u => u.artikel_id === product.toString());
            if (newtable != undefined || newtable != null) {
                let qInt = parseInt(newtable.quantity);
                qInt += parseInt(qt);
                newtable.quantity = qInt.toString();
                let index = tbills.findIndex(newtable);
                tbills[index] = newtable; }else{ tbills.push(newtab);}}
        catch (err){
                console.log("err");
        }}
        setBill(table,tbills);



}

/*
    Removes item from bill. Fetch from localstorage, decrease quantity and store again. input table number and product ID.
 */
function removeFromBill2(table,product){
    /*--------------------------------MIGHT NEED MVC---------------*/
    let tbills = getItem('table' + table);
    if (tbills === null || tbills === [null]){
        return;
    }
    try {
        var newtable = tbills.find(u => u.artikel_id === product.toString());
    }catch(err){
        console.log(err);
    }
    //tbills.findIndex(product)
    if (newtable != undefined){
        if (newtable.quantity < 2) {
            var filtered = tbills.filter(function (el) {
                return el.artikel_id != product;
            });
            newtable = filtered;

        }else{
            let qInt = parseInt(newtable.quantity);
            qInt -= 1;
            newtable.quantity = qInt.toString();


        }
        setBill(table,[newtable]);
        return;
    }

    setBill(table,[]);

}
function removeFromBill(table,product){
    //get items from localstorage where table is stored
    /*--------------------------------MIGHT NEED MVC---------------*/
    let tbills = getItem('table' + table);
    //check if empty or faulty item
    if (tbills === null || tbills === [null] || tbills === Array(0)){
        setBill(table,[])
        return;
    }
    //search for item in newtable with matching article id
    var newtable = tbills.find(u => u.artikel_id === product.toString());
    //sometimes article ID is empty or faulty
    if(newtable != undefined ) {
        //if there is only 1 item, entry is deleted
        if (newtable.quantity < 2) {
            var filtered = tbills.filter(function (el) {
                return el.artikel_id != product;
            });
            newtable = filtered;


        } else {
            //if there is more than 1 item, quantity variable is reduced
            let qInt = parseInt(newtable.quantity);
            qInt -= 1;
            //set quantity property to new property
            newtable.quantity = qInt.toString();

        }
        //store in localstorage
        setBill(table, [newtable]);
        return;
    }
    //only uwanted entries go here. Store empty back to local.
    setBill(table,[]);
}


/*
    store bill in localstorage. input tablenumber and bill to store.
 */
function setBill(tNr,bill){
    setItem('table' + tNr,JSON.stringify(bill));
}

/*
    fetch tablebill from localstorage. Input is table number.
 */
function getTableBills(tNr){
    return getItem('table' + tNr.toString());

}

/*
    fetch bills from each table. temporarily print each table.
 */
function printbills(){
    console.log("table 1")
    console.log(getTableBills(1));
    console.log("table 2")
    console.log(getTableBills(2));
    console.log("table 3")
    console.log(getTableBills(3));
    console.log("table 4")
    console.log(getTableBills(4));
    console.log("table 5")
    console.log(getTableBills(5));
    console.log("table 6")
    console.log(getTableBills(6));
    console.log("table 7")
    console.log(getTableBills(7));
    console.log("table 8")
    console.log(getTableBills(8));
}


/*
    undo redo functions,then called to in former functions
 */


/*
    used inside AddtoBill. Pushes current table state into undo-managers undostack. Input is table number
 */
function addBillToUndo(tNr){
    //setCookie('billUndoRedo',[]);
    let table = getTableBills(tNr);
    //get the current stack
    let savedUndoRedo = JSON.parse(getCookie('billUndoRedo'));
    //new manager, get whole stacks
    let undoRedo = new undoRedoManager(savedUndoRedo.undoStack,savedUndoRedo.redoStack);
    //push table to undostack
    undoRedo.pushUndo(table);
    setCookie('billUndoRedo',JSON.stringify(undoRedo));
}

/*
    pushes table and funciton onto redo-stack. called for in undo-function.
 */
function undoAddItemToBill(){
    //
    let savedUndoRedo = JSON.parse(getCookie('billUndoRedo'));
    var tNr = selector[1][1];

    //error if faulty or empty variable from local. Try the entry
    try {
        /*--------------------------------MIGHT NEED MVC---------------*/
        var table = getItem('table' + tNr);

    }catch(err){
        //return if faulty entry. Dont push faulty value to stack
        return;
    }

    //new undomanager
    let undoRedo = new undoRedoManager(savedUndoRedo.undoStack, savedUndoRedo.redoStack);
    if(table != null || table != [null]){
        //call undo
    undoRedo.undo(table,function(prev) {
        /*--------------------------------MIGHT NEED MVC---------------*/
        setItem('table' + tNr.toString(), JSON.stringify(prev));

    });   }
    //print updated table
    /*--------------------------------MIGHT NEED MVC---------------*/
    printTable(getItem('table' + tNr.toString()));
    //store undoredo stack
    setCookie('billUndoRedo',JSON.stringify(undoRedo));
}

/*
    redo add beverage to tablebill. dont need input with global selected table
 */
function redoAddItemToBill(){
    //fetch undoredo stack
    let savedUndoRedo = JSON.parse(getCookie('billUndoRedo'));
    tNr = selector[1][1];
    //if faulty item, return from function
    try {
        /*--------------------------------MIGHT NEED MVC---------------*/
        var table = getItem('table' + tNr);

    }catch(err){
        return;
    }
    let undoRedo = new undoRedoManager(savedUndoRedo.undoStack, savedUndoRedo.redoStack);
    if(table != null || table != [null]){
        //call redo function with current table
        undoRedo.redo(table,function(prev) {
            /*--------------------------------MIGHT NEED MVC---------------*/
            setItem('table' + tNr.toString(), JSON.stringify(prev));

        });   }
    //print new table
    /*--------------------------------MIGHT NEED MVC---------------*/
    printTable(getItem('table' + tNr.toString()));
    //set new stack
    /*--------------------------------MIGHT NEED MVC---------------*/
    setCookie('billUndoRedo',JSON.stringify(undoRedo));
}



/*
    counts number of items on table bill. Used to prevent more orders when table full
 */
function itemCount() {
    //initializes count variable
    var sum = 0;
    //filter faulty local values
    try {
        //Fetch table information from local
        /*--------------------------------MIGHT NEED MVC---------------*/
        var table = getItem('table' + selector[1][1]);
        table.forEach(function (j) {
            //count number of items
            sum += parseInt(j.quantity);
        });
    }catch(err){
    }
    //return boolean value

    /*--------------------------------MIGHT NEED MVC---------------*/
    return sum<10;

}

/*
    check the quantities of given item in localstorage. Also used to check if further additions can be made
 */
function checkStock(articleId){
    let bev = getBeverageFromId(articleId);
    return bev.stock > 0;
}

/*
    adds selected item to selected table. Items from scroll-menu
 */
function addItemFromButton() {
    var buttonvalue = document.getElementById('selectbox');
    var article = buttonvalue.value;
    if (checkStock(article) && itemCount()) {
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
    printTable(getItem('table' + selector[1][1]));


}


/*
  get beverage information by id
 */
function getBeverageFromId(id) {
    let bevs = getBeverages();
    if(bevs === null) return null;
    return bevs.find(u => u.artikelid === id);
}







