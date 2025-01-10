(async()=>{
    const main = await waitForElement(`#tv-content`);
    observe(document.body, {"subtree": true, "childList": true}, async()=>{
        const recommendation = await waitForElement(`#js-category-content > div.js-symbol-page-tab-overview-root > div > section > div:nth-child(11):has(.block-XuCV1LDg)`);
        recommendation.id = "f31cn1234nadklfmaxc90123xzc";
        let a = document.createElement("a");
        a.href = `#f31cn1234nadklfmaxc90123xzc`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    });


})();