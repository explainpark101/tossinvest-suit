require('dotenv').config();
const axios = require('axios');

// Alpha Vantage API 키 (환경 변수로 설정)
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

// 주식 가격 데이터 가져오기
async function getStockData(symbol) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol: symbol,
        interval: '1min',
        apikey: API_KEY,
      },
    });
    console.log(response.data);
    return response.data['Time Series (1min)'];
  } catch (error) {
    console.error('Error fetching stock data:', error);
  }
}

// 이동 평균 계산
function calculateMovingAverage(data, period) {
  const prices = Object.values(data).map(entry => parseFloat(entry['4. close']));
  let movingAverages = [];
  for (let i = period - 1; i < prices.length; i++) {
    const average = prices.slice(i - period + 1, i + 1).reduce((sum, price) => sum + price, 0) / period;
    movingAverages.push(average);
  }
  return movingAverages;
}

// RSI 계산
function calculateRSI(data, period = 14) {
  const prices = Object.values(data).map(entry => parseFloat(entry['4. close']));
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  return rsi;
}

// 매수/매도 추천 알고리즘
async function recommendAction(symbol, stockName) {

    const data = await getStockData(symbol);
    console.log(symbol, "-1");

    const shortMA = calculateMovingAverage(data, 5);  // 단기 이동 평균
    const longMA = calculateMovingAverage(data, 15);  // 장기 이동 평균
    const rsi = calculateRSI(data);
    console.log(symbol, "0");

    const latestShortMA = shortMA[shortMA.length - 1];
    const latestLongMA = longMA[longMA.length - 1];
    const latestRSI = rsi;
    console.log(symbol, "1");
    let action = '';

    // 매수 조건: 단기 이동 평균 > 장기 이동 평균, RSI < 30
    if (latestShortMA > latestLongMA && latestRSI < 30) {
        action = 'Buy';
    }
    // 매도 조건: 단기 이동 평균 < 장기 이동 평균, RSI > 70
    else if (latestShortMA < latestLongMA && latestRSI > 70) {
        action = 'Sell';
    } else {
        action = 'Hold';
    }
    console.log(symbol, "2");

    process.stdout.write(`Recommendation for ${symbol} ${stockName ? '('+stockName+')' : ''}: ${action}\n`);
}

const sleep = t => new Promise(r=>setTimeout(r,t));

// 실행
const stockSymbols = {
    "CRNC": "세렌스",
    "LAES": "실SQ",
    "QUBT": "퀀텀 컴퓨팅",
    "RGTI": "리게티 컴퓨팅",
    "RKLB": "로켓랩",
};
(async()=>{
    while (true) {
        await Promise.allSettled(Object.entries(stockSymbols).map(([symbol, name]) => recommendAction(symbol, name)));
        await sleep(60000);
    }
})();
