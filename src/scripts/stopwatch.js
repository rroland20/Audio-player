function add() {
    timerControls.sec += 0.1;
    if (timerControls.sec >= 60) {
        timerControls.sec = 0;
        timerControls.min++;
        if (timerControls.min >= 99) {
            timerControls.min = 0;
        }
    }
    changeProgressLine();
    audioControls.timerShow.textContent = (timerControls.min > 9 ? timerControls.min : `0${timerControls.min}`) + ":" + (timerControls.sec > 10 ? Math.floor(timerControls.sec) : `0${Math.floor(timerControls.sec)}`);
}

function stopwatch(value) {
    switch (value) {
        case 'play' :
            timerControls.t = setInterval(add, 100);
            break;
        case 'pause' :
            clearInterval(timerControls.t);
            break;
        case 'reset' :
            clearInterval(timerControls.t);
            audioControls.timerShow.textContent = "00:00";
            timerControls.sec = 0; timerControls.min = 0;
            break;
        default:
            console.log('Undefined value');
    }
}

function changeProgressLine() {
    audioControls.trackLine.value = parseFloat(audioControls.trackLine.value) + 10 / audioControls.audio.duration; 
    audioControls.trackPrevLine.style.width = (audioControls.trackLine.value * 5.8) + "px";
}
