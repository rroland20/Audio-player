function check_error(audioObj, callback) {
    audioObj.addEventListener('error', function() {
        flag = true;
        console.log(flag);
        // меняю стиль инпута
        let input_url = document.getElementById('input').id = "input2";
        // добавляю иконку ошибки
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
        
        // добавляю подпись с ошибкой
        let main = document.getElementById('main');
        let strError = document.createElement('output');
        
        strError.classList.add("str_error");
        // console.log(audioObj.error.message);
        if (audioObj.error.message == "MEDIA_ELEMENT_ERROR: Empty src attribute")
        strError.value = "Please enter audio link";
        else if (audioObj.error.message == "MEDIA_ELEMENT_ERROR: Format error")
        strError.value = "Incorrect audio link";
        main.appendChild(strError);
    }, false);
    if (strError)
        callback();
    // a.onload = () => callback();
}

document.getElementById('submit').onclick = function() {
    if (!document.getElementById('input'))
        document.getElementById('input2').id = "input";

    let linkAudio = document.getElementById('input');
    let audioObj = new Audio(linkAudio.value);

    if (document.querySelector(".but_error")) {
        let rm_icon = document.querySelector(".but_error");
        let rm_str = document.querySelector(".str_error");
        rm_icon.remove();
        rm_str.remove();
    }

    var flag = false;
    
    check_error(audioObj, function() {
        console.log(flag);
        if (flag == false) {
            change_display('main');
            change_display('player');
        }
    });

    // delete audioObj;
}

function change_display(id) {
    let elem = document.getElementById(id);

    elem.style.display = (getComputedStyle(elem).display == 'flex') ? 'none' : 'flex';
}