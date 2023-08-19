const menuBtn = document.querySelector("#menubar"),
  spotifyBtn = document.querySelector("#spotify"),
  container = document.querySelector(".music-container");
  
const progressBar = document.querySelector(".bar"),
  currentTimeEl = document.querySelector(".current-time"),
  durationEl = document.querySelector(".duration");
  
const volumeBtn = document.querySelector("#volume"),
  volumeMuteBtn = document.querySelector("#volume-mute");

const playlistContainer = document.querySelector("#playlist"),
  infoWrapper = document.querySelector(".info"),
  coverImage = document.querySelector(".cover-image"),
  currentSongTitle = document.querySelector(".current-song-title"),
  currentFavorite = document.querySelector("#current-favorite");

//scroll effect on hover for playlist song if title too long currently not in use(currently not in use)
const playlistTitle = document.querySelector(".title"),
  playlistTitleWidth = playlistTitle.offsetWidth;

const playPauseBtn = document.querySelector("#playBtn"),
  nextBtn = document.querySelector("#next"),
  prevBtn = document.querySelector("#prev");

const shuffleBtn = document.querySelector("#shuffle");

const repeatBtn = document.querySelector("#repeatBtn"),
  repeatPlaylistBtn = document.querySelector("#repeat"),
  repeatSongBtn = document.querySelector("#repeat-one");

const playBtn = document.querySelector("#play"),
  pauseBtn = document.querySelector("#pause");

const seeker = document.querySelector("#slider");

const hidden = 'hidden',
  display = 'display';

let playing = false,
  currentSong = 0,
  shuffle = false,
  repeat = false,
  favorite = [],
  audio = new Audio();

init();

//toggle menu from song to playlist & vice versa
menuBtn.addEventListener("click", () => {
  container.classList.toggle("active");
});

//open song in spotify
spotifyBtn.addEventListener("click", () => {
  //if no spotify url then return and do nothing
  if (songs[currentSong].url == null) {
    return;
  }
  else {
    window.open(songs[currentSong].url, '_blank');
  }
});

//scroll if song title too long (deprecated)
document.querySelectorAll("#h5title")
.forEach (item => {
  //215 = table width in pixels
  if (item.offsetWidth > playlistTitleWidth) {
    item.classList.add("scrolled");
  }
})

//play, pause, next, prev functionality
playPauseBtn.addEventListener("click", () => {  
  if (playing) {
    //pause if already playing
    replaceIcon (playBtn, pauseBtn);
    playing = false;
    audio.pause();
  }
  else {
    //if not already playing, then play
    replaceIcon(pauseBtn, playBtn);
    playing = true;
    audio.play();
  }
});

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

//add to favorite when heart is clicked of current playing song
currentFavorite.addEventListener("click", () => {
  currentFavorite.classList.toggle("active");
  addToFavorites(currentSong);
});

shuffleBtn.addEventListener("click", shuffleSongs);
repeatBtn.addEventListener("click", repeatSong);

//repeat functionality for audio
audio.addEventListener("ended", () => {
  if (repeat == 1) {
    //if playlist being repeated play next song
    nextSong();
    audio.play();
  }
  else if (repeat == 2) {
      loadSong(currentSong);
      audio.play();
  }
  else {
    //if repeat off just play playlist once, then stop
    if (currentSong == songs.length - 1) {
      //if last song in playlist, stop playing
      audio.pause();
      replaceIcon (playBtn, pauseBtn);
      playing = false;
    }
    else {
      //if not continue to next song
      nextSong();
      audio.play();
    }
  }
});

//update progress
audio.addEventListener("timeupdate", () => {
  let progressPercent = audio.currentTime / audio.duration * 100;
  seeker.value = progressPercent;
});

seeker.addEventListener("input", (e) => {
  audio.currentTime = e.target.value / 100 * audio.duration;
});

audio.addEventListener("timeupdate", progress);

volumeBtn.addEventListener("click", toggleVolume);
volumeMuteBtn.addEventListener("click", toggleVolume);


