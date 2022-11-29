function settingsForRadio() {
    if (audioControls.audio.duration == "Infinity") {
        audioControls.trackLine.setAttribute("disabled", "");
        audioControls.trackLine.value = "100";
        audioControls.trackPrevLine.style.width = "580px";
    }
    else {
        if (audioControls.trackLine.hasAttribute("disabled"))
            audioControls.trackLine.removeAttribute("disabled");
    }
}

function loaderWhenBuffering(audioObj) {
    changeDisplay('#loader', false);
    audioObj.addEventListener('waiting', function() {
        changeDisplay('#loader', true);
        stopwatch("pause");
        audioControls.flag = false;
    });
    if (!audioControls.flag && audioObj.duration != "Infinity") { 
        stopwatch("play");
    }
}

function audioEnded(audioObj) {
    audioObj.addEventListener('ended', function() {
        changeDisplay('.rect_pause', false);
        changeDisplay('.rect_pause2', false);
        changeDisplay('.path_play', true);
        audioObj.load();
        stopwatch("reset");
        audioControls.trackPrevLine.style.width = "0px";
        audioControls.trackLine.value = "0";
    })
}

function initAudioControls() {
    const leftOfTheThumb = document.getElementById("track_line");
    const trackLine = document.getElementById('widget_track_line');
    const timerShow = document.getElementById('widget_time');

    audioControls.trackPrevLine = leftOfTheThumb;
    audioControls.trackLine = trackLine;
    audioControls.timerShow = timerShow;
}

function insertAudioObjInDOM(audioObj) {
    const player = document.getElementById('player');
    const widgetPlayer = document.getElementById('widget_player');

    audioObj.setAttribute('id', "player_window");
    player.insertBefore(audioObj, widgetPlayer);
    audioControls.audio = audioObj;
}

function audioCanPlayLink(audioObj, linkAudio) {
    audioObj.addEventListener('canplay', () => {
        const source = document.getElementById('source');

        initAudioControls();
        
        // меняем видимость //
        changeDisplay('#main', false);
        changeDisplay('#player', true);
        linkAudio.value = "";

        source.textContent = audioObj.currentSrc; // добавляю текст источника
        insertAudioObjInDOM(audioObj); // вставка объекта Audio в DOM
        settingsForRadio(); // если это радио
        loaderWhenBuffering(audioObj); // Loader при буферизации
        audioEnded(audioObj); // если воспроизведение музыки закончилось
    })
}