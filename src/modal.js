const modalCloser = document.querySelector(".modal__close-btn");
const modalList = document.querySelector(".modal__list");
const modalMovieDetails = document.getElementById("myModal");

/* Modal */
function modalUp() {
    const modalOpeners = document.querySelectorAll(".modal-movie-details--opener");

    // Get the closest ancestor with a movie-id class
    function getMovieId(element) {
        return element.closest(".movie-id").id;
    }
    // Create eventlistener for each element able to open a modal
    modalOpeners.forEach(opener => {
        opener.addEventListener('click', (event) => {
            fillModal('http://localhost:8000/api/v1/titles/' + getMovieId(event.target));
            modalMovieDetails.style.display = "block";
            document.body.classList.add("no-scroll");
        })
    })
}

// Manage the closing of a modal
function closingModal() {
    // Hide the modal
    modalMovieDetails.style.display = "none";
    // Empty the content of the modal
    modalList.innerHTML = "";
    // Allow back scrolling on the main page
    document.body.classList.remove("no-scroll");
}

// Create eventlistener for the closing button in the modal
modalCloser.addEventListener('click', closingModal)

// Close the modal if user click outside of it
window.addEventListener('click', event => {
    if (event.target == modalMovieDetails) {
        closingModal();
    }
})