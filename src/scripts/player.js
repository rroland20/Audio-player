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
    let linkAudio = document.getElementById('input');
    let audioObj = new Audio(linkAudio.value);
    
    // если ссылка валидная //
    audioObj.addEventListener('canplay', function() {
        let player = document.getElementById('player');
        let source = document.getElementById('source');
        let widgetPlayer = document.getElementById('widget_player'); 

        // меняем видимость //
        changeDisplay('#main', false);
        changeDisplay('#player', true);
        document.getElementById('input').value = "";

        // добавляю текст источника //
        source.textContent = audioObj.currentSrc;

        // вставка объекта Audio в DOM //
        audioObj.setAttribute('id', "player_window");
        player.insertBefore(audioObj, widgetPlayer);

        // если воспроизведение музыки закончилось //
        audioObj.addEventListener('ended', function() {
            changeDisplay('.rect_pause', false);
            changeDisplay('.rect_pause2', false);
            changeDisplay('.path_play', true);
            audioObj.load();
            stopwatch("reset");
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
    
    // начало загрузки страницы //
    document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded");
    console.log("https://c5.radioboss.fm:18084/stream");
    console.log("https://lalalai.s3.us-west-2.amazonaws.com/media/split/a7564eb8-cbf2-40e2-9cb8-6061d8d055a7/no_vocals");
    
    let submitBtn = document.getElementById('submit');
    submitBtn.addEventListener('click', onSubmit);
    
    // скрытие отображения ошибки при новом вводе //
    let input_url = document.getElementById('input');
    
    input_url.addEventListener('input', function() {
        if (this.classList.contains("input-err")) {
            this.classList.remove("input-err");
            this.classList.add("input-ok");
            let butError = document.querySelector(".but_error");
            let strError = document.querySelector(".str_error");
            butError.remove();
            strError.remove();
        }
    });    

    // реализация плеера //
    let widgetPlayBtn = document.getElementById('widget_play');

    widgetPlayBtn.addEventListener('click', function() { // кнопка play
        let audioObj = document.getElementById("player_window");

        if (audioObj.paused) { // включение аудио
            changeDisplay('.rect_pause', true);
            changeDisplay('.rect_pause2', true);
            changeDisplay('.path_play', false);
            audioObj.play();
            stopwatch("play");
            // console.log(audioObj.duration);
        }
        else { // выключение аудио
            changeDisplay('.rect_pause', false);
            changeDisplay('.rect_pause2', false);
            changeDisplay('.path_play', true);
            audioObj.pause();
            stopwatch("pause");
        }
    });

    // кнопка назад //
    let backBtn = document.getElementById('back');
    
    backBtn.addEventListener('click', function() {
        let audioObj = document.getElementById("player_window");

        audioObj.remove();
        changeDisplay('#main', true);
        changeDisplay('#player', false);
        if (!audioObj.pause()) {
            changeDisplay('.rect_pause', false);
            changeDisplay('.rect_pause2', false);
            changeDisplay('.path_play', true);
            audioObj.pause();
        }
        stopwatch("reset");
        audioObj = null;
        delete audioObj;
    });

    // громкость //
    let volumeRange = document.getElementById("widget_volume");
    
    volumeRange.addEventListener('input', function() {
        let audioObj = document.getElementById("player_window");
        let leftOfThumb = document.getElementById("volume_line");

        audioObj.volume = this.value / 100;
        leftOfThumb.style.width = (volumeRange.value * 2.52) + "px";
    });
    
    // ползунок прогресса //
    let trackLine = document.getElementById('widget_track_line');

    trackLine.addEventListener('input', function() {
        changeProgressLine();
    });
});

var sec = 0;
var min = 0;

function add() {
    let timerShow = document.getElementById('widget_time');
    sec++;
    if (sec >= 60) {
        sec = 0;
        min++;
        if (min >= 99) {
            min = 0;
        }
    }
    changeProgressLine();
    timerShow.textContent = (min > 9 ? min : "0" + min) + ":" + (sec > 9 ? sec : "0" + sec);
}


let t;
function stopwatch(value) {
    switch (value) {
        case 'play' :
            t = setInterval(add, 1000);
            break;
        case 'pause' :
            clearInterval(t);
            break;
        case 'reset' :
            let timerShow = document.getElementById('widget_time');
            clearInterval(t);
            timerShow.textContent = "00:00";
            sec = 0; min = 0;
            break;
        default:
            console.log('Omagad');
    }
}

function changeProgressLine() {
    let audioObj = document.getElementById('player_window');
    // let maxMin = parseInt(audioObj.duration / 60);
    // let maxSec = parseInt(audioObj.duration % 60);
    let leftOfTheThumb = document.getElementById("track_line");
    let trackLine = document.getElementById('widget_track_line');

    trackLine.step = 100 / audioObj.duration;
    let currentSec = audioObj.duration * trackLine.value / 100;
    if (audioObj.play()) {
        trackLine.value++;
        audioObj.currentTime = currentSec;
    } 

    leftOfTheThumb.style.width = (trackLine.value * 5.8) + "px";
    min = parseInt(currentSec / 60);
    sec = parseInt(currentSec % 60);
    
}