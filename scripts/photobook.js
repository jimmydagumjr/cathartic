const photobookContainer = document.querySelector("#photo-container");

updatePhotobook(photos);

function updatePhotobook(photos) {

    //remove any existing element in photobook container
    photobookContainer.innerHTML = "";

    //use for each on photos array
    photos.forEach(photo => {
        //extract data from photo
        const {location, src, time} = photo;
        const div = document.createElement("div");

        //format time from photo
        formattedTime = time.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric"
        })

        div.classList.add("card");
        div.innerHTML = `
        <div class="card">
          <div class="card__img-container">
            <img class="card__img" loading="lazy" src="${src}">
          </div>
          <div class="card__details">
            <h2 class="card__location">${location}</h2>
            <p class="card__time">${formattedTime}</p>
          </div>
        </div>
        `;

        photobookContainer.appendChild(div);
    });
}