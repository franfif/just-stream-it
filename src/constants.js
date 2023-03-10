/* Constants */
const MOVIES_PER_CATEGORY = 7;

// Categories
const CATEGORIES = [
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
        param: "?sort_by=-imdb_score&director=quentin+tarantino",
        name: "Tarantino's movies",
        featured: false
    },
    {
        param: "?sort_by=-imdb_score&actor=graham+chapman",
        name: "If you like Monty Python",
        featured: false
    }
];

// API Endpoint
const API_ENDPOINT = "http://localhost:8000/api/v1/titles/";

/* Movie information */
// Array where all the movie information downloaded from the API will be stored, 
// emptied everytime the page is refreshed.
const MOVIES_FROM_API = [];

// All fields and the matching UI name 
const MOVIE_FIELDS = {
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