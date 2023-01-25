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
// Init movieField object
movieFields = resetMovieFields();

// Reset movieFields object to remove any changes in the values
function resetMovieFields() {
    return {
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
}

// Change movieFields value to plural and return array to string list
function makePlural(key, arrayToList) {
    // Test if the array to test is an array that contains more than one element
    if (Array.isArray(arrayToList) && arrayToList.length > 1) {
        movieFields[key] += 's';
        return arrayToList.join(', ');
    } else {
        return arrayToList;
    }
}

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

// Get the data from database with fetch function and call a callback function with the it
function extractJson(url, field, callback) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            // Call a function with the data retrieved
            callback(field, data[field]);
        });
};

// Loop through the movie fields, get the matching data to create a DOM element 
function getMovieInfo(url) {
    for (const key in movieFields) {
        extractJson(url, key, populateModalElement);
    }
}

// Get recursevly the first 8+ movies fronm the url provided
function extractTop8Movies(url, callback, topMovies) {
    fetch(url)
        .then(res => res.json())
        .then(data => [topMovies.concat(data.results), data.next])
        .then(([newTopMovies, next]) => {
            // if next is null => callback
            if (!next && newTopMovies.length < 8) {
                extractTop8Movies(next, callback, newTopMovies);
            } else {
                callback(newTopMovies);
            }
        })
}
async function getMovies(url) {
    return fetch(url)
        .then(res => res.json())
        .then(data => [data.results, data.next])
}

function populateTopMovies(data) {
    const topRatedCategory = document.querySelector(".top-rated-movies");
    const slider = topRatedCategory.querySelector(".slider");
    // test here for the size of data

    let figures = "";
    // Create a new figure for the first 7 movies
    for (let i = 0; i < 7; i++) {
        figures += `<figure id="${data[i].id}" class="movie-id slide modal-movie-details--opener">
                        <picture><img
                                src="${data[i].image_url}"
                                alt="${data[i].title}"></picture>
                        <figcaption>${data[i].title}</figcaption>
                    </figure>`
    };
    slider.innerHTML += figures;
    //call function to add modal opener on all figures
    modalUp();
}

// extractTop8Movies('http://localhost:8000/api/v1/titles/', populateTopMovies, []);

async function get7Movies(url, movies) {
    const [newMovies, next] = await getMovies(url);
    movies = movies.concat(newMovies);

    if (next && movies.length < 7) {
        return await get7Movies(next, movies);
    } else {
        return movies;
    }
}
async function anotherPopulate(url) {
    const movies = await get7Movies(url, []);
    console.log('anotherPopulate movies');
    console.log(movies);

    const topRatedCategory = document.querySelector(".top-rated-movies");
    const slider = topRatedCategory.querySelector(".slider");
    // test here for the size of data

    let figures = "";
    // Create a new figure for the first 7 movies
    for (let i = 0; i < movies.length; i++) {
        console.log('anotherPopulate movies[i]' + i);
        console.log(movies[i]);
        figures += `<figure id="${movies[i].id}" class="movie-id slide modal-movie-details--opener">
                            <picture><img
                                    src="${movies[i].image_url}"
                                    alt="${movies[i].title}"></picture>
                            <figcaption>${movies[i].title}</figcaption>
                        </figure>`
    };
    slider.innerHTML += figures;
    //call function to add modal opener on all figures
    modalUp();
}

anotherPopulate("http://localhost:8000/api/v1/titles/?genre=drama&sort_by=-imdb_score");