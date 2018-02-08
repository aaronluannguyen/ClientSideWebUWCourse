// @ts-check
"use strict";

// API Related Constants
const API_KEY = "7424f79bc878b822399ede1557d0f2c8";
const GENRES_SEARCH = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + API_KEY;

// Elements
const ERROR_ALERT_DIV = document.querySelector(".alert-danger");
const GENRE_LIST = document.querySelector("#genreFilters");

/**
 * Handles errors that occur while fetching
 * @param {Error} err
 */
function handleError(err) {
    console.error(err);
    //TODO: display error message in ERROR_ALERT_DIV
    //so the user can see it
    ERROR_ALERT_DIV.textContent = err.message;
    ERROR_ALERT_DIV.classList.remove("d-none");
}

/**
 * Handles responses from the fetch() API.
 * The iTunes API always returns JSON, even for
 * status codes >= 400.
 * @param {Response} response
 */
function handleResponse(response) {
    if (response.ok) {
        return response.json();
    } else {
        //iTunes API errors are returned
        //as a JSON object containing
        //an `errorMessage` property
        return response.json()
            .then(function(err) {
                throw new Error(err.errorMessage);
            });
    }
}

function createGenreFilter() {
    let filter = document.createElement("a");
    filter.href = "#";
    filter.classList.add("list-group-item");
    filter.classList.add("list-group-item-action");
    return filter;
}

function renderGenreFilters(genres) {
    let allGenres = createGenreFilter();
    allGenres.classList.add("active");
    allGenres.textContent = "All";
    GENRE_LIST.appendChild(allGenres);
    let genreList = genres.genres;
    for (let i = 0; i < genreList.length; i++) {
        let filter = createGenreFilter();
        filter.textContent = genreList[i].name;
        GENRE_LIST.appendChild(filter);
    }
}

function generateGenreFilters() {
    fetch(GENRES_SEARCH)
        .then(handleResponse)
        .then(renderGenreFilters)
        .catch(handleError);
}

generateGenreFilters();
