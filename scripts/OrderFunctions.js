
/*

- Now, objects can be added to table bill

To do:



 */

displayMenuScrollbar();
setCookie('billUndoRedo',JSON.stringify(order1));
var x = new undoRedoManager();
function initTables(tablebills){

    setItem('table',JSON.stringify(tablebills))
    setItem('table1',JSON.stringify(tablebills))
    setItem('table2',JSON.stringify(tablebills))
    setItem('table3',JSON.stringify(tablebills))
    setItem('table4',JSON.stringify(tablebills))
    setItem('table5',JSON.stringify(tablebills))
    setItem('table6',JSON.stringify(tablebills))
    setItem('table7',JSON.stringify(tablebills))



}

/*
    clear table when given table number. F
 */
function clearTable(tNr) {
    localStorage.removeItem('table' + tNr.toString());
    setItem('table' + tNr.toString(), []);
}

/*
    adds item to bill in localstorage. Also adds item to undo-stack. Extensive error checking for null and undefined.
 */
function addToBill(table,uId,product,price,qt){
        let newtab = {'table':table,
                  'user_id':uId,
                  'artikel_id':product,
                  'pris': price,
                  'quantity': qt
        };
        console.log("added to bill");
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
                console.log(typeof newtable.quantity);
                console.log(newtable.quantity);
                let index = tbills.findIndex(newtable);
                tbills[index] = newtable; }else{ tbills.push(newtab);}}
        catch (err){
                console.log("err");
        }}
        console.log(tbills);
        setBill(table,tbills);



}

/*
    Removes item from bill. Fetch from localstorage, decrease quantity and store again. input table number and product ID.
 */
function removeFromBill(table,product){
    let tbills = getItem('table' + table);
    console.log("tbills");
    console.log(tbills);
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


/*
    store bill in localstorage
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
    console.log(getCookie('billUndoRedo'));
}

/*
    pushes table and funciton onto redo-stack. called for in undo-function.
 */
function undoAddItemToBill(){
    //
    let savedUndoRedo = JSON.parse(getCookie('billUndoRedo'));
    var tNr = selector[1][1];
    console.log(savedUndoRedo);
    try {
        var table = getItem('table' + tNr);

    }catch(err){
        return;
    }
    let undoRedo = new undoRedoManager(savedUndoRedo.undoStack, savedUndoRedo.redoStack);

    if(table != null || table != [null]){
    undoRedo.undo(table,function(prev) {
        console.log("setting " + tNr);
        setItem('table' + tNr.toString(), JSON.stringify(prev));

    });   }
    printTable(getItem('table' + tNr.toString()));
    setCookie('billUndoRedo',JSON.stringify(undoRedo));
    console.log("undobill");
    console.log(getCookie('billUndoRedo'));
}

function redoAddItemToBill(){
    //

    let savedUndoRedo = JSON.parse(getCookie('billUndoRedo'));
    tNr = selector[1][1];
    console.log(savedUndoRedo);
    try {
        var table = getItem('table' + tNr);

    }catch(err){
        return;
    }
    let undoRedo = new undoRedoManager(savedUndoRedo.undoStack, savedUndoRedo.redoStack);

    if(table != null || table != [null]){
        undoRedo.redo(table,function(prev) {
            console.log("setting " + tNr);
            setItem('table' + tNr.toString(), JSON.stringify(prev));

        });   }
    printTable(getItem('table' + tNr.toString()));
    setCookie('billUndoRedo',JSON.stringify(undoRedo));
    console.log("undobill");
    console.log(getCookie('billUndoRedo'));
}







