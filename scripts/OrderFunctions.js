
/*

- Now, objects can be added to table bill

To do:

    - test new functions whith tables.js
    - addtoBill quantities


 */


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

function clearTable(tNr) {
    //console.log(receipts)
    //setItem('table' + tNr.toString(), JSON.stringify(''));
    localStorage.removeItem('table' + tNr.toString());
    setItem('table' + tNr.toString(), []);
}
function addToBill(table,uId,product,price,qt){
        let newtab = {"table":table,
                  "user_id":uId,
                  "artikel_id":product,
                  "pris": price,
                  "quantity": qt
        };
        console.log("added to bill");

        let tbills = getTableBills(table);

        if (tbills === null || tbills === undefined) {
            tbills = [];
            tbills.push(newtab);
        }else{
        try{
        let newtable = tbills.find(u => u.artikel_id === product);
            if (newtable != undefined || newtable != null) {
                let qInt = parseInt(newtable.quantity);
                qInt += parseInt(qt);
                newtable.quantity = qInt.toString();
                console.log(typeof newtable.quantity);
                console.log("newtable::::")
                console.log(newtable.quantity);
                let index = tbills.findIndex(newtable);
                tbills[index] = newtable; }else{ tbills.push(newtab);}}
        catch (err){
                console.log("err")
        }}



        console.log(typeof tbills)
        console.log("tbills::::")
    console.log(tbills);
        setBill(table,tbills);
}
function removeFromBill(table,product){
    let tbills = getTableBills(table);
    if (tbills === [] || tbills === null || tbills === undefined) {
        return;
    }else{
        //console.log("tbills::");
        //console.log(tbills);
        let newtable = tbills.find(u => u.artikel_id === product);
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


        }}

    if (filtered != undefined) {
        var filtered1 = filtered.filter(function (el) {
            return el != null;
        });
    }
    setBill(table,[newtable]);
    }
}

function setBill(tNr,bill){
    setItem('table' + tNr,JSON.stringify(bill));
}

function getTableBills2(tNr){
    return getItem('table'+ tNr.toString());
}


function getTableBills(tNr){
    return getItem('table' + tNr.toString());

}

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

