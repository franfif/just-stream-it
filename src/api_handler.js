/* Connection with the API */
// Get array of movie data from the title API
async function getMovies(url) {
    return fetch(url)
        .then(checkError)
        .then(data => {
            if (!Array.isArray(data.results)) { console.log(data) }
            else { return [data.results, data.next] }
        })
        .catch((error) => {
            api_error(error);
            console.error(error);
        });
}

// Get movie data for a single movie from the title/id API
async function getMovie(url) {
    return fetch(url)
        .then(checkError)
        .catch((error) => {
            api_error(error);
            console.error(error);
        });
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

// Check response and throw error if response is not successful
function checkError(response) {
    if (response.status >= 200 && response.status <= 299) {
        return response.json();
    } else {
        throw Error(response.status);
    }
}

// Callback for error catching
function api_error(error) {
    const container = document.querySelector(".container");
    container.style.width = '100%';

    let errorMessage = `<div class='api-error'>
        Oops, something went wrong...</br>`

    // Message if netwrok error, no access to API
    if (error.message === "Failed to fetch") {
        errorMessage += `Did you install and launch the OCMovies-API REST API application?</br>
                        <a href='https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR#Installation' 
                                target="_blank" rel="noopener noreferrer">
                            Click here for more information
                        </a>`;
    } else {
        // Message for unsuccessful http response
        errorMessage += `${error}</br>
                        Please contact help@juststreamit.com.`;
    }
    errorMessage += `</div >`;

    container.innerHTML += errorMessage;
}
