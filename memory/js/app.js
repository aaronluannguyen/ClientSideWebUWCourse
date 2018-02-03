"use strict";

const BLANK_TILE_SRC = "img/tileback.jpg";

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

// Renders a single img div
function renderPic(picNum) {
    let img = document.createElement("img");
    img.src = ("img/tile" + picNum + ".jpg");
    return img;
}

// Select 8 random photos from 32 photo collection for game
function select8() {
    let imgTiles = document.querySelector("#tiles");
    for (let i = 0; i < 8; i++) {
        let picNum = Math.floor(Math.random() * 32);
        if (picNum < 10) {
            picNum = "0" + picNum;
        }
        imgTiles.appendChild(renderPic(picNum));
        imgTiles.appendChild(renderPic(picNum));
    }
}

function newGame() {
    //TODO: add code to implement the game
    select8();
}

//start a new game when the page loads
newGame();
