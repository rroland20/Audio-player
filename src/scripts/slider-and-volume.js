function inputVolume() {
    const leftOfThumb = document.getElementById("volume_line");

        audioControls.audio.volume = this.value / 100;
        leftOfThumb.style.width = (audioControls.volume.value * 2.52) + "px";
}

function inputTrackLine() {
    let currentSec = audioControls.audio.duration * this.value / 100;
    // timer update
    timerControls.min = parseInt(currentSec / 60);
    timerControls.sec = parseInt(currentSec % 60);
    
    audioControls.audio.currentTime = currentSec;
    audioControls.trackPrevLine.style.width = (audioControls.trackLine.value * 5.8) + "px";
}