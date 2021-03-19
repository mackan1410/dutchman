



function setPayment(receipts) {
    //console.log(receipts)
    setItem('receipts', JSON.stringify(receipts));
}


function addPayment(order) {
    let receipts = getReceipts();
    if (getReceipts().length === undefined) {
        receipts = [receipts];
    }

    receipts.push(order);
    setPayment(receipts);
}

function getReceipts() {
    return getItem('receipts');
}

function getPayment(key){
    let item = localStorage.getItem(key);
    return !item ? null : JSON.parse(item);
}

function formatPay(uId,adminId,totAmount,time){
    return{ "transaction_id":getReceipts().length.toString(),"user_id":uId,"admin_id": adminId,"amount":totAmount,"timestamp":time}
}
