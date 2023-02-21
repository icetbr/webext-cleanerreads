import style from './style.css'
import muteTopbar from './muteTopbar.css'
import { addStyle, $, waitForEl } from '@icetbr/utils/web';

var init = () => {
    const isHomePage = location.href === 'https://www.goodreads.com/' || location.href.startsWith('https://www.goodreads.com/?');
    if (!isHomePage) addStyle(muteTopbar);

    const isBookPage = location.href.includes('/book/show/');
    if (!isBookPage) return;

    // 352 pages, Kindle Edition
    const pagesRegex = /(.*pages).*/;
    const $pagesFormat = $('p[data-testid="pagesFormat"]');

    if ($pagesFormat) $pagesFormat.innerText = $pagesFormat.innerText.replace(pagesRegex, '$1');

    // Expected publication January 19, 2023
    const dateRegex = /.*((January|February|March|April|May|June|July|August|September|October|November|December).*)/;
    const $publicationInfo = $('p[data-testid="publicationInfo"]');

    if ($publicationInfo) $publicationInfo.innerText = $publicationInfo.innerText.replace(dateRegex, '$1');

    // 263 people are currently reading
    waitForEl('div[data-testid="currentlyReadingSignal"]').then(el => {
        el.innerText = el.innerText.replace(' people are currently reading', ' reading ·');
    })

    // 11.4k people want to read
    waitForEl('div[data-testid="toReadSignal"]').then(el => {
        el.innerText = el.innerText.replace(' people', '');
    })

    // moves authors to the bio section
    $('.AuthorPreview .ContributorLink').replaceWith($('.ContributorLinksList'));
};

addStyle(style);
init();
