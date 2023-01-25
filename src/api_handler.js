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
