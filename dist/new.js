/**
 * @returns {Promise<{"krw": Number, "usd": Number}>}
 */
const getMyMoney = () => fetch("https://wts-api.tossinvest.com/api/v3/my-assets/transactions/markets/us/overview", {
    "headers": {
      "accept": "application/json",
    },
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  }).then(resp=>resp.json()).then(data=>data.result.orderableAmount);

/**
 * @returns { Promise<MyInvestType> }
 */
const getMyInvest = () => fetch("https://wts-cert-api.tossinvest.com/api/v1/dashboard/asset/sections/all", {
    "headers": {
      "accept": "application/json",
      "accept-language": "ko,en;q=0.9,en-US;q=0.8,ja;q=0.7",
      "content-type": "application/json",
      "x-xsrf-token": Object.fromEntries(document.cookie.split("; ").map(el=>el.split("=")))["XSRF-TOKEN"]
    },
    "body": "{\"types\":[\"OVERVIEW\"]}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
}).then(resp=>resp.json());

/**
 * @returns { Promise<CurrencyChangeResponse> }
 */
const getCurrencyChangeRecords = () => fetch("https://wts-api.tossinvest.com/api/v3/my-assets/transactions/markets/us?size=100&filters=8", {
    "headers": {
      "accept": "application/json",
      "accept-language": "ko,en;q=0.9,en-US;q=0.8,ja;q=0.7",
    },
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  }).then(resp=>resp.json());

/**
 *
 * @param { CompositeKey } compositeKey
 * @returns { Promise<CurrencyChangeDetailTransaction> }
 */
const getCurrencyChangeDetail = (compositeKey) => fetch(`https://wts-cert-api.tossinvest.com/api/v2/my-assets/transactions/markets/us/settled/exchange/${compositeKey.date}-${compositeKey.no}`, {
    "headers": {
      "accept": "application/json",
      "accept-language": "ko,en;q=0.9,en-US;q=0.8,ja;q=0.7",
    },
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  }).then(resp=>resp.json()).then(resp=>resp.result.transaction);

/** @returns { Promise<Number> } */
const getAvgDollarPrice = async () => {
    const currencyRecords = (await getCurrencyChangeRecords().then(resp=>resp.result.body)).reverse();
    /** @type { CurrencyChangeDetailTransaction[] } */
    const currencyDetails = await Promise.all(currencyRecords.map(el=>getCurrencyChangeDetail(el.compositeKey)));
    console.log(currencyDetails);
    const result = currencyDetails.reduce((acc, cur)=>{
        if (cur.exchange.withdrawalAmount.currencyCode == "KRW") {
            acc.avgPrice = (acc.avgPrice * acc.dollarAmount + Math.abs(cur.exchange.withdrawalAmount.amonut)) / (acc.dollarAmount - cur.exchange.depositAmount.amount);
            acc.dollarAmount += cur.exchange.depositAmount.amount;
        }
        else {
            acc.avgPrice = ((acc.avgPrice * acc.dollarAmount) - Math.abs(czur.exchange.depositAmount.amount)) / (acc.dollarAmount + cur.exchange.withdrawalAmount.amount);
            acc.dollarAmount += cur.exchange.withdrawalAmount.amount;
        }
        console.log(acc, `w: ${cur.exchange.withdrawalAmount.amount} (${cur.exchange.depositAmount.currencyCode})`, `d: ${cur.exchange.depositAmount.amount} (${cur.exchange.depositAmount.currencyCode})`);
        return acc;
    }, {avgPrice: 0, dollarAmount: 0}).avgPrice;
    // 평균환율 오류나고 있음.
    return result;
}

/**
 * @argument { ?String } stockCode
 * @returns { Promise<CandleTick> }
 */
