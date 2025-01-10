/**
 * @returns {{"krw": Number, "usd": Number}}
 */
const getMyMoney = () => fetch("https://wts-api.tossinvest.com/api/v3/my-assets/transactions/markets/us/overview", {
    "headers": {
      "accept": "application/json",
    },
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  }).then(resp=>resp.json()).then(data=>data.result.orderableAmount);
const numberFormat = new Intl.NumberFormat("ko-KR");
(async()=>{
    const span = await waitForElement(`a[data-contents-label="내 투자"] > div > div`);
    while(true) {
        await sleep(1000);
        const myMoney = await getMyMoney();
        console.debug(myMoney);
        span.innerHTML = `<small>주문 가능 금액:</small> <div>${numberFormat.format(myMoney.krw)}원 ($${numberFormat.format(myMoney.usd)})</div>`
    }
})();