//const songsEndpoint = "https://gist.githubusercontent.com/jimmydagumjr/4c2e5e07cec916b2457418de6eda8e42/raw/a9073045d9b25a43c54878eaf5dad3d57a413bd6/catharticsongs.JSON";

/*
const getData = async () => {
  const response = await fetch(songsEndpoint);
  //error handle
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  //convert data to json
  const data = await response.json();
  //Array.fromAsync(data).then((songs) => console.log(songs));
  return data;
}

const addSongs = async () => {
  songs = await getData();
  console.log(songs);
  updatePlaylist(songs);
  return songs;
}
addSongs();
*/


/* FUNCTIONS */


function init() {
  //set favorites from local storage when DOM loaded
  window.addEventListener("DOMContentLoaded", e => {
    if (localStorage.getItem("favorite") != null) {
      favorite = JSON.parse(localStorage.getItem("favorite"));
    }
    updatePlaylist(songs);
    loadSong(currentSong);
  });
}

function updatePlaylist(songs) {
    
  //remove any existing element 
  playlistContainer.innerHTML = "";

  //use for each on songs array  
  songs.forEach((song, index) => {  

    //extract data from song
    const {title, src} = song;

    //set favorite element to active if in local storage
    if (index == favorite[index]) {
      //addToFavorites(index);
      currentFavorite.classList.add("active");
    }
          
    //create a table row to wrap song
    const tr = document.createElement("tr");
      tr.classList.add("song");
      tr.innerHTML = `
        <td class="no">
          <h5>${index + 1}</h5>
        </td>
        <td class="title">
          <h5 id="h5title">${title}</h5>
        </td>
        <td class="length">
          <h5>5:55</h5>
        </td>
      `;
        
      playlistContainer.appendChild(tr);
      
      
      tr.addEventListener("click", (e) => {       
        //play song when clicked in playlist
        currentSong = index;
        loadSong(currentSong);
        audio.play();
        container.classList.remove("active");
        replaceIcon(pauseBtn, playBtn);
        playing = true;
      })
      
      const audioForDuration = new Audio(`${src}`);
      audioForDuration.addEventListener("loadedmetadata", () => {
        const duration = audioForDuration.duration;
        
        let songDuration = formatTime(duration);
        tr.querySelector(".length h5").innerText = songDuration;
      })
  });    
}

function formatTime (time) {
  //format time
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  //add trailing zero if seconds < 10
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
}

//audio play functionality
function loadSong(num) {
  //change all the titles, artists, and times, to current song
  
  infoWrapper.innerHTML = `
    <h2>${songs[num].title}</h2>
    <h3>${songs[num].artist}</h3>
    `;
    
    currentSongTitle.innerHTML = songs[num].title;
    
    //change the cover image
    
    coverImage.style.backgroundImage = `url(coverart/${songs[num].img_src})`;
    
    //add src of current song to audio variable
    
    audio.src = `${songs[num].src}`;
    
    //if song is favorited then highlight
    
    if(favorite.includes(num)) {
      currentFavorite.classList.add("active");
    }   
    else {
      //if not, remove active
      currentFavorite.classList.remove("active");
    }      
}

function nextSong() {
  //turn repeat song off on skip
  if (repeat == 2) {
    repeat = 1;
    repeatSongBtn.classList.remove("active");
    repeatPlaylistBtn.classList.add("active");
    replaceIcon (repeatPlaylistBtn, repeatSongBtn);
  }
  //shuffle when playing next song if shuffle selected
  if(shuffle) {
    shuffleFunc();
    loadSong(currentSong);
  }
  //if current song is not last in playlist
  if (currentSong < songs.length - 1) {
    //load the next song
    currentSong++;
  }
  else {
    //else if it's last song then play first
    currentSong = 0;
  }
    loadSong(currentSong);
    
    //after load if song was already playing, then continue playing
    if (playing) {
      audio.play();
    }
}

