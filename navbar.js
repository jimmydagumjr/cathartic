window.addEventListener("scroll", () => {
    /*
    let header = document.querySelector(".mainmenu");
    header.classList.toggle("sticky", window.scrollY > 0);
    */
    let clogo = document.querySelector(".cathartic-logo");
    let linelogo = document.querySelector(".line-logo");
    clogo.classList.toggle("-flip", window.scrollY > 0);
    linelogo.classList.toggle("-flip", window.scrollY > 0);
})