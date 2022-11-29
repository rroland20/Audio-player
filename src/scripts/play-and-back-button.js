function playBtn() {
    if (audioControls.audio.paused) { // включение аудио
        changeDisplay('.rect_pause', true);
        changeDisplay('.rect_pause2', true);
        changeDisplay('.path_play', false);
        audioControls.audio.play();
        stopwatch("play");
    }
    else { // выключение аудио
        changeDisplay('.rect_pause', false);
        changeDisplay('.rect_pause2', false);
        changeDisplay('.path_play', true);
        audioControls.audio.pause();
        stopwatch("pause");
    }
}

function backButton() {
    audioControls.audio.remove();
    changeDisplay('#main', true);
    changeDisplay('#player', false);
    if (!audioControls.audio.pause()) {
        changeDisplay('.rect_pause', false);
        changeDisplay('.rect_pause2', false);
        changeDisplay('.path_play', true);
        audioControls.audio.pause();
    }
    stopwatch("reset");
    audioControls.trackPrevLine.style.width = "0px";
    audioControls.trackLine.value = "0";
    const volumeRange = document.getElementById("widget_volume");
    const leftOfThumb = document.getElementById("volume_line");
    volumeRange.value = "40";
    leftOfThumb.style.width = (volumeRange.value * 2.52) + "px";
    audioControls.audio = null;
    delete audioControls.audio;
}