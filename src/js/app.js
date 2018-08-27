// init variables
let template = `
        <li class="friends-list__items" draggable="true" data-id="{{id}}">
            <div class="left-item">
                <img class="friend-foto" draggable="false" src="{{photo_100}}">
                <div class="friendName">
                    {{first_name}} {{last_name}}
                </div>
            </div>
            <div class="right-item">
            
            {{#if selected}}
            <svg class="icon icon-close data-id="{{id}}">
                <use xlink:href="./assets/img/sprites/sprite.svg#close"></use>
            </svg>
            {{else}}
            <svg class="icon icon-plus data-id="{{id}}">
                <use xlink:href="./assets/img/sprites/sprite.svg#plus"></use>
            </svg>
            {{/if}}
           
            </div>
        </li>
`;
let friends = [];
const logo = document.querySelector('.window-link');
const closeApp = document.querySelector('.header__icon');
const mainContainer = document.querySelector('.container__bottom');
const saveBtn = document.querySelector('.footer__button');
const friendsListRight = document.querySelector('#friendsListRight');
const friendsListLeft = document.querySelector('#friendsListLeft');
const leftInput = document.querySelector('.left-input');
const rigthInput = document.querySelector('.right-input');
const renderFriends = Handlebars.compile(template);

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
    return new Promise((resolve, reject) => {
        VK.Auth.login(data => {
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

    return new Promise((resolve, reject) => {
        VK.api(method, params, (data) => {
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
    auth()
        .then(() => {
            return callAPI('friends.get', { fields: 'photo_100' });
        })
        .then(res => {
            friends = res.items.map(item => {
                return Object.assign(item, { selected: false })
            });
            // friends - json from vk
            createFriends(friends);
        });
}

// **********************************************************************
// Create friends
// **********************************************************************
function createFriends(friends) {

    let friendsHtml1 = '';
    let friendsHtml2 = '';

    friendsListLeft.innerHTML = '';
    friendsListRight.innerHTML = '';
    
    friends.forEach(item => {

        const fullName = `${item.first_name} ${item.last_name}`;

        if (item.selected == true) {
            if (fullName.toLowerCase().includes(rigthInput.value)) {
                friendsHtml2 += renderFriends(item);
            } 
        } else if (fullName.toLowerCase().includes(leftInput.value)) {
            friendsHtml1 += renderFriends(item);
        }
    })

    friendsListLeft.innerHTML = friendsHtml1;
    friendsListRight.innerHTML = friendsHtml2;
}

// **********************************************************************
// Local Storage
// **********************************************************************

saveBtn.addEventListener('click', function() {
    localStorage.data = JSON.stringify(friends);
})

// **********************************************************************
// Filter inputs
// **********************************************************************

rigthInput.addEventListener('input', () => {
    const { value } = rigthInput;

    const filtered = friends.filter(item => {

        const fullName = `${item.first_name} ${item.last_name}`;

        if (item.selected == false) {

            return item;
        }

        return fullName.toLowerCase().includes(value);
        
    });

    createFriends(filtered);
})

leftInput.addEventListener('input', () => {
    const { value } = leftInput;

    const filtered = friends.filter(item => {

        const fullName = `${item.first_name} ${item.last_name}`;

        if (item.selected == true) {

            return item
        }

        return fullName.toLowerCase().includes(value);
    })

    createFriends(filtered);
})

// **********************************************************************
// DND
// **********************************************************************

let node;

document.addEventListener('dragstart', (e) => {
    if (e.target) {
        node = e.target;
    }
});

document.addEventListener('dragover', (e) => {
    if (e.target) {
        e.preventDefault();
    }
});

document.addEventListener('drop', (e) => {
    
    if (e.target.closest('#friendsListRight') && !e.target.closest('#friendsListLeft')) {
        funcDnD();
    } else if (!e.target.closest('#friendsListLeft')) {
        funcDnD();
    }

    function funcDnD () {
        const id = node.closest('.friends-list__items').dataset.id;

        friends = friends.map(item => {
            if (item.id == id) {

                return Object.assign(item, { selected: true });
            }
        
            return item;
        })
        createFriends(friends);
    }
});

// **********************************************************************
// ADD/REMOVE
// **********************************************************************
document.addEventListener('click', function(e) {
    if (e.target.closest('.icon-plus')) {

        const id = e.target.closest('.friends-list__items').dataset.id;

        // recive dataset
        friends = friends.map(item => {
            if (item.id == id) {
                return Object.assign(item, { selected: true });
            }

            return item;
        })

        createFriends(friends);

    }

    if (e.target.closest('.icon-close')) {

        const id = e.target.closest('.friends-list__items').dataset.id;

        // recive dataset
        friends = friends.map(item => {
            if (item.id == id) {
                return Object.assign(item, { selected: false });
            }

            return item;
        })

        createFriends(friends);

    }
    
});
