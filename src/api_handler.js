/* Connection with the API */
// Get array of movie data from the title API
async function getMovies(url) {
    return fetch(url)
        .then(res => {
            if (!res.ok) { console.log(res) }
            else { return res.json() }
        })
        .then(data => {
            if (!res.ok) { console.log(res) }
            else { return [data.results, data.next] }
        })
        .catch((error) => {
            api_error();
            console.error('Error:', error);
        });
}

// Get movie data for a single movie from the title/id API
async function getMovie(url) {
    return fetch(url)
        .then(res => {
            if (!res.ok) { console.log(res) }
            else { return res.json() }
        })
        .catch((error) => {
            api_error();
            console.error('Error:', error);
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

function api_error() {
    const container = document.querySelector(".container");
    container.style.width = '100%';
    container.innerHTML += `<div class='api-error'>
        Oops, something went wrong...</br> 
        Did you install and launch the OCMovies-API REST API application?</br>
        <a href='https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR#Installation' 
        target="_blank" rel="noopener noreferrer">
            Click here for more information
        </a>
    </div>`;
} 