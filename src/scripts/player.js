const audioControls = {
    audio:          null,
    volume:         null,
    timerShow:      null,
    trackLine:      null,
    trackPrevLine:  null,
    flag:           true,
};

const timerControls = {
    sec:            0,
    min:            0,
    t:              null,
};

function changeDisplay(id, opened) {
    let display = opened ? 'flex' : 'none';
    document.querySelector(id).style.display = display;
}

function addErrorElement(audioObj) {
    const main = document.getElementById('main');
    const strError = document.createElement('output');
    strError.classList.add("str_error");

    if (audioObj.error.message == "MEDIA_ELEMENT_ERROR: Empty src attribute")
        strError.value = "Please enter audio link";
    else if (audioObj.error.message == "MEDIA_ELEMENT_ERROR: Format error")
        strError.value = "Incorrect format link";
    else if (audioObj.error.message == "")
        strError.value = "Incorrect link";
    else
        strError.value = "Please, enter correct link";
    main.append(strError);
}

function onSubmit() {
    // создание объекта Audio //
    const linkAudio = document.getElementById('input');
    let audioObj = new Audio(linkAudio.value);
    
    // установка громкости по умолчанию //
    audioObj.volume = "0.4";
    
    // если ссылка валидная //
    audioObj.addEventListener('canplay', () => {
        const player = document.getElementById('player');
        const source = document.getElementById('source');
        const widgetPlayer = document.getElementById('widget_player');
        const leftOfTheThumb = document.getElementById("track_line");
        const trackLine = document.getElementById('widget_track_line');
        const timerShow = document.getElementById('widget_time');

        audioControls.trackPrevLine = leftOfTheThumb;
        audioControls.trackLine = trackLine;
        audioControls.timerShow = timerShow;
        
        // меняем видимость //
        changeDisplay('#main', false);
        changeDisplay('#player', true);
        linkAudio.value = "";

        // добавляю текст источника //
        source.textContent = audioObj.currentSrc;
        
        // вставка объекта Audio в DOM //
        audioObj.setAttribute('id', "player_window");
        player.insertBefore(audioObj, widgetPlayer);
        audioControls.audio = audioObj;
        
        // если это радио //
        if (audioControls.audio.duration == "Infinity") {
            audioControls.trackLine.setAttribute("disabled", "");
            audioControls.trackLine.value = "100";
            audioControls.trackPrevLine.style.width = "580px";
        }
        else {
            if (audioControls.trackLine.hasAttribute("disabled"))
                audioControls.trackLine.removeAttribute("disabled");
        }

        // Loader при буферизации //        
        changeDisplay('#loader', false);
        audioObj.addEventListener('waiting', function() {
            changeDisplay('#loader', true);
            stopwatch("pause");
            audioControls.flag = false;
        });
        if (!audioControls.flag && audioObj.duration != "Infinity") { 
            stopwatch("play");
        }

        // если воспроизведение музыки закончилось //
        audioObj.addEventListener('ended', function() {
            changeDisplay('.rect_pause', false);
            changeDisplay('.rect_pause2', false);
            changeDisplay('.path_play', true);
            audioObj.load();
            stopwatch("reset");
            audioControls.trackPrevLine.style.width = "0px";
            audioControls.trackLine.value = "0";
        })
    })

    // если произошла ошибка //
    audioObj.addEventListener('error', function() {
        // меняю стиль ввода //
        const input_url = document.getElementById('input');
        if (input_url.classList.contains("input-ok")) {
            input_url.classList.remove("input-ok");
            input_url.classList.add("input-err");
        }

        // добавляю иконку ошибки //
        if (!document.querySelector(".but_error")) {
            const inputPlace = document.getElementById('input_place');
            var but = document.createElement('button');

            but.classList.add("but_error");
            inputPlace.append(but);

            but.innerHTML = '<svg class="item_error" viewBox="0 0 24 24" width="24" height="24" fill="none">\
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#C6A827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\
            </path><path d="M12 8V12" stroke="#C6A827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\
            </path><circle cx="12" cy="16" r="0.5" fill="black" stroke="#C6A827"></circle></svg>';
        }

        // добавляю подпись с ошибкой //
        const strError = document.querySelector(".str_error");

        if (strError)
            strError.remove();
        addErrorElement(audioObj);
    }, false);
}

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

function errorHiding() {
    if (this.classList.contains("input-err")) {
        this.classList.remove("input-err");
        this.classList.add("input-ok");
        const butError = document.querySelector(".but_error");
        const strError = document.querySelector(".str_error");
        butError.remove();
        strError.remove();
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
    
// начало загрузки страницы //
document.addEventListener('DOMContentLoaded', () => {
    // кнопка submit //
    const submitBtn = document.getElementById('submit');
    submitBtn.addEventListener('click', onSubmit);
    
    // скрытие отображения ошибки при новом вводе //
    const input_url = document.getElementById('input');
    input_url.addEventListener('input', errorHiding);    

    // реализация плеера //
    const widgetPlayBtn = document.getElementById('widget_play');
    widgetPlayBtn.addEventListener('click', playBtn);

    // кнопка назад //
    const backBtn = document.getElementById('back');
    backBtn.addEventListener('click', backButton);

    // громкость //
    const volumeRange = document.getElementById("widget_volume");
    audioControls.volume = volumeRange;
    volumeRange.addEventListener('input', inputVolume);
    
    // вручную меняем ползунок прогресса //
    const trackLine = document.getElementById('widget_track_line');
    trackLine.addEventListener('input', inputTrackLine);
});

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
