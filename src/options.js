import { state } from './state.js';

const $ = (selector, parent = document) => parent.querySelector(selector);

const applyFlag = tabs => e => {
    const flag = { [e.target.id]: e.target.checked };
    browser.tabs.sendMessage(tabs[0].id, { command: "applyFlag", flag });
    browser.storage.sync.set(flag);
};

const init = async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const settings = await browser.storage.sync.get();

    Object.keys(state).forEach(setting => {
        $(`#${setting}`).checked = settings[setting];
        $(`#${setting}`).addEventListener('change', applyFlag(tabs));
    });
}

init();
