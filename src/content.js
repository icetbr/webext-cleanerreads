import style from './style.css';
import { addStyle, $, waitForEl, switchStyle, toggleStyle, h } from '@icetbr/utils/web'

const
    addOptionsMenu = (options, savedOptions) => {
        const { label, input, p, b, div, button, style } = h

        const save = (id) => (e) => {
            options[id][1](e.target.checked)
            savedOptions[id] = e.target.checked
            localStorage.setItem('options', JSON.stringify(savedOptions))
        }

        const $options = div({id: 'optionsMenu', popover: ''})

        for(const id in options) {
            if (id === 'CurrentlyReading') $options.append(p(b("Hide from Home page")))

            $options.append(
                label(input({ type: 'checkbox', id, checked: !!savedOptions[id], onchange: save(id) }), options[id][0])
            )
        }

        const $optionsBtn = button({id: 'optionsBtn', popovertarget: 'optionsMenu'}, '⚙')
        const $style = style(`
            #optionsMenu { border: 1px solid #d7d7db; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,.2); margin-right: 5px; margin-top: 40px; }
            #optionsMenu > * { display: block; }
            #optionsBtn {
                background: none; border: none; padding: 5px; cursor: pointer; /* Reset button styles*/
                position: fixed; top: 5px; right: 5px; z-index: 9999;
                font-size: 26px; opacity: 0.4; transition: opacity 0.2s, transform 0.2s;
            }
            #optionsBtn:hover { opacity: 1; transform: scale(1.1); }
        `)

        const $host = div({id: 'options'});
        const shadow = $host.attachShadow({ mode: 'open' });
        shadow.append($style, $optionsBtn, $options)
        document.body.append($host)
    },

    styleBookPages = () => {
        toggleStyle('coverOnRight', true)

        // 352 pages, Kindle Edition
        const $pagesFormat = $('p[data-testid="pagesFormat"]')
        if ($pagesFormat) $pagesFormat.innerText = $pagesFormat.innerText.replace(/(.*pages).*/, '$1')

        // Expected publication January 19, 2023
        const dateRegex = /.*((January|February|March|April|May|June|July|August|September|October|November|December).*)/
        const $publicationInfo = $('p[data-testid="publicationInfo"]')
        if ($publicationInfo) $publicationInfo.innerText = $publicationInfo.innerText.replace(dateRegex, '$1')

        // 263 people are currently reading
        waitForEl('div[data-testid="currentlyReadingSignal"]').then(el => el.innerText = el.innerText.replace(' people are currently reading', ' reading ·'))

        // 11.4k people want to read
        waitForEl('div[data-testid="toReadSignal"]').then(el => el.innerText = el.innerText.replace(' people', ''))

        // moves authors to the bio section
        waitForEl('.AuthorPreview .ContributorLink').then(el => el.replaceWith($('.ContributorLinksList')))

        // the author is removed by the end of the page load, this realocates the translator that was added in the previous step
        // document.addEventListener('readystatechange', _ => {
        //     if (document.readyState === "complete") {
        //         waitForEl('.AuthorPreview .ContributorLink').then(el => el.replaceWith($('.ContributorLinksList')))
        //     }
        // })
    },

    styleOptionals = async () => {
        const
            /* when loading, the author section is called PageSection, after loading it is .lazyload-wrapper */
            toggleAboutTheAuthorToTheSidebar = isOn => {
                toggleStyle('authorToTheSidebar', isOn)
                waitForEl('.PageSection').then(el =>
                    waitForEl(isOn ? '.BookPage__leftColumn .Sticky .BookActions' : '.SocialSignalsSection ~.Divider').then(p => p.insertAdjacentElement('afterend', el))
                )
                // toggleStyle('authorToTheSidebar', isOn)
                // if (isOn) {
                //     if (document.readyState === "complete") {
                //         // $('.BookPage__leftColumn .Sticky').append($('.AuthorPreview').parentElement)
                //         $('.BookPage__leftColumn .Sticky .BookActions').insertAdjacentElement('afterend', $('.AuthorPreview').parentElement)
                //     } else {
                //         waitForEl('.BookPageMetadataSection .PageSection').then(el => {
                //             $('.BookPage__leftColumn  .Sticky').append(el)
                //         })
                //     }
                // } else {
                //     $('.SocialSignalsSection ~.Divider').insertAdjacentElement('afterend', $('.AuthorPreview').parentElement)
                // }
            },

            toggleReadersEnjoyedSidebar = isOn => {
                toggleStyle('readersEnjoyedToTheSidebar', isOn)
                waitForEl('.BookPage__relatedTopContent').then(el =>
                    isOn
                       ? $('.BookPage__leftColumn .Sticky').append(el)
                       : $('.BookPage__mainContent').insertAdjacentElement('afterend', el))
            },

            options = {
                moveAboutTheAuthorToTheSidebar:         ["Move About the Author to the sidebar",               isOn => toggleAboutTheAuthorToTheSidebar(isOn)],
                moveReadersAlsoEnjoyedToTheSidebar:     ["Move Readers Also Enjoyed to the sidebar",           isOn => toggleReadersEnjoyedSidebar(isOn)],
                showCoverOnTheLeft:                     ["Show cover on the left",                             isOn => switchStyle('coverOnLeft', 'coverOnRight', isOn)],
                removeBookCoverRoundedCorners:          ["Remove book cover rounded corners",                  isOn => toggleStyle('sharpCorners', isOn)],
                makeTextWider:                          ["Make text wider",                                    isOn => toggleStyle('widerText', isOn)],
                GoogleBannerAd:                         ["Hide Google Ads (AdBlock is better)",                isOn => toggleStyle('hide-GoogleBannerAd', isOn)],
                ColoredTopBar:                          ["Hide Colored side banner",                           isOn => toggleStyle('hide-ColoredTopBar', isOn)],
                CurrentlyReading:                       ["Currently Reading",                                  isOn => toggleStyle('hide-CurrentlyReading', isOn)],
                ReadingChallenge:                       ["Reading Challenge",                                  isOn => toggleStyle('hide-ReadingChallenge', isOn)],
                ShelfDisplay:                           ["Want to Read",                                       isOn => toggleStyle('hide-ShelfDisplay', isOn)],
                UserShelvesBookCounts:                  ["Bookshelves",                                        isOn => toggleStyle('hide-UserShelvesBookCounts', isOn)],
                EditorialBlogThumbnail:                 ["News & Interviews",                                  isOn => toggleStyle('hide-EditorialBlogThumbnail', isOn)],
                RecommendationsWidget:                  ["Recommendations",                                    isOn => toggleStyle('hide-RecommendationsWidget', isOn)],
                ChoiceWidget:                           ["Goodreads Choice Awards",                            isOn => toggleStyle('hide-ChoiceWidget', isOn)],
                Footer:                                 ["Company / Work With Us / Connect",                   isOn => toggleStyle('hide-Footer', isOn)],
                SiteAnnouncement:                       ["Site Announcements (top of middle column)",          isOn => toggleStyle('hide-SiteAnnouncement', isOn)],
            },

            savedOptions = JSON.parse(localStorage.getItem('options') || '{}')

        await waitForEl(isHomePage ? '[data-react-class="ReactComponents.UserShelvesBookCounts"]' : '.BookCover__image')

        addOptionsMenu(options, savedOptions)
        for (const i in savedOptions) options[i][1](savedOptions[i])

        // the author is removed by the end of the page load, this reaplies the style
        // document.addEventListener('readystatechange', _ => {
        //     if (document.readyState === "complete") {
        //         if (options.moveAboutTheAuthorToTheSidebar) {
        //             $('.BookPage__leftColumn  .Sticky').append($('.AuthorPreview').parentElement)
        //         }
        //     }
        // })
    },

    isHomePage = location.href === 'https://www.goodreads.com/' || location.href.startsWith('https://www.goodreads.com/?'),
    isBookPage = location.href.includes('/book/show/'),

    init = async () => {
        console.log('[cleanerreads]', 'adding styles')

        addStyle(style)
        if (!isHomePage) toggleStyle('muteTopbar', true)
        if (isBookPage) styleBookPages()
        await styleOptionals()
    }

await waitForEl('body').then(init)
