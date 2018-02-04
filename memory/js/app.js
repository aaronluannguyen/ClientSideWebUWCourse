"use strict";

/**
 * Shuffles an array in-place.
 * Source: https://bost.ocks.org/mike/shuffle/
 * @param {[]} array 
 * @returns {[]} the shuffled input array
 */
function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

/**
 * Returns a shallow copy of the object by
 * copying all of its properties to a new object.
 * @param {Object} obj - an object to copy
 * @returns {Object} a shallow clone of the object
 */
function cloneObject(obj) {
    return Object.assign({}, obj);
}

// Generates 8 pic pairs for the game
function generatePicArray() {
    let select8 = shuffle(TILES).slice(0, 8);
    let gameArray = [];
    for (let i = 0; i < select8.length; i++) {
        gameArray.push(cloneObject(select8[i]));
        gameArray.push(cloneObject(select8[i]));
    }
    gameArray = shuffle(gameArray);
    return gameArray;
}

// Renders initial game state of 16 cards with Blank tile img and alt text
function renderButtons(url, alt) {
    let button = document.createElement("button");
    let img = document.createElement("img");
    img.src = TILEBACK;
    img.alt = TILEBACKALT;
    button.appendChild(img);
    button.addEventListener("click", function() {
        if (img.src = TILEBACK) {
            img.src = url;
            img.alt = alt;
        }
    });
    return button;
}

function newGame() {
    //TODO: add code to implement the game
    let gameArray = generatePicArray();
    console.log(gameArray);
    let gameTiles = document.querySelector("#tiles");
    gameTiles.textContent =  "";
    for (let i = 0; i < gameArray.length; i++) {
        gameTiles.appendChild(renderButtons(gameArray[i].url, gameArray[i].alt));
    }
}

//start a new game when the page loads
newGame();
