
/*
    This file stores the payment functions related to the table-overfiew site.
    receipts are stored in localstorage and here are functions to store and fetch them.
 */

/*
    input is list of receipts, a dict stringified to JSON format.
 */
function setPayment(receipts) {
    setItem('receipts', JSON.stringify(receipts));
}


/*
    add receipt to localstorage.  input is array of payments.
 */
function addPayment(order) {
    let receipts = getReceipts();
    if (getReceipts().length === undefined) {
        receipts = [receipts];
    }

    receipts.push(order);
    setPayment(receipts);
}
/*
    fetch receipts from localstorage.
 */
function getReceipts() {
    return getItem('receipts');
}

/*
    ####      Might not need   #######
 */
function getPayment(key){
    let item = localStorage.getItem(key);
    return !item ? null : JSON.parse(item);
}

function formatPay(uId,adminId,totAmount,time){
    return{ "transaction_id":getReceipts().length.toString(),"user_id":uId,"admin_id": adminId,"amount":totAmount,"timestamp":time}
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
