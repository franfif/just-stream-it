let list = document.querySelector(".nav__list");
let burger_lines = document.querySelector(".menu__button")

function toggleMenu() {
    list.classList.toggle("nav__list--closed");
    burger_lines.classList.toggle("menu__button--checked");

}

let modalMovieDetails = document.getElementById("myModal");
let modalOpeners = document.querySelectorAll(".modal-movie-details--opener");
let modalCloser = document.querySelector(".modal__close-btn");

modalOpeners.forEach(opener => {
    opener.addEventListener('click', () => {
        modalMovieDetails.style.display = "block";
    })
})

modalCloser.addEventListener('click', () => {
    modalMovieDetails.style.display = "none";
})
window.addEventListener('click', event => {
    if (event.target == modalMovieDetails) {
        modalMovieDetails.style.display = "none";
    }
})