/* Slider */
// Set all sliders scroll to the left
const sliders = document.querySelectorAll(".slider");
sliders.forEach(slider => {
    slider.scrollLeft = 0;
});

// Get all arrows
const leftArrows = document.querySelectorAll(".arrow-holder__left");
const rightArrows = document.querySelectorAll(".arrow-holder__right");

// Add eventlistener to arrows to activate horizontal scroll
leftArrows.forEach(arrow => {
    arrow.addEventListener('click', (event) => scrollHorizontal(event, toTheLeft = true));
})
rightArrows.forEach(arrow => {
    arrow.addEventListener('click', (event) => scrollHorizontal(event, toTheLeft = false));
})

// Define horizontal scroll
function scrollHorizontal(event, toTheLeft = false) {
    // Make sure any cut thumbnail will be shown after scroll
    let scrollValue = visualViewport.width - 180; //180 = max-width of figure caption.
    scrollValue = toTheLeft ? -scrollValue : scrollValue;
    // Get slider element from the category
    const slider = event.target.closest(".slider__container").querySelector(".slider");
    slider.scroll({
        left: slider.scrollLeft + scrollValue,
        behavior: 'smooth'
    });
}
