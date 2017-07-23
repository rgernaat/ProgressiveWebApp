
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
 
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
 
if (!window.indexedDB) {
   window.alert("Your browser doesn't support a stable version of IndexedDB.");
}

        
const citydata = [
    {City: "boston", State: "MA", listDesc: "Boston, MA", displayed : false},
    {City: "chicago", State: "IL", listDesc: "Chicago, IL", displayed : false},
    {City: "portland", State: "OR", listDesc: "Portland, OR", displayed : false},
    {City: "sanfrancisco", State: "CA", listDesc: "San Francisco, CA", displayed : false},
    {City: "seattle", State: "WA", listDesc: "Seattle, WA", displayed : false}
];
var db;
var request = window.indexedDB.open("CitiesList", 1);

request.onerror = function(event) {
    console.log("error: ");
};

request.onupgradeneeded = function(event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("Cities", {keyPath: "City"});

    for (var i in citydata) {
        objectStore.add(citydata[i]);
    }
}

request.onsuccess = function(event) {
    db = request.result;
    console.log("success: "+ db);
    LoadCities();
};

function read() {
var transaction = db.transaction(["Cities"]);
var objectStore = transaction.objectStore("Cities");
var request = objectStore.get("houston");

    request.onerror = function(event) {
        alert("Unable to retrieve daa from database!");
    };

    request.onsuccess = function(event) {
        // Do something with the request.result!
        if(request.result) {
            alert("City : " + request.result.City + ", ST: " + request.result.State + ", Desc: " + request.result.listDesc);
        }
        
        else {
            alert("your search couldn't be found in your database!");
        }
    };
}

function readAll() {
    var objectStore = db.transaction("Cities").objectStore("Cities");

    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        
        if (cursor) {
            alert("City : " + cursor.key + ", ST: " + cursor.value.State + ", Desc: " + cursor.value.listDesc + ", Displayed : " + cursor.value.displayed);
            cursor.continue();
        }
        else {
            //alert("No more entries!");
        }
    };
}

function add() {
    var request = db.transaction(["Cities"], "readwrite")
        .objectStore("Cities")
        .add({City: "houston", State: "TX", listDesc: "Houston, TX"});
        request.onsuccess = function(event) {
        alert("You have successfully added to your database.");
        LoadCities();
    };


    request.onerror = function(event) {
        alert("Unable to add data\r\your database is aready exist in your database! ");
    }
}

function update() {
    var request = db.transaction(["Cities"], "readwrite")
        .objectStore("Cities")
        .put({City: "houston", State: "TX", listDesc: "Houston, TX", displayed : true});
        
    request.onsuccess = function(event) {
        alert("You have successfully updated your database.");
        LoadCities();
    };
}

function remove() {
    var request = db.transaction(["Cities"], "readwrite")
        .objectStore("Cities")
        .delete("houston");

        request.onsuccess = function(event) {
            alert("Kenny's entry has been removed from your database.");
        };
}
function LoadCities() {
    var dropdown = document.getElementById("selectCityToAdd");
    var objectStore = db.transaction("Cities").objectStore("Cities");

    
    
    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        
        if (cursor) {
            dropdown[dropdown.length] = new Option(cursor.value.listDesc, cursor.key);
            cursor.continue();
            if(cursor.value.displayed){
                //app.getForecast(cursor.key, cursor.value.listDesc);
            }
        }
        else {
            //alert("No more entries!");
        } 
    };
}

