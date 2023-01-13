let list = document.querySelector(".nav__list");
let burger_lines = document.querySelector(".menu__button")

function toggleMenu() {
    list.classList.toggle("nav__list--closed");
    burger_lines.classList.toggle("menu__button--checked");

}

let modal = document.getElementById("myModal");
let slides = document.querySelectorAll(".slide");
let close_btn = document.querySelector(".modal__close-btn");

slides.forEach(slide => {
    slide.addEventListener('click', () => {
        modal.style.display = "block";
    })
})

close_btn.addEventListener('click', () => {
    modal.style.display = "none";
})
window.addEventListener('click', event => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
})