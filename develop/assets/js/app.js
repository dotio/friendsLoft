'use strict';

// Oen/close app
var logolink = document.querySelector('.window-link');
var closeApp = document.querySelector('.header__icon');
var mainContainer = document.querySelector('.container__bottom');

closeApp.addEventListener('click', function () {
    mainContainer.className = 'hide';
});

logolink.addEventListener('click', function () {
    if (mainContainer.classList.contains('hide')) {
        mainContainer.classList.remove('hide');
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJsb2dvbGluayIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImNsb3NlQXBwIiwibWFpbkNvbnRhaW5lciIsImFkZEV2ZW50TGlzdGVuZXIiLCJjbGFzc05hbWUiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsInJlbW92ZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBLElBQU1BLFdBQVdDLFNBQVNDLGFBQVQsQ0FBdUIsY0FBdkIsQ0FBakI7QUFDQSxJQUFNQyxXQUFXRixTQUFTQyxhQUFULENBQXVCLGVBQXZCLENBQWpCO0FBQ0EsSUFBTUUsZ0JBQWdCSCxTQUFTQyxhQUFULENBQXVCLG9CQUF2QixDQUF0Qjs7QUFHQUMsU0FBU0UsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsWUFBWTtBQUMzQ0Qsa0JBQWNFLFNBQWQsR0FBMEIsTUFBMUI7QUFDSCxDQUZEOztBQUlBTixTQUFTSyxnQkFBVCxDQUEwQixPQUExQixFQUFtQyxZQUFZO0FBQzNDLFFBQUdELGNBQWNHLFNBQWQsQ0FBd0JDLFFBQXhCLENBQWlDLE1BQWpDLENBQUgsRUFBNEM7QUFDeENKLHNCQUFjRyxTQUFkLENBQXdCRSxNQUF4QixDQUErQixNQUEvQjtBQUNIO0FBQ0osQ0FKRCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBPZW4vY2xvc2UgYXBwXG5jb25zdCBsb2dvbGluayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3ctbGluaycpO1xuY29uc3QgY2xvc2VBcHAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19pY29uJyk7XG5jb25zdCBtYWluQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhaW5lcl9fYm90dG9tJyk7XG5cblxuY2xvc2VBcHAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgbWFpbkNvbnRhaW5lci5jbGFzc05hbWUgPSAnaGlkZSc7XG59KTtcblxubG9nb2xpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYobWFpbkNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSl7XG4gICAgICAgIG1haW5Db250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgIH1cbn0pO1xuXG4iXX0=