function changeClassInput() {
    const input_url = document.getElementById('input');
    if (input_url.classList.contains("input-ok")) {
        input_url.classList.remove("input-ok");
        input_url.classList.add("input-err");
    }
}

function addIconError() {
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

function addStringError() {
    const strError = document.querySelector(".str_error");

    if (strError)
        strError.remove();
    addErrorElement(audioObj);
}

function audioErrorLink(audioObj) {
    audioObj.addEventListener('error', function() {
        changeClassInput(); // меняю стиль ввода
        addIconError(); // добавляю иконку ошибки
        addStringError(); // добавляю подпись с ошибкой
    }, false);
}
