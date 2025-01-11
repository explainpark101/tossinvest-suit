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


/**
 * @typedef {Object} Range
 * @property {string} from - 시작 날짜 (예: "2025-01-11")
 * @property {string} to - 종료 날짜 (예: "2025-01-11")
 */

/**
 * @typedef {Object} PagingParam
 * @property {number} number - 페이지 번호
 * @property {number} size - 페이지 크기
 * @property {string|null} key - 키 값
 * @property {Range} range - 날짜 범위
 * @property {Array<string>} filters - 필터 목록
 * @property {string} type - 유형
 * @property {string|null} unsettledStockKey - 미결제 주식 키
 * @property {string|null} unsettledOptionKey - 미결제 옵션 키
 * @property {string|null} unsettledBondKey - 미결제 채권 키
 * @property {number} settledKey - 결제 키
 */

/**
 * @typedef {Object} TransactionType
 * @property {string} code - 거래 코드 (예: "1" 또는 "2")
 * @property {string} displayName - 거래 이름 (예: "입금" 또는 "출금")
 */

/**
 * @typedef {Object} CompositeKey
 * @property {string} date - 날짜 (예: "2025-01-06")
 * @property {number} no - 번호 (예: 1)
 */

/**
 * @typedef {Object} Transaction
 * @property {string} type - 거래 유형
 * @property {TransactionType} transactionType - 거래 상세 정보
 * @property {string} displayType - 표시 유형
 * @property {string|null} stockCode - 주식 코드
 * @property {string} stockName - 주식 이름
 * @property {number} quantity - 수량
 * @property {number} amount - 금액 (달러)
 * @property {number} adjustedAmount - 조정된 금액
 * @property {number} commissionAmount - 수수료 금액
 * @property {number} totalTaxAmount - 총 세금 금액
 * @property {number} balanceAmount - 잔액 금액
 * @property {string} summary - 요약
 * @property {string} summaryNo - 요약 번호
 * @property {string|null} rightHistory - 권리 이력
 * @property {string|null} transferDelay - 이체 지연
 * @property {string} dateTime - 거래 일시 (예: "2025-01-06 14:18:13.969")
 * @property {string|null} executionDate - 실행 일자
 * @property {string|null} refund - 환불
 * @property {string|null} exchange - 환전
 * @property {string|null} dividend - 배당
 * @property {string|null} bond - 채권
 * @property {string} referenceType - 참조 유형 (예: "EXCHANGE_ORDER")
 * @property {string} referenceId - 참조 ID
 * @property {CompositeKey} compositeKey - 복합 키
 */

/**
 * @typedef {Object} CurrencyChangeResult
 * @property {PagingParam} pagingParam - 페이지 파라미터
 * @property {Array<Transaction>} body - 거래 내역 목록
 * @property {boolean} lastPage - 마지막 페이지 여부
 */

/**
 * @typedef {Object} CurrencyChangeResponse
 * @property {CurrencyChangeResult} result - 결과
 */


/**
 * @typedef {Object} AmountDetail
 * @property {string} currencyCode - 통화 코드 (예: "USD", "KRW")
 * @property {number} amount - 금액
 */

/**
 * @typedef {Object} Exchange
 * @property {AmountDetail} adjustedAmount - 조정된 금액
 * @property {string} name - 환전 거래 이름 (예: "환전거래(달러구매)")
 * @property {AmountDetail} depositAmount - 입금 금액
 * @property {AmountDetail} withdrawalAmount - 출금 금액
 * @property {number} rate - 환율
 * @property {number} tossFee - 송금 수수료
 * @property {number} bankFee - 은행 수수료
 */

/**
 * @typedef {Object} CurrencyChangeDetailTransaction
 * @property {number} balanceAmount - 잔액 금액
 * @property {string} summary - 거래 요약 (예: "환전외화입금")
 * @property {string} summaryNo - 요약 번호
 * @property {string|null} rightHistory - 권리 이력
 * @property {string|null} transferDelay - 이체 지연
 * @property {string} dateTime - 거래 일시 (예: "2024-08-19 18:18:20.207")
 * @property {string|null} executionDate - 실행 일자
 * @property {string|null} refund - 환불 정보
 * @property {Exchange|null} exchange - 환전 정보
 * @property {string|null} dividend - 배당 정보
 * @property {string} type - 거래 유형 (예: "2")
 * @property {TransactionType} transactionType - 거래 상세 정보
 * @property {string} displayType - 표시 유형 (예: "12")
 * @property {string|null} stockCode - 주식 코드
 * @property {string|null} stockName - 주식 이름
 * @property {number|null} quantity - 수량
 * @property {number|null} amount - 금액
 * @property {number|null} adjustedAmount - 조정된 금액
 * @property {number|null} commissionAmount - 수수료 금액
 * @property {number|null} totalTaxAmount - 총 세금 금액
 * @property {CompositeKey} compositeKey - 복합 키
 */

/**
 * @typedef {Object} CurrencyChangeDetailResult
 * @property {CurrencyChangeDetailTransaction} transaction - 거래 정보
 * @property {Array|null} items - 추가 항목
 */

/**
 * @typedef {Object} CurrencyChangeDetailResponse
 * @property {CurrencyChangeDetailResult} result - 결과
 */

/**
 * @typedef {Object} CandleTick
 * @property {string} time - 거래 시간 (HH:mm:ss 형식).
 * @property {string} code - 거래 코드.
 * @property {number} price - 거래 가격 (기본 통화).
 * @property {number} priceKrw - 거래 가격 (KRW 정수 부분).
 * @property {number} priceKrwDecimal - 거래 가격 (KRW 소수 포함).
 * @property {number} base - 기준 가격 (기본 통화).
 * @property {number} baseKrw - 기준 가격 (KRW 정수 부분).
 * @property {number} baseKrwDecimal - 기준 가격 (KRW 소수 포함).
 * @property {number} quantity - 거래 수량.
 * @property {string} tradeType - 거래 유형 ("BUY" 또는 "SELL").
 * @property {number} cumulativeVolume - 누적 거래량.
 */
