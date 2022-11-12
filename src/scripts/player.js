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

        // реализация плеера //
        audioObj.setAttribute('id', "player_window");
        player.insertBefore(audioObj, widgetPlayer);

        // если воспроизведение музыки закончилось //
        audioObj.addEventListener('ended', function() {
            changeDisplay('.rect_pause', false);
            changeDisplay('.rect_pause2', false);
            changeDisplay('.path_play', true);
            audioObj.load();
        })
    })

    audioObj.addEventListener('error', function() {
        // меняю стиль инпута //
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

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded");
    console.log("https://c5.radioboss.fm:18084/stream");
    console.log("https://lalalai.s3.us-west-2.amazonaws.com/media/split/a7564eb8-cbf2-40e2-9cb8-6061d8d055a7/no_vocals");

    let submitBtn = document.getElementById('submit');
    submitBtn.addEventListener('click', onSubmit);
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

    let widgetPlayBtn = document.getElementById('widget_play');

    widgetPlayBtn.addEventListener('click', function() { // кнопка play
        let timerShow = document.getElementById('widget_time');
        let audioObj = document.getElementById("player_window");
        let timeMinut = (audioObj.duration / 60).toFixed(2);
        if (audioObj.paused) { // включение аудио
            changeDisplay('.rect_pause', true);
            changeDisplay('.rect_pause2', true);
            changeDisplay('.path_play', false);
            audioObj.play();
            console.log(audioObj.duration);
            console.log(audioObj);
        }
        else { // выключение аудио
            changeDisplay('.rect_pause', false);
            changeDisplay('.rect_pause2', false);
            changeDisplay('.path_play', true);
            audioObj.pause();
        }
    });
    let backBtn = document.getElementById('back');

    // кнопка назад //
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
        audioObj = null;
        delete audioObj;

    });
});