'use strict';

// init variables
var template = '\n        <li class="friends-list__items" draggable="true" data-id="{{id}}">\n            <div class="left-item">\n                <img class="friend-foto" draggable="false" src="{{photo_100}}">\n                <div class="friendName">\n                    {{first_name}} {{last_name}}\n                </div>\n            </div>\n            <div class="right-item">\n            \n            {{#if selected}}\n            <svg class="icon icon-close data-id="{{id}}">\n                <use xlink:href="./assets/img/sprites/sprite.svg#close"></use>\n            </svg>\n            {{else}}\n            <svg class="icon icon-plus data-id="{{id}}">\n                <use xlink:href="./assets/img/sprites/sprite.svg#plus"></use>\n            </svg>\n            {{/if}}\n           \n            </div>\n        </li>\n';
var friends = [];
var logo = document.querySelector('.window-link');
var closeApp = document.querySelector('.header__icon');
var mainContainer = document.querySelector('.container__bottom');
var saveBtn = document.querySelector('.footer__button');
var friendsListRight = document.querySelector('#friendsListRight');
var friendsListLeft = document.querySelector('#friendsListLeft');
var leftInput = document.querySelector('.left-input');
var rigthInput = document.querySelector('.right-input');
var renderFriends = Handlebars.compile(template);

// **********************************************************************
// Open/close app
// **********************************************************************
closeApp.addEventListener('click', function () {
    mainContainer.className = 'hide';
});

logo.addEventListener('click', function () {
    if (mainContainer.classList.contains('hide')) {
        mainContainer.classList.remove('hide');
    }
});
// **********************************************************************
// VK API
// **********************************************************************
// init api
VK.init({
    apiId: 6671017
});