const getLastTradeTick = (stockCode=null) => {
    if (stockCode === null) stockCode = location.pathname.split("/").at(2);
    return fetch(`https://wts-info-api.tossinvest.com/api/v1/stock-prices/${stockCode}/ticks?count=1&session=1`, {
        "headers": {
          "accept": "application/json",
          "accept-language": "ko,en;q=0.9,en-US;q=0.8,ja;q=0.7",
        },
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then(resp=>resp.json()).then(({result})=>result[0]);
}

/**
 * Checks if the current time in KST falls within the US stock market aftermarket hours,
 * considering daylight saving time (DST).
 * @returns {boolean} - True if the current time is within aftermarket hours, false otherwise.
 */
function isAftermarketOpen() {
    // Get the current date in UTC
    const nowUTC = new Date();

    // Calculate the current year
    const year = nowUTC.getUTCFullYear();

    // Define DST start and end dates for the given year
    const dstStart = new Date(Date.UTC(year, 2, 8)); // March 8th in UTC
    const dstEnd = new Date(Date.UTC(year, 10, 1)); // November 1st in UTC

    // Adjust to the second Sunday of March
    dstStart.setUTCDate(8 + (7 - dstStart.getUTCDay()) % 7);
    // Adjust to the first Sunday of November
    dstEnd.setUTCDate(1 + (7 - dstEnd.getUTCDay()) % 7);

    // Check if the current date is within DST period
    const isDST = nowUTC >= dstStart && nowUTC < dstEnd;

    // Define aftermarket hours in KST
    const aftermarketStart = isDST ? 5 * 60 : 6 * 60; // 05:00 or 06:00 in minutes
    const aftermarketEnd = isDST ? 17 * 60 : 18 * 60;   // 07:00 or 08:00 in minutes

    // Get the current time in KST
    const nowKST = new Date(Date.now()); // UTC + 9 hours
    const hours = nowKST.getHours();
    const minutes = nowKST.getMinutes();

    // Current time in minutes
    const currentTime = hours * 60 + minutes;

    // Check if the current time is within aftermarket hours
    return currentTime >= aftermarketStart && currentTime < aftermarketEnd;
}

/**
 * Checks if the given date is a weekend (Saturday or Sunday) in the US market.
 * @param {Date} [date=new Date()] - The date to check (defaults to the current date).
 * @returns {boolean} - True if the date is a weekend, false otherwise.
 */
function isUSMarketWeekend(date = new Date()) {
    // Get the day of the week (0: Sunday, 6: Saturday)
    const dayOfWeek = date.getUTCDay(); // Use UTC to avoid timezone issues
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday (0) or Saturday (6)
}

// Example usage
console.log(isUSMarketWeekend()); // true or false, depending on the current day



const numberFormat = new Intl.NumberFormat("ko-KR");
(async()=>{
    // MARK: 주문가능금액
    const span = await waitForElement(`a[data-contents-label="내 투자"] > div > div`);
    while(true) {
        await sleep(1000);
        const myMoney = await getMyMoney();
        span.innerHTML = `<small>주문 가능 금액:</small> <div>${numberFormat.format(myMoney.krw)}원 ($${numberFormat.format(myMoney.usd)})</div>`
    }
})();


(async()=>{
    // MARK: 내 투자
    const stockHorizontalBox = document.createElement("div");
    stockHorizontalBox.id = "horizontal-stockbox";
    stockHorizontalBox.innerHTML = `
        <div style="display: flex; justify-content: space-between;">
            <h4>내 투자</h4>
            <div style="display: flex; gap: .5rem;">
                <select id="sorting-method" class="tw-1wkoka59 form-control">
                    <option value="1">수익금 높은 순</option>
                    <option value="-1">수익금 낮은 순</option>
                    <option value="2">총 수익률 높은 순</option>
                    <option value="-2">총 수익률 낮은 순</option>
                    <option value="3">일간 수익률 높은 순</option>
                    <option value="-3">일간 수익률 낮은 순</option>
                    <option value="4">평가금액 높은 순</option>
                    <option value="-4">평가금액 낮은 순</option>
                    <option value="5">1주당수익금 큰 순</option>
                    <option value="-5">1주당수익금 작은 순</option>
                </select>
                <label style="display:flex; gap: .1rem; align-items: center;"><input type="checkbox" id="show-two-row"/><span> 두줄보기</span></label>
            </div>
        </div>
        <div id='profit-contents'></div>
        <ul id='stock-items'></ul>
    `;
    const twoRowCheckbox = stockHorizontalBox.querySelector(`input#show-two-row`);
    twoRowCheckbox.checked = localStorage.getItem("show-two-row") == 'true';
    twoRowCheckbox.addEventListener("input", e=>{localStorage.setItem("show-two-row", e.target.checked)});
    const sortingSelect = stockHorizontalBox.querySelector(`select#sorting-method`);
    sortingSelect.value = localStorage.getItem("sort-method") ?? 1;
    sortingSelect.addEventListener("input", e=>localStorage.setItem("sort-method", sortingSelect.value));
    let horizontalBtns = await waitForElement(`#__next > div > div.ho2myi1 > main > div > div > div > div.njzdl30 > div > div.njzdl36`);
    horizontalBtns.insertAdjacentElement("beforebegin", stockHorizontalBox);
    /**
     * @param { StockItem } a
     * @param { StockItem } b
     * @returns { Number }
     */
    const sortFunction = (a, b) => {
        const flag = sortingSelect.value / Math.abs(sortingSelect.value);
        if (Math.abs(sortingSelect.value) == 5) {
            return flag * ((b.currentPrice.usd - b.purchasePrice.usd) - (a.currentPrice.usd - a.purchasePrice.usd));
        }
        const sortingColumn = {
            1: "profitLossAmount", // 총수익금
            2: "profitLossRate", // 총수익률
            3: "dailyProfitLossRate", // 일간 수익률
            4: "evaluatedAmount", // 평가금액
        }[Math.abs(sortingSelect.value)];
        return flag * ((b[sortingColumn]?.usd ?? b[sortingColumn]) - (a[sortingColumn]?.usd ?? a[sortingColumn]));
    }

    (async()=>{
        while(true) {
            await sleep(100);
            const myInvests = await getMyInvest().then(resp=>resp.result.sections[0].data);
            let profitElement = `
                <ul style="--tds-desktop-foreground-color: var(--adaptiveGrey800); font-size: 0.7rem">
                    <li><span>총 투자:</span> <span>${numberFormat.format(myInvests.principalAmount.krw.toFixed(2))}원 ($${numberFormat.format(myInvests.principalAmount.usd)})</span></li>
                    <li><span>평가금:</span><span>${numberFormat.format(myInvests.evaluatedAmount.krw.toFixed(0))}원 [<span  style="color: var(--${myInvests.profitLossRate.krw  > 0 ? 'adaptiveRed500' : myInvests.profitLossRate.krw < 0 ? 'adaptiveBlue500' : 'adaptiveGrey800'})"> <span data-flag="${Math.abs(myInvests.profitLossAmount.krw)/myInvests.profitLossAmount.krw}">${numberFormat.format(Math.abs(myInvests.profitLossAmount.krw).toFixed(0))}원 (${(Math.abs(myInvests.profitLossRate.krw) * 100).toFixed(2)}%</span>)</span>]</span></li>
                    <li><span>평가금($):</span><span>$${numberFormat.format(myInvests.evaluatedAmount.usd.toFixed(2))} [
                        <span  style="color: var(--${myInvests.profitLossRate.usd > 0 ? 'adaptiveRed500' : myInvests.profitLossRate.usd < 0 ? 'adaptiveBlue500' : 'adaptiveGrey800'})"><span data-flag="${myInvests.profitLossAmount.usd / Math.abs(myInvests.profitLossAmount.usd)}">$${numberFormat.format(Math.abs(myInvests.profitLossAmount.usd).toFixed(2))} (${(myInvests.profitLossRate.usd * 100).toFixed(2)}%</span>)</span>
                    ]</span></li>
                </ul>
            `;
            stockHorizontalBox.querySelector("#profit-contents").innerHTML = profitElement;

            /**
             *
             * @param {StockItem} item
             * @returns
             */
            let createElement = async (item) => {
                let div = document.createElement("div");
                let itemSubData = {
                    price: item.currentPrice.usd,
                    priceKrw: item.currentPrice.krw,
                }
                if (isAftermarketOpen() || !isUSMarketWeekend(new Date(Date.now()))) {
                    itemSubData = await getLastTradeTick(item.stockCode);
                    if (itemSubData.price != item.currentPrice.usd) {
                        const newEvaluatedAmount = item.tradableQuantity * itemSubData.price;
                        const totalAmount = item.purchaseAmount.usd;

                        item.evaluatedAmount.usd = newEvaluatedAmount;
                        item.profitLossAmount.usd = newEvaluatedAmount- totalAmount - (item.commission.usd);
                        item.profitLossRate.usd = (newEvaluatedAmount- totalAmount - (item.commission.usd)) / totalAmount;

                        item.currentPrice.usd = itemSubData.price;
                    }
                    if (itemSubData.priceKrw != item.currentPrice.krw) {
                        const newEvaluatedAmount = item.tradableQuantity * itemSubData.priceKrw;
                        const totalAmount = item.purchaseAmount.krw;

                        item.evaluatedAmount.krw = newEvaluatedAmount;
                        item.profitLossAmount.krw = newEvaluatedAmount- totalAmount - item.commission.krw;
                        item.profitLossRate.krw = (newEvaluatedAmount- totalAmount - item.commission.krw) / totalAmount;

                        item.currentPrice.krw = itemSubData.priceKrw;
                    }
                }
                div.innerHTML = `
                <div
                            class="tw-1uqcyii2 tw-1uqcyii0 tw-1uqcyiih tw-1uqcyiii"
                            role="button"
                            aria-disabled="false"
                            aria-roledescription="sortable"
                            aria-describedby="DndDescribedBy-0"
                            data-tossinvest-log="ListRow"
                            data-contents-label="${item.stockName}"
                            data-parent-name="StockRow"
                            style="transition: none; visibility: visible">
                            <div class="tw-1uqcyii3 tw-1uqcyii6">
                                <div data-nosnippet="true" class="favgr62 favgr60">
                                    <div class="c3f3of0 favgr68">
                                        <img
                                            alt="logo"
                                            loading="lazy"
                                            width="30"
                                            height="30"
                                            decoding="async"
                                            data-nimg="1"
                                            src="${item.logoImageUrl}"
                                            style="color: transparent" />
                                    </div>
                                    <span class="favgr6q favgr6o favgr6n"></span>
                                </div>
                            </div>
                            <div class="tw-1uqcyii7">
                                <div
                                    class="tw-1uqcyii8 tw-1uqcyiib tw-1uqcyiia tw-1uqcyiie"
                                    style="grid-template-columns: minmax(0px, 1fr) max-content">
                                    <span class="tw-1uqcyiik"
                                        ><div class="tw-1a59dbx0 tw-1a59dbx1">
                                            <span
                                                class="tw-1r5dc8g0"
                                                data-contents-label="종목명"
                                                style="
                                                    --tds-desktop-font-weight: 600;
                                                    --tds-desktop-foreground-color: var(
                                                        --adaptiveGrey700
                                                    );
                                                    --tds-desktop-line-height: 1.45;
                                                    --tds-desktop-font-size: 14px;
                                                "
                                                >${item.stockName}</span
                                            ><span
                                                class="tw-1r5dc8g0"
                                                data-contents-label="보유수량"
                                                style="
                                                    --tds-desktop-font-weight: 500;
                                                    --tds-desktop-foreground-color: var(
                                                        --adaptiveGrey600
                                                    );
                                                    --tds-desktop-line-height: 1.45;
                                                    --tds-desktop-font-size: 12px;
                                                "
                                                >${item.tradableQuantity}주</span
                                            >
                                            <span
                                                class="tw-1r5dc8g0"
                                                data-contents-label="보유수량"
                                                style="
                                                    --tds-desktop-font-weight: 500;
                                                    --tds-desktop-foreground-color: var(
                                                        --adaptiveGrey600
                                                    );
                                                    --tds-desktop-line-height: 1.45;
                                                    --tds-desktop-font-size: 10px;
                                                "

                                            >1주당수익
                                                <span
                                                    style="
                                                        --tds-desktop-foreground-color: var(--${item.currentPrice.usd - item.purchasePrice.usd <= 0 ? 'adaptiveBlue500' : 'adaptiveRed500'});
                                                        color: var(--tds-desktop-foreground-color);
                                                    "
                                                    data-flag="${Math.abs(item.currentPrice.usd - item.purchasePrice.usd) / (item.currentPrice.usd - item.purchasePrice.usd)}"
                                                >$${numberFormat.format(Math.abs(item.currentPrice.usd - item.purchasePrice.usd).toFixed(2))}</span>
                                            </span>
                                        </div></span
                                    ><span class="tw-1uqcyiik tw-1uqcyiim"
                                        ><div class="tw-1a59dbx0 tw-1a59dbx1 _1p5yqoh0">
                                            <small>1주당 $${numberFormat.format(itemSubData.price.toFixed(2))} (${numberFormat.format(itemSubData.priceKrw.toFixed(2))}원)</small>
                                            <span
                                                class="tw-1r5dc8g0"
                                                data-contents-label="보유금액"
                                                style="
                                                    --tds-desktop-font-weight: bold;
                                                    --tds-desktop-foreground-color: var(
                                                        --adaptiveGrey800
                                                    );
                                                    --tds-desktop-line-height: 1.45;
                                                    --tds-desktop-font-size: 14px;
                                                    color: var(--tds-desktop-foreground-color);
                                                "
                                                >$${numberFormat.format(Math.abs(item.evaluatedAmount.usd).toFixed(2))} (${numberFormat.format(parseInt(Math.abs(item.evaluatedAmount.krw)))}원)</span
                                            ><span
                                                class="tw-1r5dc8g0"
                                                style="
                                                    --tds-desktop-font-weight: 500;
                                                    --tds-desktop-foreground-color: var(--${item.profitLossAmount.usd <= 0 ? 'adaptiveBlue500' : 'adaptiveRed500'});
                                                    --tds-desktop-line-height: 1.45;
                                                    --tds-desktop-font-size: 12px;
                                                    color: var(--tds-desktop-foreground-color);
                                                "
                                                data-flag="${(item.profitLossAmount.usd) / Math.abs(item.profitLossAmount.usd)}"
                                                >$${numberFormat.format(Math.abs(item.profitLossAmount.usd).toFixed(2))} (${numberFormat.format((Math.abs(item.profitLossRate.usd) * 100).toFixed(2))}%) <br/> <span data-flag="${Math.abs(item.profitLossAmount.krw) / item.profitLossAmount.krw}">${numberFormat.format(parseInt(Math.abs(item.profitLossAmount.krw)))}원(${numberFormat.format((Math.abs(item.profitLossRate.krw) * 100).toFixed(2))}%)</span></span
                                            >
                                        </div></span>
                                </div>
                            </div>
                        </div>
                    `;
                if (location.pathname == `/stocks/${item.stockCode}/order`) div.querySelector("div").classList.add("_1oe23q56");
                div.addEventListener("click", e=>{
                    if (location.pathname == `/stocks/${item.stockCode}/order`) return e.preventDefault();
                    let a = document.createElement("a");
                    a.href = `/stocks/${item.stockCode}/order`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });
                return div;
            }
            let stockItems = await Promise.all(myInvests.us.items.sort(sortFunction).map(el=>createElement(el)));
            stockHorizontalBox.querySelector("ul#stock-items").innerHTML = '';
            stockItems.forEach(el=>stockHorizontalBox.querySelector(`ul#stock-items`).appendChild(el));
        }
    })();
    (async()=>{
        while(true) {
            await sleep(1000);
            const myMoney = await getMyMoney();
            stockHorizontalBox.querySelector(`h4`).innerHTML = `내 투자 | <small>주문 가능 금액:</small> <span>${numberFormat.format(myMoney.krw)}원 ($${numberFormat.format(myMoney.usd)})</span>`
        }
    })();
})();