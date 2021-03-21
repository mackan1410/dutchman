function addToStock(number, item) {
    let b = getBeverages();
    if(number < b.length) {
      b[number].stock = item;
      setBeverages(b);
  
    } else {
  
    }
  
}
  
function addStock(number) {
    let b = getBeverages();
    b[number].stock = b[number].stock+1;
    setBeverages(b);
  
}

function reduceStock(number) {
    let b = getBeverages();
    if (b[number].stock>0) {
    b[number].stock = b[number].stock-1;
    setBeverages(b);
    if (b[number].stock<6) {
        alert("Low stock")
    }
    }

}