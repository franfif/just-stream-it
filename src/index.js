/* API data */
// Categories
const categories = [
    {
        htmlClass: ".top-rated-movies",
        param: "?sort_by=-imdb_score",
        name: "Top Rated Movies",
        featured: true
    },
    {
        htmlClass: ".first-category",
        param: "?genre=drama&sort_by=-imdb_score",
        name: "Drama",
        featured: false
    },
    {
        htmlClass: ".second-category",
        param: "?genre=animation&sort_by=-imdb_score",
        name: "Animation",
        featured: false
    },
    {
        htmlClass: ".third-category",
        param: "?genre=action&sort_by=-imdb_score",
        name: "Action",
        featured: false
    }
];

// API Endpoint
const apiEndpoint = "http://localhost:8000/api/v1/titles/";

/* Movie information */
// Array where all the movie information downloaded from the API will be stored, refreshed everytime the page is refreshed
const moviesFromApi = [];

// All fields and the matching UI name 
const movieFields = {
    image_url: "Movie Cover",
    original_title: "Title",
    directors: "Director",
    actors: "Actor",
    genres: "Genre",
    duration: "Duration",
    date_published: "Release Date",
    rated: "MPAA rating",
    imdb_score: "IMDb score",
    countries: "Country of origin",
    worldwide_gross_income: "Box Office result",
    long_description: "Movie summary",
    description: "Summary"
};

// Add a new element to the modal element in the DOM
function populateModalElement(key, movieInfo) {
    movieInfo = makePlural(key, movieInfo);
    switch (key) {
        case 'image_url':
            document.querySelector(".modal__cover").setAttribute('src', movieInfo);
            return;
        case 'original_title':
            document.querySelector(".modal__title").innerHTML = movieInfo;
            return;
        case 'date_published':
            movieInfo = new Date(movieInfo).toLocaleDateString('en-us', { year: "numeric", month: "long", day: "numeric" })
            break;
        case 'duration':
            movieInfo += " minutes";
            break;
        case 'worldwide_gross_income':
            if (movieInfo) {
                movieInfo = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(movieInfo);
            } else {
                movieInfo = 'Unknown revenue';
            }
            break;
        case 'rated':
            // Fix a typo in the backend
            if (movieInfo === 'Not rated or unkown rating') {
                movieInfo = 'Not rated or unknown rating'
            }
            break;
    };

    let modalList = document.querySelector(".modal__list");
    modalList.innerHTML += `<li class="${key}">${movieFields[key]}: ${movieInfo}</li>`;
}

// Get movie data for multiple movies from the API
async function getMovies(url) {
    return fetch(url)
        .then(res => res.json())
        .then(data => [data.results, data.next])
}

// Get movie data for a single movie from the API
async function getMovie(url) {
    return fetch(url)
        .then(res => res.json())
}

// Return movie information from the API endpoint for a given number of movies
async function getNMovieIds(url, numberOfMovies, movies = []) {
    const [newMovies, nextUrl] = await getMovies(url);
    movies = movies.concat(newMovies);

    if (nextUrl && movies.length < numberOfMovies) {
        return await getNMovieIds(nextUrl, numberOfMovies, movies);
    } else {
        movies = movies.slice(0, numberOfMovies);
        const movieIds = movies.map(x => x.id);
        await storeMovieInfo(movieIds);
        return movieIds;
    }
}

async function storeMovieInfo(ids) {
    for (let id of ids) {
        if (!moviesFromApi.some(movie => movie.id === id)) {
            movieInfo = await getMovie(apiEndpoint + id)
            moviesFromApi.push(movieInfo);
        }
    }
}

// Create html figure elements from movie data
function getMovieHTMLFigures(movieIds) {
    const movies = movieIds.map(movieId => moviesFromApi.filter(movie => movie.id === movieId)[0]);
    let figures = "";
    movies.forEach(movie => {
        figures += `<figure id="${movie.id}" class="movie-id slide modal-movie-details--opener">
                        <picture>
                            <img
                            src="${movie.image_url}"
                            alt="${movie.original_title}"
                            onerror="useDummyImage(this)">
                        </picture>
                        <figcaption>${movie.original_title}</figcaption>
                    </figure>`;
    });
    return figures;
}

