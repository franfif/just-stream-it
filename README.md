<h1 align="center">
JustStreamIt - Web User Interface
<br/>
<img alt="JustStreamIt logo" src="img/Logo_JustStreamIt.png" width="224px"/>
</h1>

<h2>Introduction</h2>
This is a web user interface aiming to provide movie enthustiasts with information about movies.</br> 


The ultimate goal is to enable users to stream movies directly from the interface.</br>
At this moment, the interface only displays movie posters and information about these movies.</br>

The interface is composed of a navigation bar, a featured movie space, and three categories of movies.</br>
Currently, the categories are Top-rated movies, Drama, Movies directed by Quentin Tarantino, and Movies related to Monty Python.


The user can scroll through the categories to find a movie that suits their desires and click on it to display more information.

## Installation
This project is stored locally. To display the interface, clone this project to your own local environment.

In order to access the data with the movie information, install and execute the [OCMovies-API REST API application](https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR). You can find all the information [here](https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR).

Once the [OCMovies-API app](https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR) is up and running, open the file [index.html](index.html) on your browser.

All major browsers are [supported](#browsers).

## Interface
The interface contains the following zones: 
- A [navigation bar](#navigation-bar) with useful links, at the top.
- A "Best Movie" space. This zone displays the movie that has the best IMDb rating, with the movie poster, movie title, a play button, and a summary of the movie.</br>
- A "Top-Rated Movies" [category](#categories): This zone displays the seven next-best-rated movies. The user can scroll through them using arrows on the left and right of the slider.</br>
- A "Drama" category: Shows the seven best-rated movies of the "Drama" genre. 
- A "Tarantino's movies" [category](#categories): Shows the seven best-rated movies directed by Quentin Tarantino.</br>
- A "If you like Monty Python" [category](#categories): Shows the seven best-rated movies starring Graham Chapman, one of six members of Monty Python.

### Navigation bar
The navigation bar is always visible for reference and ease of navigation. It reduces when the page is scrolled down.
The menu is reduced to a burger button when the viewport width is reduced.

At the moment, the navigation bar menu options are not functional. They simply show how they will appear once the navigation items have been determined. </br>

We suggest to implement at least:</br>
- a link to access categories and display only movies from a selected category,
- a link to access and manage the user's account,
- a search bar to quickly find a movie.

### Categories
A category displays at most seven movies. If the width of the window or device does not allow all movies to be displayed at once, the user can use arrows to scroll horizontally through the category. The user may also use a touchpad to scroll.

Within each category, movies are represented by a poster and a title, in an horizontal slider.</br>
To get more information about a movie, the user can click on the poster or the movie title, to open the [modal window](#modal).
At this time, the categories are personalizable in the code, but not by the user on the interface. 

### Modal 
When the user clicks on the featured movie’s button or on any movie’s image, a modal window opens. In this window, the following information is listed:
- The image of the movie cover
- Title
- Director(s)
- List of actors
- Genre(s)
- Duration
- Release date
- MPAA rating
- IMDb score
- Country of origin
- Box Office result
- Movie summary

The modal window can be closed either by clicking on the cross on the top right-hand corner, or anywhere outside of the modal window.

## Responsive design
The interface is built with responsive design. The layout is adapted to the width of the device or the window, from phone to tablet to desktop.</br>
The design has been realized in CSS with [SASS](https://sass-lang.com/).

## Browsers
All major browsers, including Chrome, Firefox, Safari and Edge are supported, down to the last 4 versions.</br>
This has been ensured with the postCSS plugin [autoprefixer](https://github.com/postcss/autoprefixer).

