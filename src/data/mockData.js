// Mock data — swap for real Alpaca + earnings-calendar + options-chain
// calls later. Shapes here are what the real data pipeline should produce.

export const accountSummary = {
  accountId: 'PA3XJ9K2Q7WZ',
  environment: 'Paper',
  status: 'connected',
  startingBalance: 100000,
  equity: 104812.37,
  buyingPower: 51260.4,
  cash: 28430.9,
  dayPL: 612.18,
  dayPLPct: 0.59,
  totalPL: 4812.37,
  totalPLPct: 4.81,
  openPositions: 4,
  mcpStatus: 'connected',
};

const spark = (seed, up) => {
  let v = 100000;
  const out = [];
  for (let i = 0; i < 30; i++) {
    v += (Math.sin(seed + i * 0.6) + (up ? 0.4 : -0.1)) * 220;
    out.push({ i, v });
  }
  return out;
};
export const equityCurve = spark(3, true);

// 15-stock watchlist — mix of liquid, optionable large caps.
export const watchlist = [
  { ticker: 'AAPL', company: 'Apple Inc.', sector: 'Technology', price: 228.41, earningsDate: '2026-08-29', earningsTime: 'AMC', impliedMove: 4.8, historicalMove: 6.9, ratio: 0.70, signal: 'buy_premium', confidence: 78, lastScanned: '6m ago' },
  { ticker: 'MSFT', company: 'Microsoft Corp.', sector: 'Technology', price: 512.06, earningsDate: '2026-08-29', earningsTime: 'AMC', impliedMove: 3.9, historicalMove: 3.6, ratio: 1.08, signal: 'no_edge', confidence: 34, lastScanned: '6m ago' },
  { ticker: 'NVDA', company: 'NVIDIA Corp.', sector: 'Semiconductors', price: 187.22, earningsDate: '2026-09-02', earningsTime: 'AMC', impliedMove: 9.4, historicalMove: 6.8, ratio: 1.38, signal: 'sell_premium', confidence: 82, lastScanned: '2m ago' },
  { ticker: 'TSLA', company: 'Tesla Inc.', sector: 'Automotive', price: 268.55, earningsDate: '2026-09-01', earningsTime: 'AMC', impliedMove: 10.1, historicalMove: 7.5, ratio: 1.35, signal: 'sell_premium', confidence: 76, lastScanned: '4m ago' },
  { ticker: 'AMZN', company: 'Amazon.com Inc.', sector: 'E-commerce', price: 231.88, earningsDate: '2026-08-30', earningsTime: 'AMC', impliedMove: 6.2, historicalMove: 6.0, ratio: 1.03, signal: 'no_edge', confidence: 22, lastScanned: '9m ago' },
  { ticker: 'GOOGL', company: 'Alphabet Inc.', sector: 'Technology', price: 214.30, earningsDate: '2026-09-03', earningsTime: 'AMC', impliedMove: 5.5, historicalMove: 5.4, ratio: 1.02, signal: 'no_edge', confidence: 18, lastScanned: '12m ago' },
  { ticker: 'META', company: 'Meta Platforms', sector: 'Technology', price: 748.12, earningsDate: '2026-08-29', earningsTime: 'AMC', impliedMove: 7.8, historicalMove: 9.6, ratio: 0.81, signal: 'buy_premium', confidence: 61, lastScanned: '6m ago' },
  { ticker: 'AMD', company: 'Advanced Micro Devices', sector: 'Semiconductors', price: 172.64, earningsDate: '2026-09-02', earningsTime: 'AMC', impliedMove: 8.9, historicalMove: 8.7, ratio: 1.02, signal: 'no_edge', confidence: 15, lastScanned: '2m ago' },
  { ticker: 'NFLX', company: 'Netflix Inc.', sector: 'Media', price: 1284.70, earningsDate: '2026-09-05', earningsTime: 'AMC', impliedMove: 6.9, historicalMove: 9.8, ratio: 0.70, signal: 'buy_premium', confidence: 74, lastScanned: '18m ago' },
  { ticker: 'CRM', company: 'Salesforce Inc.', sector: 'Software', price: 322.15, earningsDate: '2026-09-04', earningsTime: 'AMC', impliedMove: 6.1, historicalMove: 8.2, ratio: 0.74, signal: 'buy_premium', confidence: 68, lastScanned: '20m ago' },
  { ticker: 'ADBE', company: 'Adobe Inc.', sector: 'Software', price: 486.90, earningsDate: '2026-09-11', earningsTime: 'AMC', impliedMove: 7.4, historicalMove: 8.9, ratio: 0.83, signal: 'buy_premium', confidence: 55, lastScanned: '1h ago' },
  { ticker: 'INTC', company: 'Intel Corp.', sector: 'Semiconductors', price: 30.42, earningsDate: '2026-09-24', earningsTime: 'AMC', impliedMove: 9.8, historicalMove: 10.2, ratio: 0.96, signal: 'no_edge', confidence: 9, lastScanned: '1h ago' },
  { ticker: 'BA', company: 'Boeing Co.', sector: 'Aerospace', price: 218.77, earningsDate: '2026-10-22', earningsTime: 'BMO', impliedMove: 5.6, historicalMove: 8.1, ratio: 0.69, signal: 'buy_premium', confidence: 45, lastScanned: '2h ago' },
  { ticker: 'DIS', company: 'Walt Disney Co.', sector: 'Media', price: 118.34, earningsDate: '2026-11-12', earningsTime: 'BMO', impliedMove: 5.9, historicalMove: 6.1, ratio: 0.97, signal: 'no_edge', confidence: 6, lastScanned: '3h ago' },
  { ticker: 'PYPL', company: 'PayPal Holdings', sector: 'Fintech', price: 74.28, earningsDate: '2026-10-29', earningsTime: 'BMO', impliedMove: 8.4, historicalMove: 6.2, ratio: 1.35, signal: 'sell_premium', confidence: 71, lastScanned: '3h ago' },
];

