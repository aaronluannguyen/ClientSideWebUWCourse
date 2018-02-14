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
    ERROR_ALERT_DIV.textContent = "Error: " + err.message;
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

// Creates individual genre buttons
function createGenreFilter() {
    let filter = document.createElement("a");
    filter.href = "#";
    filter.classList.add("list-group-item");
    filter.classList.add("list-group-item-action");
    return filter;
}

// handles search results via genre selection
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

// Renders all the genre filters for this web application and adds event handlers for each genre button
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

// Adds in gridding classes for the movie cards
function makeMovieGrid(movie) {
    movie.classList.add("col-sm-12");
    movie.classList.add("col-md-6");
    movie.classList.add("col-lg-3");
}

// Handles going to a more detailed page about one movie as well as going back to the search results
let singleMovieContent = document.querySelector("#singleMovieContent");
let movieSpecImg = document.querySelector("#singleMovieImg");
let movieTitle = document.querySelector("#movieTitle");
let tagLine = document.querySelector("#tagLine");
let overview = document.createElement("li");
let singleMovieGenres = document.createElement("li");
let productionCompanies = document.createElement("li");
let homePage = document.createElement("li");
let homePageLink = document.createElement("a");
function displayMovieSpecs(root) {
    if (root.poster_path) {
        movieSpecImg.src = IMG_BASE + root.poster_path;
    } else if (root.backdrop_path) {
        movieSpecImg.src = IMG_BASE + root.backdrop_path;
    } else {
        movieSpecImg.src = "img/imageNA.jpg";
    }

    movieTitle.textContent = root.title;

    tagLine.textContent = root.tagline;

    overview.textContent = "Overview: " + root.overview;
    overview.classList.add("list-group-item");
    singleMovieContent.appendChild(overview);

    let genresAsString = "Genres: " + root.genres[0].name;
    for (let i = 1; i < root.genres.length; i++) {
        genresAsString += ", " + root.genres[i].name;
    }
    singleMovieGenres.textContent = genresAsString;
    singleMovieGenres.classList.add("list-group-item");
    singleMovieContent.appendChild(singleMovieGenres);

    let productionCompaniesString = "Production Companies: " + root.production_companies[0].name;
    for (let i = 1; i < root.production_companies.length; i++) {
        productionCompaniesString += ", " + root.production_companies[i].name;
    }
    productionCompanies.textContent = productionCompaniesString;
    productionCompanies.classList.add("list-group-item");
    singleMovieContent.appendChild(productionCompanies);

    homePage.classList.add("list-group-item");
    if (root.homepage) {
        homePageLink.href = root.homepage;
        homePageLink.textContent = "Homepage for " + root.title + " here!"
        homePage.appendChild(homePageLink);
    } else {
        homePage.href = "";
        homePage.textContent = "Home page not found";
    }
    singleMovieContent.appendChild(homePage);
}

document.querySelector("#backButton")
    .addEventListener("click", function() {
        singleMoviePage.classList.add("d-none");
        clearCurrentSearch();
    });

// Creates the movie cards grid for main page and handles events that occur for each
// movie card
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
            movieSpecImg.src = "";
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

// Renders the main page for this web app
// Also handles multiple page results for a particular search
function renderMovies(root) {
    ERROR_ALERT_DIV.classList.add("d-none");
    currentPageNum.textContent = currentPage;
    let totalPages = root.total_pages;
    maxPage = Math.min(totalPages, 1000);
    totalPageNum.textContent = maxPage;
    MOVIE_DISPLAY.textContent = "";
    makeMovieCards(root.results);
}

// Retrieves the genres from the movies database to then create buttons for each genre
function generateGenreFilters() {
    fetch(GET_GENRES)
        .then(handleResponse)
        .then(renderGenreFilters)
        .catch(handleError);
}

// Clears d-none classes from the results page and pageNav
// Purpose is for allowing users to search via genre or input
// even when they are on a single movie page
function clearCurrentSearch() {
    searchPage.classList.remove("d-none");
    pageNav.classList.remove("d-none");
}


// Displays movies whether it is from genre filtering or input search
function displayMovies(search) {
    fetch(search)
        .then(handleResponse)
        .then(renderMovies)
        .then(clearCurrentSearch)
        .catch(handleError);
}

generateGenreFilters();
currentDisplay = DISCOVER;
displayMovies(currentDisplay);

// Event listener for navigating to prev pages
document.querySelector("#prevPage")
    .addEventListener("click", function() {
        if (currentPage >= 2) {
            currentPage--;
            let newSearch = currentDisplay + "&page=" + currentPage;
            displayMovies(newSearch);
            currentPageNum.textContent = currentPage;
        }
    });

// Event listener for navigating to next page
document.querySelector("#nextPage")
    .addEventListener("click", function() {
        if (currentPage < maxPage) {
            currentPage++;
            let newSearch = currentDisplay + "&page=" + currentPage;
            displayMovies(newSearch);
            currentPageNum.textContent = currentPage;
        }
    });

// Event listener for user searches through input
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