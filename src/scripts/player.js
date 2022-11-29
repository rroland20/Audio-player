function onSubmit() {
    // создание объекта Audio //
    const linkAudio = document.getElementById('input');
    let audioObj = new Audio(linkAudio.value);

    audioObj.volume = "0.4"; // установка громкости по умолчанию
    audioCanPlayLink(audioObj, linkAudio); // если ссылка валидная
    audioErrorLink(audioObj); // если произошла ошибка
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