export const openPositions = [
  {
    id: 'p1',
    ticker: 'NVDA',
    strategy: 'Iron Condor',
    legs: [
      { side: 'sell', type: 'call', strike: 198, expiry: '2026-09-05' },
      { side: 'buy', type: 'call', strike: 205, expiry: '2026-09-05' },
      { side: 'sell', type: 'put', strike: 172, expiry: '2026-09-05' },
      { side: 'buy', type: 'put', strike: 165, expiry: '2026-09-05' },
    ],
    entryCredit: 2.35,
    currentValue: 1.62,
    pl: 73.0,
    plPct: 31.1,
    maxRisk: 465,
    maxProfit: 235,
    openedAt: '2026-08-27T14:32:00Z',
    daysToExpiry: 6,
    exitRule: 'Close at 50% max profit or by 2026-09-03',
  },
  {
    id: 'p2',
    ticker: 'TSLA',
    strategy: 'Iron Condor',
    legs: [
      { side: 'sell', type: 'call', strike: 288, expiry: '2026-09-05' },
      { side: 'buy', type: 'call', strike: 298, expiry: '2026-09-05' },
      { side: 'sell', type: 'put', strike: 248, expiry: '2026-09-05' },
      { side: 'buy', type: 'put', strike: 238, expiry: '2026-09-05' },
    ],
    entryCredit: 3.10,
    currentValue: 3.42,
    pl: -32.0,
    plPct: -10.3,
    maxRisk: 690,
    maxProfit: 310,
    openedAt: '2026-08-27T15:05:00Z',
    daysToExpiry: 5,
    exitRule: 'Close at 50% max profit or by 2026-09-02',
  },
  {
    id: 'p3',
    ticker: 'AAPL',
    strategy: 'Long Strangle',
    legs: [
      { side: 'buy', type: 'call', strike: 236, expiry: '2026-09-05' },
      { side: 'buy', type: 'put', strike: 220, expiry: '2026-09-05' },
    ],
    entryDebit: 5.80,
    currentValue: 6.65,
    pl: 85.0,
    plPct: 14.7,
    maxRisk: 580,
    maxProfit: null,
    openedAt: '2026-08-28T13:47:00Z',
    daysToExpiry: 7,
    exitRule: 'Take profit at 2x debit or exit by 2026-08-31 open',
  },
  {
    id: 'p4',
    ticker: 'META',
    strategy: 'Long Strangle',
    legs: [
      { side: 'buy', type: 'call', strike: 768, expiry: '2026-09-05' },
      { side: 'buy', type: 'put', strike: 728, expiry: '2026-09-05' },
    ],
    entryDebit: 14.20,
    currentValue: 12.10,
    pl: -210.0,
    plPct: -14.8,
    maxRisk: 1420,
    maxProfit: null,
    openedAt: '2026-08-28T14:02:00Z',
    daysToExpiry: 7,
    exitRule: 'Take profit at 2x debit or exit by 2026-08-31 open',
  },
];

