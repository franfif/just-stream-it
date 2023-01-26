// Replace any image not loaded by a dummy image
function useDummyImage(image) {
    image.onerror = "";
    image.src = "./img/No_movie_image.png";
    return true;
};