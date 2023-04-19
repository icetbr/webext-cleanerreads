import style from './style.css';
import muteTopbar from './muteTopbar.css';
import leftCover from './leftCover.css';
import rightCover from './rightCover.css';
import widerText from './widerText.css';
import authorSidebar from './authorSidebar.css';
import readersEnjoyedSidebar from './readersEnjoyedSidebar.css';
import { addStyle, $, waitForEl, updateState, updateDom, switchStyle, toggleStyle } from '@icetbr/utils/web';
import { state } from './state.js';

/* when loading, the author section is called PageSection, after loading it is .lazyload-wrapper */
const toggleAboutTheAuthorToTheSidebar = () => {
    toggleStyle({ authorSidebar });
    if (state.moveAboutTheAuthorToTheSidebar) {
        if (state.hasPageLoaded) {
            $('.BookPage__leftColumn .Sticky').append($('.AuthorPreview').parentElement);
        } else {
            waitForEl('.BookPageMetadataSection .PageSection').then(el => {
                $('.BookPage__leftColumn  .Sticky').append(el);
            })
        }
    } else {
        $('.SocialSignalsSection ~.Divider').insertAdjacentElement("afterEnd", $('.AuthorPreview').parentElement);
    }
};

const toggleReadersEnjoyedSidebar = () => {
    toggleStyle({ readersEnjoyedSidebar });
    if (state.moveReadersAlsoEnjoyedToTheSidebar) {
        waitForEl('.BookPage__relatedTopContent .DynamicCarousel').then(el => {
            $('.BookPage__leftColumn  .Sticky').append($('.BookPage__relatedTopContent'));
        })
    } else {
        $('.BookPage__mainContent').insertAdjacentElement("afterEnd", $('.BookPage__relatedTopContent'));
    }
};

const addCustomStyles = newState => {
    // the author is removed by the end of the page load, this reaplies the style
    document.addEventListener('readystatechange', event => {
        if (event.target.readyState === "complete") {
            if (state.moveAboutTheAuthorToTheSidebar) {
                $('.BookPage__leftColumn  .Sticky').append($('.AuthorPreview').parentElement);
            }
        }
    });

    if (updateState(state, newState, 'showCoverOnTheLeft'))                 switchStyle({ rightCover, leftCover });
    if (updateState(state, newState, 'removeBookCoverRoundedCorners'))      toggleStyle({ sharpCorners: '.BookCover__image { border-radius: unset }' });
    if (updateState(state, newState, 'makeTextWider'))                      toggleStyle({ widerText });
    if (updateState(state, newState, 'moveAboutTheAuthorToTheSidebar'))     toggleAboutTheAuthorToTheSidebar();
    if (updateState(state, newState, 'moveReadersAlsoEnjoyedToTheSidebar')) toggleReadersEnjoyedSidebar();
    if (updateState(state, newState, 'CurrentlyReading'))                   updateDom('[data-react-class="ReactComponents.CurrentlyReading"]',                   el => el.parentElement.style.display = newState.CurrentlyReading ? 'none' : 'block');
    if (updateState(state, newState, 'ReadingChallenge'))                   updateDom('[data-react-class="ReactComponents.ReadingChallenge"]',                   el => el.parentElement.style.display = newState.ReadingChallenge ? 'none' : 'block');
    if (updateState(state, newState, 'ShelfDisplay'))                       updateDom('[data-react-class="ReactComponents.ShelfDisplay"]',                       el => el.parentElement.style.display = newState.ShelfDisplay ? 'none' : 'block');
    if (updateState(state, newState, 'UserShelvesBookCounts'))              updateDom('[data-react-class="ReactComponents.UserShelvesBookCounts"]',              el => el.parentElement.style.display = newState.UserShelvesBookCounts ? 'none' : 'block');
    if (updateState(state, newState, 'EditorialBlogThumbnail'))             updateDom('[data-react-class="ReactComponents.EditorialBlogThumbnail"]',             el => el.parentElement.style.display = newState.EditorialBlogThumbnail ? 'none' : 'block');
    if (updateState(state, newState, 'RecommendationsWidget'))              updateDom('[data-react-class="ReactComponents.RecommendationsWidget"]',              el => el.parentElement.style.display = newState.RecommendationsWidget ? 'none' : 'block');
    if (updateState(state, newState, 'ChoiceWidget'))                       updateDom('[data-react-class="ReactComponents.ChoiceWidget"]',                       el => el.parentElement.style.display = newState.ChoiceWidget ? 'none' : 'block');
    if (updateState(state, newState, 'GoogleBannerAd'))                     updateDom('[data-react-class="ReactComponents.GoogleBannerAd"]',                     el => el.style.display = newState.GoogleBannerAd ? 'none' : 'block');
    if (updateState(state, newState, 'Footer'))                             updateDom('[data-react-class="ReactComponents.Footer"]',                             el => el.style.display = newState.Footer ? 'none' : 'block');
    if (updateState(state, newState, 'SiteAnnouncement'))                   updateDom('[data-react-class="ReactComponents.SiteAnnouncement"] .siteAnnouncement', el => el.style.display = newState.SiteAnnouncement ? 'none' : 'block');

    if (updateState(state, newState, 'ColoredTopBar')) {
        const topBar = $('.SiteHeaderBanner__topFullImageContainer') || $('.siteHeader__topFullImageContainer');
        if (topBar) topBar.style.display = newState.ColoredTopBar ? 'none' : 'block';
    }
};

const addBookPageStyles = () => {
    addStyle(rightCover, 'rightCoverStyle'); // DDV

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
    let contributors;
    waitForEl('.AuthorPreview .ContributorLink').then(el => {
        contributors = $('.ContributorLinksList');
        el.replaceWith(contributors);
    })

    // the author is removed by the end of the page load, this realocates the translator that was added in the previous step
    document.addEventListener('readystatechange', event => {
        if (event.target.readyState === "complete") {
            state.hasPageLoaded = true;
            $('.AuthorPreview .ContributorLink').replaceWith(contributors);
        }
    });
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


