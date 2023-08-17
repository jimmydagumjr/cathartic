const active = "active-page",
    delay = 500; //delay in ms

const musicBtn = document.querySelector(".musicMenu"),
    photobookBtn = document.querySelector(".photoMenu");

const musicContainer = document.querySelector(".music-container"),
    musicPage = document.querySelector(".music-body");

const photoContainer = document.querySelector(".photo-container"),
    photoPage = document.querySelector(".photo-body");

//music button click event
musicBtn.addEventListener("click", () => {
    //if already on page, do not do anything
    if (musicPage.classList.contains(active)) {
        return;
    }
    //if on photobook page, do photobook page remove animation
    if (photoPage.classList.contains(active)) {
        // if it contains transformation classes, reset state
        if (photoContainer.classList.contains("page-switch-down" && "page-switch-up")) {
            slideDown(photoContainer);
            slideUp(photoContainer);
        }
        slideDown(photoContainer);
        setTimeout(function() {
            toggleHide(photoPage);
            toggleHide(photoContainer);
        }, delay);
        toggleActive(photoPage);
    }
    //toggle on photobook page active class
    toggleActive(musicPage);
    toggleHide(musicPage);
    toggleHide(musicContainer);
    setTimeout(function() {
        slideUp(musicContainer);
    }, delay);
    //resetAnimation(musicContainer);
    //musicContainer.addEventListener()
    
})

//photobook button click event
photobookBtn.addEventListener("click", () => {
    //if already on page, do not do anything
    if (photoPage.classList.contains(active)) {
        return;
    }
    //if on music page, do music page remove animation
    if (musicPage.classList.contains(active)) {
        // if it contains transformation classes, reset state
        if (musicContainer.classList.contains("page-switch-down" && "page-switch-up")) {
            slideDown(musicContainer);
            slideUp(musicContainer);
        }
        slideDown(musicContainer);
        setTimeout(function() {
            toggleHide(musicPage);
            toggleHide(musicContainer);
        }, delay);
        toggleActive(musicPage);
    }
    //toggle on photobook page active class
    toggleActive(photoPage);
    toggleHide(photoPage);
    toggleHide(photoContainer);
    setTimeout(function() {
        slideUp(photoContainer);
    }, delay);
})

function slideDown(e) {
    e.classList.toggle("page-switch-down");
}

function slideUp(e) {
    e.classList.toggle("page-switch-up");
}

function toggleHide(e) {
    e.classList.toggle("hide");
}

function toggleActive(e) {
    e.classList.toggle(active);
}

function resetAnimation(e) {
    e.classList.toggle("page-switch-down");
    e.classList.toggle("page-switch-up");
}