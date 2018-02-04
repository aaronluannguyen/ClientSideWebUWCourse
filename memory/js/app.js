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

let state = {
    matches: 0,
    missed: 0,
    remaining: 0,
    time: 0
};

let checkArray = [];

function handleCompare(img) {
    if (checkArray.length < 2) {
        checkArray.push(img);
    } else if (checkArray.length === 2) {
        checkArray.push(img);
        if (checkArray[0].src != checkArray[1].src) {
            state.missed++;
            for (let i = 0; i < checkArray.length; i++) {
                checkArray[i].src = TILEBACK;
                checkArray[i].alt = TILEBACKALT;
            }
        } else {
            state.matches++;
        }
        checkArray = [];
    }
}

// Renders initial game state of 16 cards with Blank tile img and alt text
function renderButton(url, alt) {
    let button = document.createElement("button");
    let img = document.createElement("img");
    img.src = TILEBACK;
    img.alt = TILEBACKALT;
    button.appendChild(img);
    button.classList.add("hidden");
    button.addEventListener("click", function() {
        if (button.classList.contains("hidden")) {
            button.classList.remove("hidden");
            img.src = url;
            img.alt = alt;
        }
        // } else {
        //     button.classList.add("hidden");
        //     img.src = TILEBACK;
        //     img.alt = TILEBACKALT;
        // }
    });
    button.onclick = function() {
        if (!button.hidden) {
            if (checkArray.length < 2) {
                checkArray.push(img);
            } else if (checkArray.length === 2) {
                checkArray.push(img);
                if (checkArray[0].src != checkArray[1].src) {
                    state.missed++;
                    for (let i = 0; i < checkArray.length; i++) {
                        checkArray[i].src = TILEBACK;
                        checkArray[i].alt = TILEBACKALT;
                    }
                } else {
                    state.matches++;
                }
                console.log(checkArray);
                checkArray = [];
            }
        }
    };

    return button;
}

function newGame() {
    //TODO: add code to implement the game
    let gameArray = generatePicArray();
    let gameTiles = document.querySelector("#tiles");
    gameTiles.textContent =  "";
    for (let i = 0; i < gameArray.length; i++) {
        gameTiles.appendChild(renderButton(gameArray[i].url, gameArray[i].alt));
    }
}

//start a new game when the page loads
newGame();