// Create html element with featured movie
function getFeaturedMovieHTMLElement(movieId) {
    const movie = moviesFromApi.filter(movie => movie.id === movieId)[0];
    const featuredMovie = `<div id="${movie.id}" class="featured-movie movie-id">
                                <div class="featured-movie__title">${movie.original_title}</div>
                                <btn class="featured-movie__button modal-movie-details--opener">
                                    <span class="arrow-right"></span><span>Play</span>
                                </btn>
                                <div class="featured-movie__summary">${movie.long_description}</div>
                                <div class="featured-movie__image modal-movie-details--opener">
                                    <img src="${movie.image_url}"
                                        alt="${movie.title}"
                                        onerror="useDummyImage(this)">
                                </div>
                            </div>`;
    return featuredMovie;
}

function fillFeaturedMovie(movieId) {
    const featuredMovieContainer = document.querySelector(".featured-movie__container");
    featuredMovieContainer.innerHTML = getFeaturedMovieHTMLElement(movieId);
}

function fillSliders(category, movieIds) {
    const newSection = `<section class="category ${category.htmlClass}">
                            <header>
                                <h2 class="category__title">${category.name}</h2>
                            </header>
                            <div class="slider__container">
                                <div class="arrow-holder__left">
                                    <div class="slider__arrow"></div>
                                </div>
                                <div class="slider">${getMovieHTMLFigures(movieIds)}</div>
                                <div class="arrow-holder__right">
                                    <div class="slider__arrow"></div>
                                </div>
                            </div>
                        </section>`

    const categoriesHTML = document.querySelector(".categories");
    categoriesHTML.innerHTML += newSection;
}

// Change movieFields value to plural and return array to string list
function makePlural(name, content) {
    // Test if the array to test is an array that contains more than one element
    if (Array.isArray(content) && content.length > 1) {
        name += 's';
        const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
        return [name, formatter.format(content)];
    } else {
        return [name, content];
    }
}

function fillModalElement(key, name, content) {
    [name, content] = makePlural(name, content);
    switch (key) {
        case 'image_url':
            document.querySelector(".modal__cover").setAttribute('src', content);
            return;
        case 'original_title':
            document.querySelector(".modal__title").innerHTML = content;
            return;
        case 'date_published':
            content = new Date(content).toLocaleDateString('en-us', { year: "numeric", month: "long", day: "numeric" })
            break;
        case 'duration':
            content += " minutes";
            break;
        case 'worldwide_gross_income':
            if (content) {
                content = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(content);
            } else {
                content = 'Unknown revenue';
            }
            break;
        case 'rated':
            // Fix a typo in the backend
            if (content === 'Not rated or unkown rating') {
                content = 'Not rated or unknown rating'
            }
            break;
        case 'description':
            return;
    };

    let modalList = document.querySelector(".modal__list");
    modalList.innerHTML += `<li class="${key}">${name}: ${content}</li>`;
}

function slidersScrollLeftZero() {
    const sliders = document.querySelectorAll(".slider");
    sliders.forEach(slider => slider.scrollLeft = 0);
}

async function fillPage() {
    for (const category of categories) {
        const movieIds = await getNMovieIds(apiEndpoint + category.param, category.featured ? 8 : 7);

        if (category.featured) {
            fillFeaturedMovie(movieIds.shift());
        }

        fillSliders(category, movieIds);
        slidersScrollLeftZero();
    };

    // Call modalUp function to add modal opener on all figures
    modalUp();
}

// Get movie info and call function to fill the html modal element
async function fillModal(url) {
    const movieInfo = await getMovie(url);
    for (const key in movieFields) {
        fillModalElement(key, movieFields[key], movieInfo[key]);
    }
}

fillPage();

// Replace any image not loaded by a dummy image
function useDummyImage(image) {
    image.onerror = "";
    image.src = "./public/image/No_movie_image.png";
    return true;
};