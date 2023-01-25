/* Slider */
// Operate horizontal scroll 
function scrollHorizontally(arrow, toTheLeft = false) {
    let scrollValue = visualViewport.width - 180; // 180 = max-width of figure caption.
    scrollValue = toTheLeft ? -scrollValue : scrollValue;
    // Get slider element from the category
    const slider = arrow.closest(".slider__container").querySelector(".slider");
    slider.scroll({
        left: slider.scrollLeft + scrollValue,
        behavior: 'smooth'
    });
}
