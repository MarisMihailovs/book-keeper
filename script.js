const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEL = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// show modal, focus on input

function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// validate form 
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('Please submit values for both fields');
        return false;
    }
    if (!urlValue.match(regex)) {
        alert('Please provide a valid web address');
        return false;
    }
    return true;
}

// build bookmarks dom
function buildBookmarks() {
    // remove all bookmarks
    bookmarksContainer.textContent = '';
    bookmarks.forEach((bookmark) => {

        const { name, url } = bookmark;
        // item 
        const item = document.createElement('div');
        item.classList.add('item');
        const closeDiv = document.createElement('div');
        closeDiv.classList.add('delete');
        const closeIcon = document.createElement('span');
        closeIcon.classList.add('material-symbols-outlined');
        closeIcon.textContent = "delete";
        closeIcon.setAttribute('title', 'Delete bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        //favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'favicon');
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;

        linkInfo.append(favicon, link);
        closeDiv.append(closeIcon)
        item.append(closeDiv, linkInfo);
        bookmarksContainer.prepend(item);
    });
}


// fetch bookmarks from localstorage

function fetchBookmarks() {
    // get bookmarks from LocalStorage if available
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // create bookmarks array in localStorage
        bookmarks = [
            {
                name: 'google',
                url: 'https://www.google.com',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// delete

function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });
    // update bookmarks array in localStorage, repopulate dom
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}


// handle data from form

function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEL.value;
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
        urlValue = `https://${urlValue}`;
    }

    if (!validate(nameValue, urlValue)) {
        return false;
    };

    const bookmark = {
        name: nameValue,
        url: urlValue,
    };

    bookmarks.push(bookmark);

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();

}

// modal event listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false))
bookmarkForm.addEventListener('submit', storeBookmark);


// onload
fetchBookmarks();