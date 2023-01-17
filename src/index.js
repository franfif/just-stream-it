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

window.onscroll = function () { reduceHeader() };

function reduceHeader() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        document.querySelector(".header__logo img").classList.remove("scrolled-up");
    } else {
        document.querySelector(".header__logo img").classList.add("scrolled-up");
    }
}

let arrowLeft = document.querySelector(".carousel__arrow-left");
let arrowRight = document.querySelector(".carousel__arrow-right");

arrowLeft.addEventListener('click', (event) => myScroll(event, toTheLeft = true));
arrowRight.addEventListener('click', (event) => myScroll(event, toTheLeft = false));

function myScroll(event, toTheLeft = false) {
    let vw = visualViewport.width - 100;
    let delta = toTheLeft ? -vw : vw;
    let slide = event.target.parentNode;
    console.log(slide.scrollLeft);
    slide.scroll({
        left: slide.scrollLeft + delta,
        behavior: 'smooth'
    });

}