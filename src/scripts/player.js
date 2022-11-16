let audioControls = {
    audio:          null,
    volume:         null,
    timerShow:      null,
    trackLine:      null,
    trackPrevLine:  null,
    flag:           true,
};

function changeDisplay(id, opened) {
    let display = opened ? 'flex' : 'none';
    document.querySelector(id).style.display = display;
}

function addErrorElement(audioObj) {
    let main = document.getElementById('main');
    let strError = document.createElement('output');
    strError.classList.add("str_error");

    if (audioObj.error.message == "MEDIA_ELEMENT_ERROR: Empty src attribute")
        strError.value = "Please enter audio link";
    else if (audioObj.error.message == "MEDIA_ELEMENT_ERROR: Format error")
        strError.value = "Incorrect format link";
    else if (audioObj.error.message == "")
        strError.value = "Incorrect link";
    else
        strError.value = "Please, enter correct link";
    main.appendChild(strError);
}

function onSubmit() {
    // создание объекта Audio //
    let linkAudio = document.getElementById('input');
    let audioObj = new Audio(linkAudio.value);
    
    // установка громкости по умолчанию //
    audioObj.volume = "0.4";
    
    // если ссылка валидная //
    audioObj.addEventListener('canplay', () => {
        let player = document.getElementById('player');
        let source = document.getElementById('source');
        let widgetPlayer = document.getElementById('widget_player');
        let leftOfTheThumb = document.getElementById("track_line");
        let trackLine = document.getElementById('widget_track_line');
        let timerShow = document.getElementById('widget_time');

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
        let input_url = document.getElementById('input');
        if (input_url.classList.contains("input-ok")) {
            input_url.classList.remove("input-ok");
            input_url.classList.add("input-err");
        }

        // добавляю иконку ошибки //
        if (!document.querySelector(".but_error")) {
            let inputPlace = document.getElementById('input_place');
            var but = document.createElement('button');
            const item = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
            
            but.classList.add("but_error");
            item.classList.add("item_error");
            item.setAttributeNS(null, "viewBox", "0 0 24 24");
            item.setAttributeNS(null, "width", "24");
            item.setAttributeNS(null, "height", "24");
            item.setAttributeNS(null, "fill", "none");
            
            const path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            const path2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            const circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            
            path1.setAttributeNS(null, "d", "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z");
            path1.setAttributeNS(null, "stroke", "#C6A827");
            path1.setAttributeNS(null, "stroke-width", "2");
            path1.setAttributeNS(null, "stroke-linecap", "round");
            path1.setAttributeNS(null, "stroke-linejoin", "round");
            
            path2.setAttributeNS(null, "d", "M12 8V12");
            path2.setAttributeNS(null, "stroke", "#C6A827");
            path2.setAttributeNS(null, "stroke-width", "2");
            path2.setAttributeNS(null, "stroke-linecap", "round");
            path2.setAttributeNS(null, "stroke-linejoin", "round");
            
            circle.setAttributeNS(null, "cx", "12");
            circle.setAttributeNS(null, "cy", "16");
            circle.setAttributeNS(null, "r", "0.5");
            circle.setAttributeNS(null, "fill", "black");
            circle.setAttributeNS(null, "stroke", "#C6A827");
            
            item.append(path1);
            item.append(path2);
            item.append(circle);
            
            but.appendChild(item);
            inputPlace.appendChild(but);
        }

        // добавляю подпись с ошибкой //
        let strError = document.querySelector(".str_error");

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
        let butError = document.querySelector(".but_error");
        let strError = document.querySelector(".str_error");
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
    let volumeRange = document.getElementById("widget_volume");
    let leftOfThumb = document.getElementById("volume_line");
    volumeRange.value = "40";
    leftOfThumb.style.width = (volumeRange.value * 2.52) + "px";
    audioControls.audio = null;
    delete audioControls.audio;
}

function inputVolume() {
    let leftOfThumb = document.getElementById("volume_line");

        audioControls.audio.volume = this.value / 100;
        leftOfThumb.style.width = (audioControls.volume.value * 2.52) + "px";
}

function inputTrackLine() {
    let currentSec = audioControls.audio.duration * this.value / 100;
    // timer update
    min = parseInt(currentSec / 60);
    sec = parseInt(currentSec % 60);
    
    audioControls.audio.currentTime = currentSec;
    audioControls.trackPrevLine.style.width = (audioControls.trackLine.value * 5.8) + "px";
}
    
// начало загрузки страницы //
document.addEventListener('DOMContentLoaded', () => {
    // кнопка submit //
    let submitBtn = document.getElementById('submit');
    submitBtn.addEventListener('click', onSubmit);
    
    // скрытие отображения ошибки при новом вводе //
    let input_url = document.getElementById('input');
    input_url.addEventListener('input', errorHiding);    

    // реализация плеера //
    let widgetPlayBtn = document.getElementById('widget_play');
    widgetPlayBtn.addEventListener('click', playBtn);

    // кнопка назад //
    let backBtn = document.getElementById('back');
    backBtn.addEventListener('click', backButton);

    // громкость //
    let volumeRange = document.getElementById("widget_volume");
    audioControls.volume = volumeRange;
    volumeRange.addEventListener('input', inputVolume);
    
    // вручную меняем ползунок прогресса //
    let trackLine = document.getElementById('widget_track_line');
    trackLine.addEventListener('input', inputTrackLine);
});

var sec = 0;
var min = 0;

function add() {
    sec += 0.1;
    if (sec >= 60) {
        sec = 0;
        min++;
        if (min >= 99) {
            min = 0;
        }
    }
    changeProgressLine();
    audioControls.timerShow.textContent = (min > 9 ? min : "0" + min) + ":" + (sec > 9 ? Math.ceil(sec) : "0" + Math.ceil(sec));
}


let t;
function stopwatch(value) {
    switch (value) {
        case 'play' :
            t = setInterval(add, 100);
            break;
        case 'pause' :
            clearInterval(t);
            break;
        case 'reset' :
            clearInterval(t);
            audioControls.timerShow.textContent = "00:00";
            sec = 0; min = 0;
            break;
        default:
            console.log('Undefined value');
    }
}

function changeProgressLine() {
    audioControls.trackLine.value = parseFloat(audioControls.trackLine.value) + 10 / audioControls.audio.duration; 
    audioControls.trackPrevLine.style.width = (audioControls.trackLine.value * 5.8) + "px";
}
