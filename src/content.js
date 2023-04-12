import style from './style.css';
import muteTopbar from './muteTopbar.css';
import leftCover from './leftCover.css';
import rightCover from './rightCover.css';
import widerText from './widerText.css';
import { addStyle, $, waitForEl, updateState, updateDom, switchStyle, toggleStyle } from '@icetbr/utils/web';
import { state } from './state.js';

const addCustomStyles = newState => {
    if (updateState(state, newState, 'showCoverOnTheLeft'))            switchStyle({ rightCover, leftCover });
    if (updateState(state, newState, 'removeBookCoverRoundedCorners')) updateDom('.BookCover__image',                                                       el => el.style.borderRadius = newState.removeBookCoverRoundedCorners ? 'unset' : '0 6% 6% 0/4%');
    if (updateState(state, newState, 'makeTextWider'))                 toggleStyle({ widerText });
    if (updateState(state, newState, 'CurrentlyReading'))              updateDom('[data-react-class="ReactComponents.CurrentlyReading"]',                   el => el.parentElement.style.display = newState.CurrentlyReading ? 'none' : 'block');
    if (updateState(state, newState, 'ReadingChallenge'))              updateDom('[data-react-class="ReactComponents.ReadingChallenge"]',                   el => el.parentElement.style.display = newState.ReadingChallenge ? 'none' : 'block');
    if (updateState(state, newState, 'ShelfDisplay'))                  updateDom('[data-react-class="ReactComponents.ShelfDisplay"]',                       el => el.parentElement.style.display = newState.ShelfDisplay ? 'none' : 'block');
    if (updateState(state, newState, 'UserShelvesBookCounts'))         updateDom('[data-react-class="ReactComponents.UserShelvesBookCounts"]',              el => el.parentElement.style.display = newState.UserShelvesBookCounts ? 'none' : 'block');
    if (updateState(state, newState, 'EditorialBlogThumbnail'))        updateDom('[data-react-class="ReactComponents.EditorialBlogThumbnail"]',             el => el.parentElement.style.display = newState.EditorialBlogThumbnail ? 'none' : 'block');
    if (updateState(state, newState, 'RecommendationsWidget'))         updateDom('[data-react-class="ReactComponents.RecommendationsWidget"]',              el => el.parentElement.style.display = newState.RecommendationsWidget ? 'none' : 'block');
    if (updateState(state, newState, 'ChoiceWidget'))                  updateDom('[data-react-class="ReactComponents.ChoiceWidget"]',                       el => el.parentElement.style.display = newState.ChoiceWidget ? 'none' : 'block');
    if (updateState(state, newState, 'GoogleBannerAd'))                updateDom('[data-react-class="ReactComponents.GoogleBannerAd"]',                     el => el.style.display = newState.GoogleBannerAd ? 'none' : 'block');
    if (updateState(state, newState, 'Footer'))                        updateDom('[data-react-class="ReactComponents.Footer"]',                             el => el.style.display = newState.Footer ? 'none' : 'block');
    if (updateState(state, newState, 'SiteAnnouncement'))              updateDom('[data-react-class="ReactComponents.SiteAnnouncement"] .siteAnnouncement', el => el.style.display = newState.SiteAnnouncement ? 'none' : 'block');

    if (updateState(state, newState, 'ColoredTopBar')) {
        const topBar = $('.SiteHeaderBanner__topFullImageContainer') || $('.siteHeader__topFullImageContainer');
        if (topBar) topBar.style.display = newState.ColoredTopBar ? 'none' : 'block';
    }
};

const addBookPageStyles = () => {
    addStyle(rightCover, 'rightCoverStyle');

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
    waitForEl('.AuthorPreview .ContributorLink').then(el => {
        el.replaceWith($('.ContributorLinksList'));
    })
};

var init = async () => {
    browser.runtime.onMessage.addListener(({ flag }) => addCustomStyles(flag));

    console.log('[cleanerreads]', 'adding styles');
    addStyle(style);

    const isHomePage = location.href === 'https://www.goodreads.com/' || location.href.startsWith('https://www.goodreads.com/?');
    if (!isHomePage) addStyle(muteTopbar, 'muteTopbar');

    const isBookPage = location.href.includes('/book/show/');

    const targetElement = isHomePage ? '[data-react-class="ReactComponents.UserShelvesBookCounts"]' : '.BookCover__image';
    waitForEl(targetElement).then(el => {
        browser.storage.sync.get().then(addCustomStyles, console.error);
    });

    if (isBookPage) addBookPageStyles();
};

waitForEl('body').then(init);


