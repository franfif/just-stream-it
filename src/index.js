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

let leftArrows = document.querySelectorAll(".arrow-holder__left");
let rightArrows = document.querySelectorAll(".arrow-holder__right");

leftArrows.forEach(arrow => {
    arrow.addEventListener('click', (event) => myScroll(event, toTheLeft = true));
});
rightArrows.forEach(arrow => {
    arrow.addEventListener('click', (event) => myScroll(event, toTheLeft = false));
});

function myScroll(event, toTheLeft = false) {
    let scrollValue = visualViewport.width - 180; //180 = max-width of figure caption.
    scrollValue = toTheLeft ? -scrollValue : scrollValue;
    slider = event.target.closest(".slider__container").querySelector(".slider");
    slider.scroll({
        left: slider.scrollLeft + scrollValue,
        behavior: 'smooth'
    });
}
