/* Filling of HTML Page */
// Return movie info from ID, from local storage
// If not in local storage, get info from API and put it in local storage
async function getMovieInfo(id) {
    let movieInfo = MOVIES_FROM_API.find(movie => movie.id === id)
    if (!movieInfo) {
        movieInfo = await getMovie(API_ENDPOINT + id)
        MOVIES_FROM_API.push(movieInfo);
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
                        </section>
                        <hr>`

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
    modalList.innerHTML += `<li class="modal__list-item"><span class="modal__list-key">${name} :</span> ${content}</li>`;
}

// Get movie info to fill sliders and featured movie container, if needed
async function fillPage() {
    for (const category of CATEGORIES) {
        const movieIds = await getNMovieIds(API_ENDPOINT + category.param, category.featured ? MOVIES_PER_CATEGORY + 1 : MOVIES_PER_CATEGORY);
        if (category.featured) {
            fillFeaturedMovie(movieIds.shift());
        }
        fillSliders(category, movieIds);
    };
}

// Get movie info and call function to fill the modal element
async function fillModal(movieId) {
    const movieInfo = await getMovieInfo(movieId);
    for (const key in MOVIE_FIELDS) {
        fillModalElement(key, MOVIE_FIELDS[key], movieInfo[key]);
    }
}