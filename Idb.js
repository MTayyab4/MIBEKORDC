var db;

// Open (or create) a database
var request = indexedDB.open("AudioDatabase", 1);

// Handle database upgrades
request.onupgradeneeded = function(event) {
    db = event.target.result;
    var objectStore = db.createObjectStore("audio", { autoIncrement : true });
}

// Handle successful database opening
request.onsuccess = function(event) {
    db = event.target.result;
    console.log("IndexedDB opened successfully");
}

// Handle errors
request.onerror = function(event) {
    console.error("Error opening IndexedDB:", event.target.errorCode);
};

// Function to add audio file to IndexedDB
function addAudio(audioFile) {
    var transaction = db.transaction(["audio"], "readwrite");
    var objectStore = transaction.objectStore("audio");

    var addRequest = objectStore.add(audioFile);

    addRequest.onsuccess = function(event) {
        console.log("Audio file added to IndexedDB");
    };

    addRequest.onerror = function(event) {
        console.error("Error adding audio file to IndexedDB");
    };
}

// Function to retrieve audio file from IndexedDB
function getAudio(key, callback) {
    var transaction = db.transaction(["audio"]);
    var objectStore = transaction.objectStore("audio");
    var getRequest = objectStore.get(key);

    getRequest.onsuccess = function(event) {
        var audioFile = event.target.result;
        callback(audioFile);
    };

    getRequest.onerror = function(event) {
        console.error("Error retrieving audio file from IndexedDB");
        callback(null);
    };
}

// Usage example:

// Fetch the audio file
var xhr = new XMLHttpRequest();
xhr.open('GET', 'audio/article_1.mp3', true);
xhr.responseType = 'blob';

xhr.onload = function(event) {
    var blob = xhr.response;
    
    // Add the audio file to IndexedDB
    addAudio(blob);

    // Retrieve the audio file from IndexedDB (assuming the key is 1)
    getAudio(1, function(audioFile) {
        if (audioFile) {
            console.log("Retrieved audio file from IndexedDB:", audioFile);
            // Do something with the retrieved audio file
        } else {
            console.log("Audio file not found in IndexedDB");
        }
    });
};

xhr.send();
