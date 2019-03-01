# Binance-ws

> Implementation of Binance Websocket API

## Getting Started

```bash
# install deps
npm install
# run server
npm start
```

### Understand the data

For every time-id pair there is one array of asks(arrays) and bids(arrays). If the ask-bid array is empty it means, that it returned no data. The number of pairs (time*id - bids/asks) remains the same tho.

