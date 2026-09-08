// Market data service - integrate with your data provider

export async function getIndices() {
  return [
    { name: 'NIFTY 50', value: 24150, change: 145, percent: 0.61 },
    { name: 'BANK NIFTY', value: 51320, change: 280, percent: 0.55 },
    { name: 'SENSEX', value: 79850, change: 420, percent: 0.53 }
  ]
}

export async function getSectorData() {
  return [
    { name: 'REALTY', up: 9, down: 0 },
    { name: 'BANKING', up: 8, down: 1 },
    { name: 'IT', up: 7, down: 2 }
  ]
}

export async function getStockData(symbol) {
  return {
    symbol,
    price: 1234.50,
    change: 23.45,
    percent: 1.95
  }
}
