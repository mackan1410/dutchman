var printedSpirits = false;
var printedWine = false;
var printedBeer = false;

function getBev() {
    let b = getBeverages();
    var i;
    if (!printedSpirits) {
        for(i = 0; i<b.length; i++){
            //document.getElementById("res").innerHTML = document.getElementById("res").innerHTML+ "<br>" + (i+1) + ". " + b[i].namn + ", "+ b[i].stock;
            $("#res").append('<li class="list"></li>').append(b[i].namn +", " + b[i].stock);
            printedSpirits = true;
        }
    } else {
        displaySpirits()
    } 
}

function list() {
  let b = getBeverages();
  let a = b[1].namn;
  //$("#res").append(a);
  $("#res").append('<li class="list"></li>').append(a);
}

function getWine() {
    var i;
    if (!printedWine) {
        for(i = 0; i<DB2.wine.length; i++){
            document.getElementById("wineRes").innerHTML = document.getElementById("wineRes").innerHTML+ "<br>" + (i+1) + ". " + DB2.wine[i].namn +", "+ DB2.wine[i].namn2;
            printedWine = true;
        }
    } else {
        displayWine()
    } 
}

function getBeer() {
    var i;
    if (!printedBeer) {
        for(i = 0; i<DB2.beer.length; i++){
            document.getElementById("beerRes").innerHTML = document.getElementById("beerRes").innerHTML+ "<br>" + (i+1) + ". " + DB2.beer[i].namn;
            printedBeer = true;
        }
    } else {
        displayBeer();
    }  
} 
function displaySpirits() {
    var x = document.getElementById("res");
    var y = document.getElementById("menuSpirits")
    if (x.style.display === "none") {
      x.style.display = "block";
      y.className = y.className.replace("", "active");
    } else {
      x.style.display = "none";
      y.className = y.className.replace("active", "");
    
    }
  }

  function displayWine() {
    var x = document.getElementById("wineRes");
    var y = document.getElementById("menuWine")
    if (x.style.display === "none") {
      x.style.display = "block";
      y.className = y.className.replace("", "active");
    } else {
      x.style.display = "none";
      y.className = y.className.replace("active", "");
    
    }
  }

function displayBeer() {
    var x = document.getElementById("beerRes");
    var y = document.getElementById("menuBeer")
    if (x.style.display === "none") {
      x.style.display = "block";
      y.className = y.className.replace("", "active");
    } else {
      x.style.display = "none";
      y.className = y.className.replace("active", "");
    }
  }