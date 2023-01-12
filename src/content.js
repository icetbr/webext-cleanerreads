import style from './style.css'
import { addStyle, $, waitForEl } from '@icetbr/utils/web';

addStyle(style);

// 352 pages, Kindle Edition
const pagesRegex = /(.*pages).*/;
$('p[data-testid="pagesFormat"]').innerText = $('p[data-testid="pagesFormat"]').innerText.replace(pagesRegex, '$1');

// Expected publication January 19, 2023
const dateRegex = /.*((January|February|March|April|May|June|July|August|September|October|November|December).*)/;
$('p[data-testid="publicationInfo"]').innerText = $('p[data-testid="publicationInfo"]').innerText.replace(dateRegex, '$1');

// 263 people are currently reading
waitForEl('div[data-testid="currentlyReadingSignal"]').then(el => {
    el.innerText = el.innerText.replace(' people are currently reading', ' reading ·');
})

// 11.4k people want to read
waitForEl('div[data-testid="toReadSignal"]').then(el => {
    el.innerText = el.innerText.replace(' people', '');
})
