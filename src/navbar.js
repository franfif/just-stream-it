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