function prevSong() {
  //turn repeat song off on skip
  //if song is not finished move to beginning of song
  if (audio.currentTime > 1) {
    audio.currentTime = 0;
    return;
  }
  if (repeat == 2) {
    if (audio.currentTime < 1) {
      repeat = 1;
      repeatSongBtn.classList.remove("active");
      repeatPlaylistBtn.classList.add("active");
      replaceIcon (repeatPlaylistBtn, repeatSongBtn);
    }
  }
  //shuffle when playing prev song if shuffle selected
  if (shuffle) {
    shuffleFunc();
    loadSong(currentSong);
  }
  //if 1st song playing go to last song
  if (currentSong > 0) {
    //load the prev song
    currentSong--;
  }
  else {
    //else if it's 1st song then play last
    currentSong = songs.length - 1;
  }
  loadSong(currentSong);
    
  //after load if song was already playing, then continue playing
  if (playing) {
    audio.play();
  }
}

function addToFavorites(index) {
  //check if already in favorites, if so then remove
  if (favorite.includes(index)) {
    favorite = favorite.filter((item) => item !== index);
    localStorage.setItem("favorite", JSON.stringify(favorite));
    //if current song is removed also remove currentFavorite
    currentFavorite.classList.remove("active");
  }
  else {
    //if not already in favorites, then add
    favorite.push(index);
    localStorage.setItem("favorite", JSON.stringify(favorite));
    currentFavorite.classList.add("active");
    
  }
  //re-render playlist to show favorites after adding favorite
  //updatePlaylist(songs);
}

//shuffle functionality
function shuffleSongs() {
  //if shuffle false make it true & vice versa
  shuffle = !shuffle;
  shuffleBtn.classList.toggle("active");
}

//if shuffle true, shuffle songs when playing next or prev
function shuffleFunc() {
  if (shuffle) {
    //select random song from playlist
    currentSong = Math.floor(Math.random() * songs.length);
  }
  //if shuffle false then do nothing
}

//repeat functionality
function repeatSong() {
  if (repeat == 0) {
    //if repeat is off turn repeat on
    repeat = 1;
    //make button active if repeat is on
    repeatPlaylistBtn.classList.add("active");
  }
  else if (repeat == 1) {
    //if repeat is set to 1(repeating playlist), set repeat to 2(repeating song)
    repeat = 2;
    repeatSongBtn.classList.add("active");
    replaceIcon(repeatSongBtn, repeatPlaylistBtn);
  }
  else {
    //turn off repeat
    repeat = 0;
    repeatSongBtn.classList.remove("active");
    repeatPlaylistBtn.classList.remove("active");
    replaceIcon(repeatPlaylistBtn, repeatSongBtn);
  }
}

//progress function
function progress() {
  //retrieve duration and current time from audio
  let {duration, currentTime} = audio;
  //if not a number set to 0
  isNaN(duration) ? (duration = 0) : duration;
  isNaN(currentTime) ? (currentTime = 0) : duration;
  
  //update time elements
  
  //duration left is total duration value - current time in audio
  let durationLeft = duration - currentTime;
  //set html duration element to duration left and add minus sign to show how many seconds left in song
  durationEl.innerHTML = '-' + formatTime(durationLeft);
  //set html current time element
  currentTimeEl.innerHTML = formatTime(currentTime);
}

//mute & unmute function
function toggleVolume() {
  let volume = audio.volume;
  if (volume > 0) {
    audio.volume = 0;
    replaceIcon(volumeMuteBtn, volumeBtn);
    volumeMuteBtn.classList.add("active");
  }
  else if (volume == 0) {
    audio.volume = 1;
    replaceIcon(volumeBtn, volumeMuteBtn);
    volumeMuteBtn.classList.remove("active");
  }
}

//replace svg icon function, display first element, hide second element
function replaceIcon (e1, e2) {
  e1.classList.add(display);
  e1.classList.remove(hidden);
  e2.classList.add(hidden);
  e2.classList.remove(display);
}


















