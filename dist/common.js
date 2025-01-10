/**
 * wait and returns the HTMLElement until it is found.
 *
 * @param {String} selector sizzle selector for querySelector
 * @return {Promise<HTMLElement>}
 */
const waitForElement = async (selector) => {
    return new Promise((resolve) => {
        let observedElement = document.querySelector(selector);
        if (observedElement) return resolve(observedElement);

        let observer = new MutationObserver(() => {
            let observedElement = document.querySelector(selector);
            if (observedElement) {
                observer.disconnect();
                resolve(observedElement);
            }
        });

        observer.observe(document.documentElement, {
            childList: !0,
            subtree: !0,
        });
    });
};

/**
 * quick observe of element
 *
 * @param {Node} element
 * @param {MutationObserverInit | undefined} observerOptions
 * @param {MutationCallback} callback
 */
const observe = (element, observerOptions = {}, callback = () => {}) => {
    const observer = new MutationObserver(callback);
    observer.observe(element, observerOptions);
    return observer;
};

/**
 * awaits for t ms.
 * @param {Number} t sleep time
 * @returns {Promise<null>}
 */
const sleep = (t) => new Promise((r) => setTimeout(r, t));

/**
 * @param {Node} element
 * @param {MutationObserverInit | undefined} observerOptions
 */
const observePromise = (element, observerOptions = {}) =>
    new Promise((res, rej) => {
        const observer = new MutationObserver(res);
        observer.observe(element, observerOptions);
});