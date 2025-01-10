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
    stockHorizontalBox.innerHTML = "<h4>내 투자</h4><div id='profit-contents'></div><ul id='stock-items'></ul>";
    let horizontalBtns = await waitForElement(`#__next > div > div.ho2myi1 > main > div > div > div > div.njzdl30 > div > div.njzdl36`);
    horizontalBtns.insertAdjacentElement("beforebegin", stockHorizontalBox);
    (async()=>{
        while(true) {
            await sleep(100);
            const myInvests = await getMyInvest().then(resp=>resp.result.sections[0].data);
            let profitElement = `
                <ul style="--tds-desktop-foreground-color: var(--adaptiveGrey800);">
                    <li><span>총 투자:</span> <span>${numberFormat.format(myInvests.principalAmount.krw.toFixed(2))}원 ($${numberFormat.format(myInvests.principalAmount.usd)})</span></li>
                    <li><span>평가금:</span><span style="color: var(--${myInvests.profitLossRate.krw > 0 ? 'adaptiveRed500' : myInvests.profitLossRate.krw < 0 ? 'adaptiveBlue500' : 'adaptiveGrey8000'})">${numberFormat.format(myInvests.evaluatedAmount.krw.toFixed(0))}원 (${(myInvests.profitLossRate.krw * 100).toFixed(2)}% )</span></li>
                    <li><span>손실액:</span><span style="color: var(--${myInvests.profitLossRate.krw  > 0 ? 'adaptiveRed500' : myInvests.profitLossRate.krw < 0 ? 'adaptiveBlue500' : 'adaptiveGrey8000'})">${numberFormat.format(myInvests.profitLossAmount.krw.toFixed(0))}원 (${(myInvests.profitLossRate.krw * 100).toFixed(2)}%)</span></li>
                    <li><span>평가금($):</span><span style="color: var(--${myInvests.profitLossRate.usd > 0 ? 'adaptiveRed500' : myInvests.profitLossRate.usd < 0 ? 'adaptiveBlue500' : 'adaptiveGrey8000'})">$${numberFormat.format(myInvests.evaluatedAmount.usd.toFixed(2))} (${(myInvests.profitLossRate.usd * 100).toFixed(2)}% )</span></li>
                    <li><span>손실액($):</span><span style="color: var(--${myInvests.profitLossRate.usd > 0 ? 'adaptiveRed500' : myInvests.profitLossRate.usd < 0 ? 'adaptiveBlue500' : 'adaptiveGrey8000'})">$${numberFormat.format(myInvests.profitLossAmount.usd.toFixed(2))} (${(myInvests.profitLossRate.usd * 100).toFixed(2)}%)</span></li>
                </ul>
            `;
            stockHorizontalBox.querySelector("#profit-contents").innerHTML = profitElement;

            /**
             *
             * @param {StockItem} item
             * @returns
             */
            let createElement = (item) => {
                let div = document.createElement("div");
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
                                        </div></span
                                    ><span class="tw-1uqcyiik tw-1uqcyiim"
                                        ><div class="tw-1a59dbx0 tw-1a59dbx1 _1p5yqoh0">
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
                                                "
                                                >$${numberFormat.format(item.evaluatedAmount.usd.toFixed(2))} (${numberFormat.format(parseInt(item.evaluatedAmount.krw))}원)</span
                                            ><span
                                                class="tw-1r5dc8g0"
                                                style="
                                                    --tds-desktop-font-weight: 500;
                                                    --tds-desktop-foreground-color: var(
                                                        --${item.profitLossAmount.usd <= 0 ? 'adaptiveBlue500' : 'adaptiveRed500'}
                                                    );
                                                    --tds-desktop-line-height: 1.45;
                                                    --tds-desktop-font-size: 12px;
                                                "
                                                >$${numberFormat.format(item.profitLossAmount.usd.toFixed(2))} (${numberFormat.format((item.profitLossRate.usd * 100).toFixed(2))}%) <br/> ${numberFormat.format(parseInt(item.profitLossAmount.krw))}원(${numberFormat.format((item.profitLossRate.krw * 100).toFixed(2))}%)</span
                                            >
                                        </div></span>
                                </div>
                            </div>
                        </div>
                    `;
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
            stockHorizontalBox.querySelector("ul#stock-items").innerHTML = '';
            myInvests.us.items.sort((a, b)=>(b.evaluatedAmount.usd - a.evaluatedAmount.usd)).map(el=>createElement(el)).forEach(el=>{
                stockHorizontalBox.querySelector("ul#stock-items").appendChild(el);
            });
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