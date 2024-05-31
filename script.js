let currentSong = new Audio();
let Songs;
// let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs() {

    // currFolder = folder;
    let a = await fetch("http://127.0.0.1:5500/Songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    Songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            Songs.push(element.href.split("/Songs/")[1])
        }

    }
    // Show all the Songs in the playlist
    let SongUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    // SongUL.innerHTML = ""
    for (const song of Songs) {
        SongUL.innerHTML = SongUL.innerHTML + `
        <li>
                        <img src="SVGs/music.svg" alt="">
                        <div class="info">
                        <div>${song.replaceAll("%20", " ")}</div>
                        </div>
                        <div class="playnow">
                        <span>Play now</span>
                        <img class="invert" src="SVGs/play.svg" alt="">
                        </div>
      </li>`;
    }

    // Attach an eventlistener to each song 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element =>{
        // console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
      })

    
    return Songs
}

const playMusic = (track,pause=false) =>{
    // let audio = new Audio("/Songs/" + track)
    currentSong.src = `/Songs/` + track
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }
    // currentSong.play()
    // play.src = "play.svg"
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

    
}

// async function displayAlbums() {
//     console.log("displaying albums")
//     let a = await fetch(`/Songs/`)
//     let response = await a.text();
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a")
//     let cardContainer = document.querySelector(".cardContainer")
//     let array = Array.from(anchors)
//     for (let index = 0; index < array.length; index++) {
//         const e = array[index]; 
//         if (e.href.includes("/Songs") && !e.href.includes(".htaccess")) {
//             let folder = e.href.split("/").slice(-2)[0]
//             // Get the metadata of the folder
//             let a = await fetch(`/Songs/${folder}/info.json`)
//             let response = await a.json(); 
//             cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
//             <div class="play">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
//                     xmlns="http://www.w3.org/2000/svg">
//                     <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
//                         stroke-linejoin="round" />
//                 </svg>
//             </div>

//             <img src="/Songs/${folder}/cover.jpg" alt="">
//             <h2>${response.title}</h2>
//             <p>${response.description}</p>
//         </div>`
//         }
//     }
//     // Load the playlist whenever the card is clicked
//     Array.from(document.getElementsByClassName("card")).forEach(e =>{
//         e.addEventListener("click", async item =>{
//             Songs = await getSongs((`Songs/${item.currentTarget.dataset.folder}`))
//         })
//     })
// }

async function main() {

   
    // Getting the list of all the songs
    await getSongs("Songs")
    playMusic(Songs[0], true)

    // Display all the albums on the pages 
    // await displayAlbums()
   
    

      // Attach an event listener to play, next and previous 
    play.addEventListener("click",() => {
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = Songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < Songs.length) {
            playMusic(Songs[index + 1])
        }
    })

    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = Songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(Songs[index - 1])
        }
    })


    // Adding an eventlistener to volume rocker

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    //    console.log(e, e.target, e.target.value) 
       currentSong.volume = parseInt(e.target.value)/100
    })



    //    listen for time update event 
        currentSong.addEventListener("timeupdate", ()=>{
            // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%";
     })

          
        //   Adding a eventlistener to seekbar 
        document.querySelector(".seekbar").addEventListener("click", e=>{
            let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = percent  + "%";
            currentSong.currentTime = ((currentSong.duration) * percent)/100;
           })

            // adding a eventlistener to hamburger
            document.querySelector(".hamburger").addEventListener("click", ()=>{
                document.querySelector(".left").style.left = "0"
            })

             // adding a eventlistener to close button
            document.querySelector(".close").addEventListener("click", ()=>{
                document.querySelector(".left").style.left = "-120%"
            })


            

            
           
}

    

main()