export const tradeHistory = [
  { id: 'h1', ticker: 'CRM', strategy: 'Long Strangle', entryDate: '2026-08-20', exitDate: '2026-08-21', pl: 214.0, plPct: 42.8, outcome: 'win', exitReason: 'profit_target' },
  { id: 'h2', ticker: 'AMD', strategy: 'Iron Condor', entryDate: '2026-08-18', exitDate: '2026-08-19', pl: -128.0, plPct: -38.4, outcome: 'loss', exitReason: 'stop_loss' },
  { id: 'h3', ticker: 'NFLX', strategy: 'Long Straddle', entryDate: '2026-08-14', exitDate: '2026-08-15', pl: 612.0, plPct: 55.2, outcome: 'win', exitReason: 'profit_target' },
  { id: 'h4', ticker: 'DIS', strategy: 'Iron Condor', entryDate: '2026-08-12', exitDate: '2026-08-13', pl: 96.0, plPct: 28.1, outcome: 'win', exitReason: 'profit_target' },
  { id: 'h5', ticker: 'INTC', strategy: 'Iron Condor', entryDate: '2026-08-08', exitDate: '2026-08-09', pl: -74.0, plPct: -22.0, outcome: 'loss', exitReason: 'time_exit' },
  { id: 'h6', ticker: 'ADBE', strategy: 'Long Strangle', entryDate: '2026-08-05', exitDate: '2026-08-06', pl: 158.0, plPct: 31.9, outcome: 'win', exitReason: 'profit_target' },
  { id: 'h7', ticker: 'PYPL', strategy: 'Iron Condor', entryDate: '2026-08-01', exitDate: '2026-08-02', pl: 61.0, plPct: 19.4, outcome: 'win', exitReason: 'time_exit' },
];

export const activityLog = [
  { id: 'a1', time: '2m ago', ticker: 'NVDA', action: 'scanned', summary: 'Implied move 9.4% vs historical 6.8% — ratio 1.38, above sell threshold.' },
  { id: 'a2', time: '2m ago', ticker: 'NVDA', action: 'entered', summary: 'Opened Iron Condor 165/172/198/205 exp 2026-09-05 for $2.35 credit.' },
  { id: 'a3', time: '4m ago', ticker: 'TSLA', action: 'entered', summary: 'Opened Iron Condor 238/248/288/298 exp 2026-09-05 for $3.10 credit.' },
  { id: 'a4', time: '6m ago', ticker: 'AAPL', action: 'scanned', summary: 'Implied move 4.8% vs historical 6.9% — ratio 0.70, below buy threshold.' },
  { id: 'a5', time: '6m ago', ticker: 'MSFT', action: 'skipped', summary: 'Ratio 1.08 — inside no-edge band (0.7–1.3). No trade taken.' },
  { id: 'a6', time: '9m ago', ticker: 'AMZN', action: 'skipped', summary: 'Ratio 1.03 — inside no-edge band. No trade taken.' },
  { id: 'a7', time: '18m ago', ticker: 'NFLX', action: 'scanned', summary: 'Implied move 6.9% vs historical 9.8% — ratio 0.70, flagged for entry next cycle.' },
  { id: 'a8', time: '1h ago', ticker: 'INTC', action: 'skipped', summary: 'Bid-ask spread 14% exceeds 10% liquidity gate. No trade taken.' },
];

export const riskSettings = {
  maxRiskPerTradePct: 2,
  maxConcurrentPositions: 5,
  dailyLossLimitPct: 5,
  sellPremiumThreshold: 1.3,
  buyPremiumThreshold: 0.7,
  minOpenInterest: 100,
  maxBidAskSpreadPct: 10,
  watchlistSize: 15,
  profitTargetPct: 50,
  hardExitRule: 'Close by end of day after earnings, regardless of P&L',
};
