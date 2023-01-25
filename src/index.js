/* Constants */
const MOVIES_PER_CATEGORY = 7;

// Categories
const categories = [
    {
        param: "?sort_by=-imdb_score",
        name: "Top Rated Movies",
        featured: true
    },
    {
        param: "?genre=drama&sort_by=-imdb_score",
        name: "Drama",
        featured: false
    },
    {
        param: "?genre=animation&sort_by=-imdb_score",
        name: "Animation",
        featured: false
    },
    {
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

/* Connection with the API */
// Get array of movie data from the title API
async function getMovies(url) {
    return fetch(url)
        .then(res => res.json())
        .then(data => [data.results, data.next])
}

// Get movie data for a single movie from the title/id API
async function getMovie(url) {
    return fetch(url)
        .then(res => res.json())
}

// Return movie IDs from the API endpoint for a given number of movies
async function getNMovieIds(url, numberOfMovies, movies = []) {
    const [newMovies, nextUrl] = await getMovies(url);
    movies = movies.concat(newMovies);

    if (nextUrl && movies.length < numberOfMovies) {
        return await getNMovieIds(nextUrl, numberOfMovies, movies);
    } else {
        movies = movies.slice(0, numberOfMovies);
        const movieIds = movies.map(x => x.id);
        return movieIds;
    }
}

// Return movie info from ID, from local storage
// If not in local storage, get info from API and put it in local storage
async function getMovieInfo(id) {
    let movieInfo = moviesFromApi.find(movie => movie.id === id)
    if (!movieInfo) {
        movieInfo = await getMovie(apiEndpoint + id)
        moviesFromApi.push(movieInfo);
    }
    return movieInfo;
}

// Create html figure elements from movie IDs
async function getMovieHTMLFigures(movieIds) {
    const movies = await Promise.all(movieIds.map(movieId => getMovieInfo(movieId)));
    let figures = "";
    movies.forEach(movie => {
        figures += `<figure movieId="${movie.id}" class="movie-id" onclick="openingModal(this.getAttribute('movieId'))">
                        <picture>
                            <img src="${movie.image_url}"
                                alt="${movie.original_title}"
                                onerror="useDummyImage(this)">
                        </picture>
                        <figcaption>${movie.original_title}</figcaption>
                    </figure>`;
    });
    return figures;
}

// Create html element with featured movie from movie ID
async function getFeaturedMovieHTMLElement(movieId) {
    const movie = await getMovieInfo(movieId);
    const featuredMovie = `<div  class="featured-movie movie-id">
                                <div class="featured-movie__title">${movie.original_title}</div>
                                <btn movieId="${movie.id}" class="featured-movie__button" onclick="openingModal(this.getAttribute('movieId'))">
                                    <span class="arrow-right"></span><span>Play</span>
                                </btn>
                                <div class="featured-movie__summary">${movie.long_description}</div>
                                <div movieId="${movie.id}" class="featured-movie__image" onclick="openingModal(this.getAttribute('movieId'))">
                                    <img src="${movie.image_url}"
                                        alt="${movie.title}"
                                        onerror="useDummyImage(this)">
                                </div>
                            </div>`;
    return featuredMovie;
}

// Add Featured movie content to its html container
async function fillFeaturedMovie(movieId) {
    const featuredMovieContainer = document.querySelector(".featured-movie__container");
    featuredMovieContainer.innerHTML = await getFeaturedMovieHTMLElement(movieId);
}

// Add category sections to their html container
async function fillSliders(category, movieIds) {
    const newSection = `<section class="category"> 
                            <header>
                                <h2 class="category__title">${category.name}</h2>
                            </header>
                            <div class="slider__container">
                                <div class="arrow-holder__left" onclick="scrollHorizontally(this, true)">
                                    <div class="slider__arrow"></div>
                                </div>
                                <div class="slider" >${await getMovieHTMLFigures(movieIds)}</div>
                                <div class="arrow-holder__right" onclick="scrollHorizontally(this, false)">
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
        formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
        content = formatter.format(content);
    }
    return [name, content];
}

// Add a new element to the modal element in the DOM
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

// Get movie info to fill sliders and featured movie container, if needed
async function fillPage() {
    for (const category of categories) {
        const movieIds = await getNMovieIds(apiEndpoint + category.param, category.featured ? MOVIES_PER_CATEGORY + 1 : MOVIES_PER_CATEGORY);
        if (category.featured) {
            fillFeaturedMovie(movieIds.shift());
        }
        fillSliders(category, movieIds);
    };
}

// Get movie info and call function to fill the modal element
async function fillModal(movieId) {
    const movieInfo = await getMovieInfo(movieId);
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