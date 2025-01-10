/**
 * @typedef {Object} MyInvestType
 * @property {Result} result - The result object.
 */

/**
 * @typedef {Object} Result
 * @property {Section[]} sections - List of sections.
 */

/**
 * @typedef {Object} Section
 * @property {Data} data - Data of the section.
 * @property {string} type - The type of the section (e.g., "OVERVIEW").
 */

/**
 * @typedef {Object} Data
 * @property {Amount} principalAmount - Principal amount.
 * @property {Amount} evaluatedAmount - Evaluated amount.
 * @property {Amount} profitLossAmount - Profit/loss amount.
 * @property {Amount} dailyProfitLossAmount - Daily profit/loss amount.
 * @property {Rate} profitLossRate - Profit/loss rate.
 * @property {Rate} dailyProfitLossRate - Daily profit/loss rate.
 * @property {Category} kr - Korean market details.
 * @property {Category} us - US market details.
 * @property {Category} option - Option market details.
 * @property {Category} bond - Bond market details.
 * @property {HiddenStock} hiddenStock - Hidden stock details.
 * @property {boolean} usePolling - Whether polling is used.
 * @property {null} stockNudge - Stock nudge information (currently null).
 * @property {null} bondNudge - Bond nudge information (currently null).
 */

/**
 * @typedef {Object} Category
 * @property {StockItem[]} items - List of stock items.
 * @property {Amount} principalAmount - Principal amount.
 * @property {Amount} evaluatedAmount - Evaluated amount.
 * @property {Amount} profitLossAmount - Profit/loss amount.
 * @property {Amount} dailyProfitLossAmount - Daily profit/loss amount.
 * @property {Rate} profitLossRate - Profit/loss rate.
 * @property {Rate} dailyProfitLossRate - Daily profit/loss rate.
 * @property {boolean} sorted - Whether items are sorted.
 * @property {boolean} hasDelisting - Whether there is delisting.
 */

/**
 * @typedef {Object} StockItem
 * @property {number} id - Stock ID.
 * @property {string} key - Unique stock key.
 * @property {string} stockCode - Stock code.
 * @property {string} stockIsin - Stock ISIN.
 * @property {string} stockSymbol - Stock symbol.
 * @property {string} stockName - Stock name.
 * @property {string} logoImageUrl - URL of the stock logo image.
 * @property {number} quantity - Quantity of stocks held.
 * @property {number} tradableQuantity - Tradable quantity.
 * @property {number} unsettledQuantity - Unsettled quantity.
 * @property {Amount} currentPrice - Current price of the stock.
 * @property {Amount} basePrice - Base price of the stock.
 * @property {Amount} purchasePrice - Purchase price of the stock.
 * @property {Amount} purchaseAmount - Purchase amount.
 * @property {Amount} evaluatedAmount - Evaluated amount.
 * @property {Amount} profitLossAmount - Profit/loss amount.
 * @property {Amount} dailyProfitLossAmount - Daily profit/loss amount.
 * @property {Rate} profitLossRate - Profit/loss rate.
 * @property {Rate} dailyProfitLossRate - Daily profit/loss rate.
 * @property {Amount} commission - Commission details.
 * @property {number} commissionRate - Commission rate.
 * @property {Amount} buyCommission - Buy commission.
 * @property {Amount} sellCommission - Sell commission.
 * @property {null|Amount} tax - Tax details.
 * @property {null|number} taxRate - Tax rate.
 * @property {boolean} delisting - Whether the stock is delisted.
 * @property {boolean} unlisting - Whether the stock is unlisted.
 * @property {string} marketCode - Market code.
 * @property {string} stockGroupCode - Stock group code.
 * @property {boolean} stockWarrants - Whether stock has warrants.
 * @property {null} stockWarrantsLink - Link for stock warrants (currently null).
 * @property {number} shortSellingQuantity - Short selling quantity.
 * @property {number} rightExpectedQuantity - Expected right quantity.
 * @property {number} rightEvaluatedAmount - Evaluated amount of rights.
 * @property {Notice} notice - Notices related to the stock.
 */

/**
 * @typedef {Object} Notice
 * @property {boolean} splitMerge - Whether there is a split or merge.
 * @property {boolean} earningsAnnouncement - Whether there is an earnings announcement.
 */

/**
 * @typedef {Object} Amount
 * @property {number|null} krw - Amount in KRW.
 * @property {number|null} usd - Amount in USD.
 */

/**
 * @typedef {Object} Rate
 * @property {number} krw - Rate in KRW.
 * @property {number} usd - Rate in USD.
 */

/**
 * @typedef {Object} HiddenStock
 * @property {number} count - Count of hidden stocks.
 * @property {boolean} all - Whether all stocks are hidden.
 * @property {number} amount - Total amount of hidden stocks.
 */
