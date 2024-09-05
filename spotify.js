
let currentsong = new Audio();
let songs;

function formatSecondsToMinutes(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Pad minutes and seconds with leading zeros if necessary
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${String(Math.floor(formattedSeconds)).padStart(2,'0')}`;
}

async function getsongs(){

    let a = await fetch('http://127.0.0.1:5500/Projeect_1/songs/');
    let response = await a.text();
    
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songlist =[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songlist.push(element.href.split("/songs/")[1]);
        }
        
    }
    return songlist;
}

const playmusic = (track,pause=false)=>{
  
  currentsong.src = "/Projeect_1/songs/"+track;
  
  if(!pause){
    currentsong.play();
    document.querySelector(".play").innerHTML = `<div class="play" style="cursor: pointer;">
                <i class="fa-solid fa-pause"></i>
              </div>`;
  }

  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
}

async function main(){
    songs = await getsongs();
    playmusic(songs[0],true);

    let songUL = document.querySelector('.songlist').getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li class="songcard">
        <div class="card1">
                    <div>
                      <i class="fa-solid fa-music"></i>
                    </div>
                    <div>
                      <span class="songname">${song.replaceAll("%20"," ")}</span><br>
                      <span class="songartist">Sachet Tandon</span>
                    </div>
                    <div class="playnow">
                      <i class="fa-regular fa-circle-play"></i>
                    </div>
                  </div>
        </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector('.songlist').getElementsByTagName("li")).forEach((e)=>{
      e.addEventListener("click",ele=>{
        
        playmusic(e.querySelector(".card1").querySelector(".songname").innerHTML);
      })
    });

    // Attach an eventlistener to play , next and prev
    document.querySelector(".play").addEventListener("click",()=>{
      if(currentsong.paused){
        currentsong.play();
        document.querySelector(".play").innerHTML = `<div class="play" style="cursor: pointer;">
                <i class="fa-solid fa-pause"></i>
              </div>`;
      }
      else{
        currentsong.pause();
        document.querySelector(".play").innerHTML = `<div class="play" style="cursor: pointer;">
                <i class="fa-solid fa-play"></i>
              </div>`;
      }
    });

    // Attach an eventlistener to update time
    currentsong.addEventListener("timeupdate",()=>{
      
      let currentTime = formatSecondsToMinutes(currentsong.currentTime);
      
      let duration = formatSecondsToMinutes(currentsong.duration);
      
      document.querySelector(".songTime").innerHTML = `${currentTime} / ${duration}`;

      document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + '%';
    });

    // Add an eventlisteneeer to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
      let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;

      document.querySelector(".circle").style.left = percent + '%';

      currentsong.currentTime = ((currentsong.duration)*percent)/100;
    });

    // Add an eventlistener to hamberger to open sidebar
    document.querySelector(".hamberger").addEventListener("click",()=>{
      document.querySelector(".left").style.left = 0+"%";
    });

    // Add an eventlistener to cross to close sidebar
    document.querySelector(".close").addEventListener("click",()=>{
      document.querySelector(".left").style.left = -100+"%";
    });

    // add an eventlistener on previous button
    document.querySelector("#prev").addEventListener("click",()=>{
      let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
      if((index-1)>= 0){
        playmusic(songs[index-1]);
      }
    })

    // add an eventlistener on next button
    document.querySelector("#next").addEventListener("click",()=>{
      let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
      if((index+1)< songs.length){
        playmusic(songs[index+1]);
      }
    })

    // Add an eventlistener to volume seekbar
    document.querySelector(".vol-seekbar").addEventListener("click",e=>{
      let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;

      document.querySelector(".vol-circle").style.left = percent + '%';
    });
    document.querySelector(".vol-seekbar").addEventListener("click",e=>{
      
      currentsong.volume = parseInt(document.querySelector(".vol-circle").style.left)/100;
    });
}
main();
