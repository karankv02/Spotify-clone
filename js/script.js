let currentSong = new Audio();
let songs;
let currFolder;
async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  
  let songUL = document
  .querySelector(".songlist")
  .getElementsByTagName("ul")[0];
  songUL.innerHTML = " ";
for (const song of songs) {
  songUL.innerHTML =
    songUL.innerHTML +
    `<li>
              <img class="invert" src="img/music.svg" alt="">
              <div class="info">

                <div class="songname">${song.replaceAll("%20", " ")}</div>
                
              </div>
              <div class="playnow">

                <img class="invert" style="width: 35px;;" src="img/play.svg" alt="">
              </div>
            


      </li>`;
}

// attach an event listener to each song
Array.from(
  document.querySelector(".songlist").getElementsByTagName("li")
).forEach((e) => {
  e.addEventListener("click", (element) => {
    playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
  });
});
return songs
}

function convertSecondsToMinutes(totalSeconds) {
  // Ensure totalSeconds is an integer
  if (isNaN(totalSeconds)|| totalSeconds < 0){
    return "00:00"
  }
  totalSeconds = Math.floor(totalSeconds);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}
const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/"+ track)
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
  
};
async function displayAlbums(){
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchor = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer")
  let array = Array.from(anchor); 
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
    if(e.href.includes("/songs/")){
      let folder = e.href.split("/").slice(-1)[0]
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}"class="card">
              <div class="play">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="44"
                  height="44"
                  fill="none"
                >
                  <!-- Circle with a green fill and slightly darker green stroke -->
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="#3be477"
                    stroke="#3be477"
                    stroke-width="1.5"
                  />
                  <!-- Darker green stroke -->

                  <!-- Path with black fill -->
                  <path
                    d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                    fill="black"
                  />
                </svg>
              </div>
              <img
                src="/songs/${folder}/cover.jpg"
                alt=""
              />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`
      
    }
  }
  //load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click",async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    })
  });
}

async function main() {
  await getSongs("songs/eng");
  playMusic(songs[0], true);
 
  //display all the albums on the page
  displayAlbums();
  // attach an event listner to prev play and next
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  //listen for timeupdate events
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(
      currentSong.currentTime
    )} / ${convertSecondsToMinutes(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      100 * (currentSong.currentTime / currentSong.duration) + "%";
  });

  // event listner for seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //event listner for hamburger button
  document.querySelector(".hamburger").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "0%";
  });

  //event listner for close button
  document.querySelector(".close").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "-100%";
  });

  //add event listener for previous song
  previous.addEventListener("click", (e) => {

    let index = songs.indexOf((currentSong.src.split("/").slice(-1)[0]));
    
    

    if ((index-1) >= 0) {
      playMusic(songs[index-1])
      
    }
  });
  next.addEventListener("click", (e) => {

    let index = songs.indexOf((currentSong.src.split("/").slice(-1)[0]));
    
    

    if ((index+1) < songs.length) {
      playMusic(songs[index+1])
      
    }
    
  });

 
}

main();
