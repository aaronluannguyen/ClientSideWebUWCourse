// @ts-check
"use strict";

// API Related Constants
const API_KEY = "7424f79bc878b822399ede1557d0f2c8";
const BASE = "https://api.themoviedb.org/3/";
const GET_GENRES = BASE + "genre/movie/list?api_key=" + API_KEY;
const DISCOVER = BASE + "discover/movie?api_key=" + API_KEY;
const IMG_BASE = "https://image.tmdb.org/t/p/w500/";
const USER_SEARCH = BASE + "search/movie?api_key=" + API_KEY + "&query=";

// Elements
const ERROR_ALERT_DIV = document.querySelector(".alert-danger");
const GENRE_LIST = document.querySelector("#genreFilters");
const MOVIE_DISPLAY = document.querySelector("#results");

// States to keep track of
let selectedGenre = undefined;
let allGenres = undefined;
let currentPageNum = document.querySelector("#pageNum");
let totalPageNum = document.querySelector("#totalPages");
let currentDisplay = undefined;
let currentPage = 1;
let maxPage = undefined;
let searchInput = document.querySelector("input");
let singleMoviePage = document.querySelector("#singleMoviePage");
let searchPage = document.querySelector("#results");
let pageNav = document.querySelector(".pagination");


/**
 * Handles errors that occur while fetching
 * @param {Error} err
 */
function handleError(err) {
    console.error(err);
    ERROR_ALERT_DIV.textContent = "Search Error " + err.message;
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

function searchGenre(genre) {
    searchInput.value = "";
    currentPage = 1;
    selectedGenre.classList.remove("active");
    selectedGenre = genre;
    selectedGenre.classList.add("active");
    if (genre.genreID) {
        currentDisplay = DISCOVER + "&with_genres=" + genre.genreID
        displayMovies(currentDisplay);
    } else {
        currentDisplay = DISCOVER;
        displayMovies(currentDisplay);
    }
}

function renderGenreFilters(genres) {
    allGenres = createGenreFilter();
    allGenres.classList.add("active");
    allGenres.textContent = "All";
    allGenres.addEventListener("click", function() {
        searchGenre(allGenres);
    });
    GENRE_LIST.appendChild(allGenres);
    selectedGenre = allGenres;

    let genreList = genres.genres;
    for (let i = 0; i < genreList.length; i++) {
        let genreButton = createGenreFilter();
        genreButton.genreID = genreList[i].id;
        genreButton.textContent = genreList[i].name;
        genreButton.addEventListener("click", function() {
            searchGenre(genreButton);
        });
        GENRE_LIST.appendChild(genreButton);
    }
}

function makeMovieGrid(movie) {
    movie.classList.add("col-sm-12");
    movie.classList.add("col-md-6");
    movie.classList.add("col-lg-3");
}

let movieImgPlace = document.querySelector("#singleMovieImg");
let movieImg = document.createElement("img");
function displayMovieSpecs(root) {
    console.log(root);
    if (root.poster_path) {
        movieImg.src = IMG_BASE + root.poster_path;
    } else if (root.backdrop_path) {
        movieImg.src = IMG_BASE + root.backdrop_path;
    } else {
        movieImg.src = "img/imageNA.jpg";
    }
    movieImgPlace.appendChild(movieImg);

}

function makeMovieCards(results) {
    for (let i = 0; i < results.length; i++) {
        let card = document.createElement("div");
        let img = document.createElement("img");
        card.appendChild(img);

        let body = document.createElement("div");
        card.appendChild(body);

        card.classList.add("card");

        makeMovieGrid(card);

        let header = document.createElement("h5");
        body.appendChild(header);

        let description = document.createElement("p");
        body.appendChild(description);
        body.classList.add("card-body");

        if (results[i].poster_path) {
            img.src = IMG_BASE + results[i].poster_path;
        } else if (results[i].backdrop_path) {
            img.src = IMG_BASE + results[i].backdrop_path;
        } else {
            img.src = "img/imageNA.jpg";
        }
        img.classList.add("card-img-top");

        header.textContent = results[i].title;
        header.classList.add("card-title");

        description.textContent = results[i].overview;
        description.classList.add("card-text");

        // Add event listener for more detailed info about movie
        card.addEventListener("click", function() {
            pageNav.classList.add("d-none");
            searchPage.classList.add("d-none");
            singleMoviePage.classList.remove("d-none");
            fetch(BASE + "movie/" + results[i].id + "?api_key=" + API_KEY)
                .then(handleResponse)
                .then(displayMovieSpecs)
                .catch(handleError);
        });

        MOVIE_DISPLAY.appendChild(card);
    }
}

function renderMovies(root) {
    ERROR_ALERT_DIV.classList.add("d-none");
    currentPageNum.textContent = currentPage;
    let totalPages = root.total_pages;
    maxPage = Math.min(totalPages, 1000);
    totalPageNum.textContent = maxPage;
    MOVIE_DISPLAY.textContent = "";
    makeMovieCards(root.results);
}

function generateGenreFilters() {
    fetch(GET_GENRES)
        .then(handleResponse)
        .then(renderGenreFilters)
        .catch(handleError);
}

function displayMovies(search) {
    fetch(search)
        .then(handleResponse)
        .then(renderMovies)
        .catch(handleError);
    searchPage.classList.remove("d-none");
    pageNav.classList.remove("d-none");
}

generateGenreFilters();
currentDisplay = DISCOVER;
displayMovies(currentDisplay);

document.querySelector("#prevPage")
    .addEventListener("click", function() {
        if (currentPage >= 2) {
            currentPage--;
            let newSearch = currentDisplay + "&page=" + currentPage;
            displayMovies(newSearch);
            currentPageNum.textContent = currentPage;
        }
    });

document.querySelector("#nextPage")
    .addEventListener("click", function() {
        if (currentPage < maxPage) {
            currentPage++;
            let newSearch = currentDisplay + "&page=" + currentPage;
            displayMovies(newSearch);
            currentPageNum.textContent = currentPage;
        }
    });

document.querySelector("#search-form")
    .addEventListener("submit", function(evt) {
        evt.preventDefault();
        let userSearch = this.querySelector("input").value;
        currentDisplay = USER_SEARCH + userSearch;
        selectedGenre.classList.remove("active");
        selectedGenre = allGenres;
        selectedGenre.classList.add("active");
        currentPage = 1;
        displayMovies(currentDisplay);
    });