// authorization
function auth() {
    return new Promise(function (resolve, reject) {
        VK.Auth.login(function (data) {
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
}
// request to server
function callAPI(method, params) {
    params.v = '5.76';

    return new Promise(function (resolve, reject) {
        VK.api(method, params, function (data) {
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.response);
            }
        });
    });
}

if (localStorage.data) {
    friends = JSON.parse(localStorage.data);
    createFriends(friends);
} else {
    auth().then(function () {
        return callAPI('friends.get', { fields: 'photo_100' });
    }).then(function (res) {
        // тут мы получаем массив с друзьями из предыдущего then и он передается в функцию create первым аргументом res
        // res.items - это массив с объектами, который мы получаем из api vk
        // с помощью map добавляем каждому элементу selected
        friends = res.items.map(function (item) {
            return Object.assign(item, { selected: false });
        });
        // friends - json из vk
        createFriends(friends);
    });
}

// **********************************************************************
// Create friends
// **********************************************************************
function createFriends(friends) {

    var friendsHtml1 = '';
    var friendsHtml2 = '';

    friendsListLeft.innerHTML = '';
    friendsListRight.innerHTML = '';

    // в item хранится объект с инфой о каждом друге
    friends.forEach(function (item) {

        var fullName = item.first_name + ' ' + item.last_name;

        if (item.selected == true) {
            if (fullName.toLowerCase().includes(rigthInput.value)) {
                friendsHtml2 += renderFriends(item);
            }
        } else if (fullName.toLowerCase().includes(leftInput.value)) {
            friendsHtml1 += renderFriends(item);
        }
    });

    friendsListLeft.innerHTML = friendsHtml1;
    friendsListRight.innerHTML = friendsHtml2;
}

// **********************************************************************
// Local Storage
// **********************************************************************
// в глобальном объекте localStorage можно сохранить только строку, поэтому с помощью json нужно перевести объект с инфо
saveBtn.addEventListener('click', function () {
    localStorage.data = JSON.stringify(friends);
});

// **********************************************************************
// Filter inputs
// **********************************************************************

rigthInput.addEventListener('input', function () {
    var value = rigthInput.value;


    var filtered = friends.filter(function (item) {

        var fullName = item.first_name + ' ' + item.last_name;

        if (item.selected == false) {

            return item;
        }

        return fullName.toLowerCase().includes(value);
    });
    // filtered - получается массив с объектами отфильтрованных друзей
    createFriends(filtered);
});

leftInput.addEventListener('input', function () {
    var value = leftInput.value;


    var filtered = friends.filter(function (item) {
        var fullName = item.first_name + ' ' + item.last_name;

        if (item.selected == true) {
            return item;
        }

        return fullName.toLowerCase().includes(value);
    });
    createFriends(filtered);
});

// **********************************************************************
// DND
// **********************************************************************

var node = void 0;

document.addEventListener('dragstart', function (e) {
    if (e.target) {
        node = e.target;
    }
});

document.addEventListener('dragover', function (e) {
    if (e.target) {
        e.preventDefault();
    }
});

document.addEventListener('drop', function (e) {

    if (e.target.closest('#friendsListRight') && !e.target.closest('#friendsListLeft')) {
        funcDnD();
    } else if (!e.target.closest('#friendsListLeft')) {
        funcDnD();
    }

    function funcDnD() {
        var id = node.closest('.friends-list__items').dataset.id;

        friends = friends.map(function (item) {
            if (item.id == id) {

                return Object.assign(item, { selected: true });
            }

            return item;
        });
        createFriends(friends);
    }
});

// **********************************************************************
// ADD/REMOVE
// **********************************************************************

document.addEventListener('click', function (e) {
    if (e.target.closest('.icon-plus')) {

        var id = e.target.closest('.friends-list__items').dataset.id;

        // recive dataset
        friends = friends.map(function (item) {
            if (item.id == id) {
                return Object.assign(item, { selected: true });
            }

            return item;
        });

        createFriends(friends);
    }

    if (e.target.closest('.icon-close')) {

        var _id = e.target.closest('.friends-list__items').dataset.id;

        // recive dataset
        friends = friends.map(function (item) {
            if (item.id == _id) {
                return Object.assign(item, { selected: false });
            }

            return item;
        });

        createFriends(friends);
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJ0ZW1wbGF0ZSIsImZyaWVuZHMiLCJsb2dvIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiY2xvc2VBcHAiLCJtYWluQ29udGFpbmVyIiwic2F2ZUJ0biIsImZyaWVuZHNMaXN0UmlnaHQiLCJmcmllbmRzTGlzdExlZnQiLCJsZWZ0SW5wdXQiLCJyaWd0aElucHV0IiwicmVuZGVyRnJpZW5kcyIsIkhhbmRsZWJhcnMiLCJjb21waWxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNsYXNzTmFtZSIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwicmVtb3ZlIiwiVksiLCJpbml0IiwiYXBpSWQiLCJhdXRoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJBdXRoIiwibG9naW4iLCJkYXRhIiwic2Vzc2lvbiIsIkVycm9yIiwiY2FsbEFQSSIsIm1ldGhvZCIsInBhcmFtcyIsInYiLCJhcGkiLCJlcnJvciIsInJlc3BvbnNlIiwibG9jYWxTdG9yYWdlIiwiSlNPTiIsInBhcnNlIiwiY3JlYXRlRnJpZW5kcyIsInRoZW4iLCJmaWVsZHMiLCJyZXMiLCJpdGVtcyIsIm1hcCIsIk9iamVjdCIsImFzc2lnbiIsIml0ZW0iLCJzZWxlY3RlZCIsImZyaWVuZHNIdG1sMSIsImZyaWVuZHNIdG1sMiIsImlubmVySFRNTCIsImZvckVhY2giLCJmdWxsTmFtZSIsImZpcnN0X25hbWUiLCJsYXN0X25hbWUiLCJ0b0xvd2VyQ2FzZSIsImluY2x1ZGVzIiwidmFsdWUiLCJzdHJpbmdpZnkiLCJmaWx0ZXJlZCIsImZpbHRlciIsIm5vZGUiLCJlIiwidGFyZ2V0IiwicHJldmVudERlZmF1bHQiLCJjbG9zZXN0IiwiZnVuY0RuRCIsImlkIiwiZGF0YXNldCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBLElBQUlBLGswQkFBSjtBQXVCQSxJQUFJQyxVQUFVLEVBQWQ7QUFDQSxJQUFNQyxPQUFPQyxTQUFTQyxhQUFULENBQXVCLGNBQXZCLENBQWI7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Q0FBU0UsT0FBVCxDQUFpQixzQkFBakIsRUFBeUNHLE9BQXpDLENBQWlERCxFQUE1RDs7QUFFQTtBQUNBdEUsa0JBQVVBLFFBQVE4QyxHQUFSLENBQVksZ0JBQVE7QUFDMUIsZ0JBQUlHLEtBQUtxQixFQUFMLElBQVdBLEdBQWYsRUFBbUI7QUFDZix1QkFBT3ZCLE9BQU9DLE1BQVAsQ0FBY0MsSUFBZCxFQUFvQixFQUFFQyxVQUFVLEtBQVosRUFBcEIsQ0FBUDtBQUNIOztBQUVELG1CQUFPRCxJQUFQO0FBQ0gsU0FOUyxDQUFWOztBQVFBUixzQkFBY3pDLE9BQWQ7QUFFSDtBQUVKLENBbkNEIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGluaXQgdmFyaWFibGVzXG5sZXQgdGVtcGxhdGUgPSBgXG4gICAgICAgIDxsaSBjbGFzcz1cImZyaWVuZHMtbGlzdF9faXRlbXNcIiBkcmFnZ2FibGU9XCJ0cnVlXCIgZGF0YS1pZD1cInt7aWR9fVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxlZnQtaXRlbVwiPlxuICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJmcmllbmQtZm90b1wiIGRyYWdnYWJsZT1cImZhbHNlXCIgc3JjPVwie3twaG90b18xMDB9fVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmcmllbmROYW1lXCI+XG4gICAgICAgICAgICAgICAgICAgIHt7Zmlyc3RfbmFtZX19IHt7bGFzdF9uYW1lfX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJpZ2h0LWl0ZW1cIj5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAge3sjaWYgc2VsZWN0ZWR9fVxuICAgICAgICAgICAgPHN2ZyBjbGFzcz1cImljb24gaWNvbi1jbG9zZSBkYXRhLWlkPVwie3tpZH19XCI+XG4gICAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPVwiLi9hc3NldHMvaW1nL3Nwcml0ZXMvc3ByaXRlLnN2ZyNjbG9zZVwiPjwvdXNlPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICB7e2Vsc2V9fVxuICAgICAgICAgICAgPHN2ZyBjbGFzcz1cImljb24gaWNvbi1wbHVzIGRhdGEtaWQ9XCJ7e2lkfX1cIj5cbiAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIuL2Fzc2V0cy9pbWcvc3ByaXRlcy9zcHJpdGUuc3ZnI3BsdXNcIj48L3VzZT5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAge3svaWZ9fVxuICAgICAgICAgICBcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2xpPlxuYDtcbmxldCBmcmllbmRzID0gW107XG5jb25zdCBsb2dvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbmRvdy1saW5rJyk7XG5jb25zdCBjbG9zZUFwcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX2ljb24nKTtcbmNvbnN0IG1haW5Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVyX19ib3R0b20nKTtcbmNvbnN0IHNhdmVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9vdGVyX19idXR0b24nKTtcbmNvbnN0IGZyaWVuZHNMaXN0UmlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZnJpZW5kc0xpc3RSaWdodCcpO1xuY29uc3QgZnJpZW5kc0xpc3RMZWZ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ZyaWVuZHNMaXN0TGVmdCcpO1xuY29uc3QgbGVmdElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxlZnQtaW5wdXQnKTtcbmNvbnN0IHJpZ3RoSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmlnaHQtaW5wdXQnKTtcbmNvbnN0IHJlbmRlckZyaWVuZHMgPSBIYW5kbGViYXJzLmNvbXBpbGUodGVtcGxhdGUpO1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBPcGVuL2Nsb3NlIGFwcFxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuY2xvc2VBcHAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgbWFpbkNvbnRhaW5lci5jbGFzc05hbWUgPSAnaGlkZSc7XG59KTtcblxubG9nby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAobWFpbkNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGUnKSkge1xuICAgICAgICBtYWluQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICB9XG59KTtcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFZLIEFQSVxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gaW5pdCBhcGlcblZLLmluaXQoe1xuICAgIGFwaUlkOiA2NjcxMDE3XG59KTtcblxuLy8gYXV0aG9yaXphdGlvblxuZnVuY3Rpb24gYXV0aCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBWSy5BdXRoLmxvZ2luKGRhdGEgPT4ge1xuICAgICAgICAgICAgaWYgKGRhdGEuc2Vzc2lvbikge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcign0J3QtSDRg9C00LDQu9C+0YHRjCDQsNCy0YLQvtGA0LjQt9C+0LLQsNGC0YzRgdGPJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAyKTtcbn0pO1xufVxuLy8gcmVxdWVzdCB0byBzZXJ2ZXJcbmZ1bmN0aW9uIGNhbGxBUEkobWV0aG9kLCBwYXJhbXMpIHtcbiAgICBwYXJhbXMudiA9ICc1Ljc2JztcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIFZLLmFwaShtZXRob2QsIHBhcmFtcywgKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChkYXRhLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGRhdGEuZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRhdGEucmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiAgICBcbmlmIChsb2NhbFN0b3JhZ2UuZGF0YSkge1xuICAgIGZyaWVuZHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5kYXRhKTtcbiAgICBjcmVhdGVGcmllbmRzKGZyaWVuZHMpO1xufSBlbHNlIHtcbiAgICBhdXRoKClcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxBUEkoJ2ZyaWVuZHMuZ2V0JywgeyBmaWVsZHM6ICdwaG90b18xMDAnIH0pO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgLy8g0YLRg9GCINC80Ysg0L/QvtC70YPRh9Cw0LXQvCDQvNCw0YHRgdC40LIg0YEg0LTRgNGD0LfRjNGP0LzQuCDQuNC3INC/0YDQtdC00YvQtNGD0YnQtdCz0L4gdGhlbiDQuCDQvtC9INC/0LXRgNC10LTQsNC10YLRgdGPINCyINGE0YPQvdC60YbQuNGOIGNyZWF0ZSDQv9C10YDQstGL0Lwg0LDRgNCz0YPQvNC10L3RgtC+0LwgcmVzXG4gICAgICAgICAgICAvLyByZXMuaXRlbXMgLSDRjdGC0L4g0LzQsNGB0YHQuNCyINGBINC+0LHRitC10LrRgtCw0LzQuCwg0LrQvtGC0L7RgNGL0Lkg0LzRiyDQv9C+0LvRg9GH0LDQtdC8INC40LcgYXBpIHZrXG4gICAgICAgICAgICAvLyDRgSDQv9C+0LzQvtGJ0YzRjiBtYXAg0LTQvtCx0LDQstC70Y/QtdC8INC60LDQttC00L7QvNGDINGN0LvQtdC80LXQvdGC0YMgc2VsZWN0ZWRcbiAgICAgICAgICAgIGZyaWVuZHMgPSByZXMuaXRlbXMubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKGl0ZW0sIHsgc2VsZWN0ZWQ6IGZhbHNlIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGZyaWVuZHMgLSBqc29uINC40LcgdmtcbiAgICAgICAgICAgIGNyZWF0ZUZyaWVuZHMoZnJpZW5kcyk7XG4gICAgICAgIH0pO1xufVxuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBDcmVhdGUgZnJpZW5kc1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZnVuY3Rpb24gY3JlYXRlRnJpZW5kcyhmcmllbmRzKSB7XG5cbiAgICBsZXQgZnJpZW5kc0h0bWwxID0gJyc7XG4gICAgbGV0IGZyaWVuZHNIdG1sMiA9ICcnO1xuXG4gICAgZnJpZW5kc0xpc3RMZWZ0LmlubmVySFRNTCA9ICcnO1xuICAgIGZyaWVuZHNMaXN0UmlnaHQuaW5uZXJIVE1MID0gJyc7XG4gICAgXG4gICAgLy8g0LIgaXRlbSDRhdGA0LDQvdC40YLRgdGPINC+0LHRitC10LrRgiDRgSDQuNC90YTQvtC5INC+INC60LDQttC00L7QvCDQtNGA0YPQs9C1XG4gICAgZnJpZW5kcy5mb3JFYWNoKGl0ZW0gPT4ge1xuXG4gICAgICAgIGNvbnN0IGZ1bGxOYW1lID0gYCR7aXRlbS5maXJzdF9uYW1lfSAke2l0ZW0ubGFzdF9uYW1lfWA7XG5cbiAgICAgICAgaWYgKGl0ZW0uc2VsZWN0ZWQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKGZ1bGxOYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocmlndGhJbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBmcmllbmRzSHRtbDIgKz0gcmVuZGVyRnJpZW5kcyhpdGVtKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0gZWxzZSBpZiAoZnVsbE5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhsZWZ0SW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBmcmllbmRzSHRtbDEgKz0gcmVuZGVyRnJpZW5kcyhpdGVtKTtcbiAgICAgICAgfVxuICAgIH0pXG5cbiAgICBmcmllbmRzTGlzdExlZnQuaW5uZXJIVE1MID0gZnJpZW5kc0h0bWwxO1xuICAgIGZyaWVuZHNMaXN0UmlnaHQuaW5uZXJIVE1MID0gZnJpZW5kc0h0bWwyO1xufVxuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBMb2NhbCBTdG9yYWdlXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyDQsiDQs9C70L7QsdCw0LvRjNC90L7QvCDQvtCx0YrQtdC60YLQtSBsb2NhbFN0b3JhZ2Ug0LzQvtC20L3QviDRgdC+0YXRgNCw0L3QuNGC0Ywg0YLQvtC70YzQutC+INGB0YLRgNC+0LrRgywg0L/QvtGN0YLQvtC80YMg0YEg0L/QvtC80L7RidGM0Y4ganNvbiDQvdGD0LbQvdC+INC/0LXRgNC10LLQtdGB0YLQuCDQvtCx0YrQtdC60YIg0YEg0LjQvdGE0L5cbnNhdmVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICBsb2NhbFN0b3JhZ2UuZGF0YSA9IEpTT04uc3RyaW5naWZ5KGZyaWVuZHMpO1xufSlcblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gRmlsdGVyIGlucHV0c1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG5yaWd0aElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xuICAgIGNvbnN0IHsgdmFsdWUgfSA9IHJpZ3RoSW5wdXQ7XG5cbiAgICBjb25zdCBmaWx0ZXJlZCA9IGZyaWVuZHMuZmlsdGVyKGl0ZW0gPT4ge1xuXG4gICAgICAgIGNvbnN0IGZ1bGxOYW1lID0gYCR7aXRlbS5maXJzdF9uYW1lfSAke2l0ZW0ubGFzdF9uYW1lfWA7XG5cbiAgICAgICAgICAgIGlmIChpdGVtLnNlbGVjdGVkID09IGZhbHNlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bGxOYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModmFsdWUpO1xuICAgICAgICBcbiAgICB9KTtcbiAgICAvLyBmaWx0ZXJlZCAtINC/0L7Qu9GD0YfQsNC10YLRgdGPINC80LDRgdGB0LjQsiDRgSDQvtCx0YrQtdC60YLQsNC80Lgg0L7RgtGE0LjQu9GM0YLRgNC+0LLQsNC90L3Ri9GFINC00YDRg9C30LXQuVxuICAgIGNyZWF0ZUZyaWVuZHMoZmlsdGVyZWQpO1xufSlcblxuXG5sZWZ0SW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XG4gICAgY29uc3QgeyB2YWx1ZSB9ID0gbGVmdElucHV0O1xuXG4gICAgY29uc3QgZmlsdGVyZWQgPSBmcmllbmRzLmZpbHRlcihpdGVtID0+IHtcbiAgICAgICAgY29uc3QgZnVsbE5hbWUgPSBgJHtpdGVtLmZpcnN0X25hbWV9ICR7aXRlbS5sYXN0X25hbWV9YDtcblxuICAgICAgICBpZiAoaXRlbS5zZWxlY3RlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlbVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bGxOYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModmFsdWUpO1xuICAgIH0pXG4gICAgY3JlYXRlRnJpZW5kcyhmaWx0ZXJlZCk7XG59KVxuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBETkRcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxubGV0IG5vZGU7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIChlKSA9PiB7XG4gICAgaWYgKGUudGFyZ2V0KSB7XG4gICAgICAgIG5vZGUgPSBlLnRhcmdldDtcbiAgICB9XG59KTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCAoZSkgPT4ge1xuICAgIGlmIChlLnRhcmdldCkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCAoZSkgPT4ge1xuICAgIFxuICAgIGlmIChlLnRhcmdldC5jbG9zZXN0KCcjZnJpZW5kc0xpc3RSaWdodCcpICYmICFlLnRhcmdldC5jbG9zZXN0KCcjZnJpZW5kc0xpc3RMZWZ0JykpIHtcbiAgICAgICAgZnVuY0RuRCgpO1xuICAgIH0gZWxzZSBpZiAoIWUudGFyZ2V0LmNsb3Nlc3QoJyNmcmllbmRzTGlzdExlZnQnKSkge1xuICAgICAgICBmdW5jRG5EKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZnVuY0RuRCAoKSB7XG4gICAgICAgIGNvbnN0IGlkID0gbm9kZS5jbG9zZXN0KCcuZnJpZW5kcy1saXN0X19pdGVtcycpLmRhdGFzZXQuaWQ7XG5cbiAgICAgICAgZnJpZW5kcyA9IGZyaWVuZHMubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT0gaWQpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKGl0ZW0sIHsgc2VsZWN0ZWQ6IHRydWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH0pXG4gICAgICAgIGNyZWF0ZUZyaWVuZHMoZnJpZW5kcyk7XG4gICAgfVxufSk7XG5cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIEFERC9SRU1PVkVcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy5pY29uLXBsdXMnKSkge1xuXG4gICAgICAgIGNvbnN0IGlkID0gZS50YXJnZXQuY2xvc2VzdCgnLmZyaWVuZHMtbGlzdF9faXRlbXMnKS5kYXRhc2V0LmlkO1xuXG4gICAgICAgIC8vIHJlY2l2ZSBkYXRhc2V0XG4gICAgICAgIGZyaWVuZHMgPSBmcmllbmRzLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oaXRlbSwgeyBzZWxlY3RlZDogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH0pXG5cbiAgICAgICAgY3JlYXRlRnJpZW5kcyhmcmllbmRzKTtcblxuICAgIH1cblxuICAgIGlmIChlLnRhcmdldC5jbG9zZXN0KCcuaWNvbi1jbG9zZScpKSB7XG5cbiAgICAgICAgY29uc3QgaWQgPSBlLnRhcmdldC5jbG9zZXN0KCcuZnJpZW5kcy1saXN0X19pdGVtcycpLmRhdGFzZXQuaWQ7XG5cbiAgICAgICAgLy8gcmVjaXZlIGRhdGFzZXRcbiAgICAgICAgZnJpZW5kcyA9IGZyaWVuZHMubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihpdGVtLCB7IHNlbGVjdGVkOiBmYWxzZSB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH0pXG5cbiAgICAgICAgY3JlYXRlRnJpZW5kcyhmcmllbmRzKTtcblxuICAgIH1cbiAgICBcbn0pO1xuIl19
