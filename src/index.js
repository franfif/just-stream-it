/* NavBar */
// Reduce logo and thus navbar height if page is scrolled down
window.onscroll = () => {
    logo = document.querySelector(".header__logo img");
    if (document.documentElement.scrollTop > 50) {
        logo.classList.remove("scrolled-up");
    } else {
        logo.classList.add("scrolled-up");
    }
}

// Add or remove classes menu for display
function toggleMenu() {
    let menuList = document.querySelector(".nav__list");
    let burgerLines = document.querySelector(".menu__button");

    menuList.classList.toggle("nav__list--closed");
    burgerLines.classList.toggle("menu__button--checked");
}

/* Modal */
function modalUp() {
    let modalMovieDetails = document.getElementById("myModal");
    let modalOpeners = document.querySelectorAll(".modal-movie-details--opener");
    let modalCloser = document.querySelector(".modal__close-btn");
    let modalList = document.querySelector(".modal__list");

    // Get the closest ancestor with a movie-id class
    function getMovieId(element) {
        console.log('element');
        console.log(element);
        console.log('element.closest(".movie-id")');
        console.log(element.closest(".movie-id"));
        return element.closest(".movie-id").id;
    }
    // Create eventlistener for each element able to open a modal
    modalOpeners.forEach(opener => {
        opener.addEventListener('click', (event) => {
            console.log('opener works');
            getMovieInfo('http://localhost:8000/api/v1/titles/' + getMovieId(event.target));
            modalMovieDetails.style.display = "block";
            document.body.classList.add("no-scroll");
        })
    })

    // Manage the closing of a modal
    function closingModal() {
        // Hide the modal
        modalMovieDetails.style.display = "none";
        // Reset all the movie fields that may have been modified
        movieFields = resetMovieFields();
        // Empty the content of the modal
        modalList.innerHTML = "";
        // Allow back scrolling on the main page
        document.body.classList.remove("no-scroll");
    }

    // Create eventlistener for the closing button in the modal
    modalCloser.addEventListener('click', closingModal)

    // Close the modal if user click outside of it
    window.addEventListener('click', event => {
        if (event.target == modalMovieDetails) {
            closingModal();
        }
    })
}

/* Slider */
// Get all arrows
let leftArrows = document.querySelectorAll(".arrow-holder__left");
let rightArrows = document.querySelectorAll(".arrow-holder__right");

// Add eventlistener to arrows to activate horizontal scroll
leftArrows.forEach(arrow => {
    arrow.addEventListener('click', (event) => scrollHorizontal(event, toTheLeft = true));
})
rightArrows.forEach(arrow => {
    arrow.addEventListener('click', (event) => scrollHorizontal(event, toTheLeft = false));
})

// Define horizontal scroll
function scrollHorizontal(event, toTheLeft = false) {
    // Make sure any cut thumbnail will be shown after scroll
    let scrollValue = visualViewport.width - 180; //180 = max-width of figure caption.
    scrollValue = toTheLeft ? -scrollValue : scrollValue;
    // Get slider element from the category
    slider = event.target.closest(".slider__container").querySelector(".slider");
    slider.scroll({
        left: slider.scrollLeft + scrollValue,
        behavior: 'smooth'
    });
}

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
            if (newTopMovies.length < 8) {
                extractTop8Movies(next, callback, newTopMovies)
            } else {
                callback(newTopMovies);
            }
        })
}

function populateTopMovies(data) {
    topRatedCategory = document.querySelector(".top-rated-movies");
    slider = topRatedCategory.querySelector(".slider");

    // Create a new figure for the first 7 movies
    for (let i = 0; i < 7; i++) {
        slider.innerHTML += `<figure id="${data[i].id}" class="movie-id slide modal-movie-details--opener">
                            <picture><img
                                    src="${data[i].image_url}"
                                    alt="${data[i].title}"></picture>
                            <figcaption>${data[i].title}</figcaption>
                        </figure>`
    };

    //call function to add modal opener on all figures
    modalUp();
}

extractTop8Movies('http://localhost:8000/api/v1/titles/', populateTopMovies, []);