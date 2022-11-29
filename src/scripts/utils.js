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
