/* Modal */
const MODAL_CLOSER = document.querySelector(".modal__close-btn");
const MODAL_LIST = document.querySelector(".modal__list");
const MODAL_ELEMENT = document.getElementById("modal-movie-details");

// Open modal
function openingModal(movieId) {
    // Add information to modal
    fillModal(movieId);
    // Diplay modal element
    MODAL_ELEMENT.style.display = "block";
    // Block scrolling of the page
    document.body.classList.add("no-scroll");
}

// Manage the closing of a modal
function closingModal() {
    // Hide the modal
    MODAL_ELEMENT.style.display = "none";
    // Empty the content of the modal
    MODAL_LIST.innerHTML = "";
    // Allow back scrolling on the main page
    document.body.classList.remove("no-scroll");
}

// Create eventlistener for the closing button in the modal
MODAL_CLOSER.addEventListener('click', closingModal)

// Close the modal if user click outside of it
window.addEventListener('click', event => {
    if (event.target == MODAL_ELEMENT) {
        closingModal();
    }
})