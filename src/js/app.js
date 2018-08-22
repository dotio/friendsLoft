// Oen/close app
const logolink = document.querySelector('.window-link');
const closeApp = document.querySelector('.header__icon');
const mainContainer = document.querySelector('.container__bottom');


closeApp.addEventListener('click', function () {
    mainContainer.className = 'hide';
});

logolink.addEventListener('click', function () {
    if(mainContainer.classList.contains('hide')){
        mainContainer.classList.remove('hide');
    }
});

