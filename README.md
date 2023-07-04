# 📦 best-samp-query

Simplified Query API for SAMP: Efficient and easy retrieval of information from the server 🔥

## 💾 Installation

```bash
npm install best-samp-query
```

## 📋 Options

- `host` — **Required**
- `port` — *Default: 7777* — **Optional**
- `timeout` — *Default: 1000* — **Optional**

## 🎁 Code example

```javascript
const Query = require("best-samp-query");
const Options = {
    host: "135.148.89.12",
    port: 7777,
    timeout: 1000
};
Query(Options)
    .catch(console.error)
    .then(console.log);
```
## 🎁 Sample output

```javascript
{
  online: 11,
  address: "135.148.89.12",
  port: 7777,
  hostname: ".:( PuroDesmadre V ):.  [ DM ] + [ FreeRoam ]",
  gamemode: "Dm/FreeRoam/Derby",
  mapname: "Espaсol/Latino",
  passworded: false,
  maxplayers: 50,
  rules: {
    lagcomp: false,
    mapname: "San Andreas",
    version: "0.3.7-R2",
    weather: 10,
    weburl: "discord.gg/BjUGcpcYUt",
    worldtime: "12:00"
  },
  players: [
    { id: 0, name: "Neiikos", score: 323, ping: 101 },
    { id: 1, name: "vorTeX", score: 2359, ping: 163 },
    { id: 2, name: "Kis4Me", score: 1000822, ping: 157 },
    { id: 3, name: "Benjamin_Otero", score: 0, ping: 202 },
    { id: 4, name: "Oier_Millan", score: 4340, ping: 102 },
    { id: 6, name: ".Gs.Ahm6d6l6.Vl", score: 1729246, ping: 127 },
    { id: 7, name: "Canserbero.Tss", score: 1512, ping: 280 },
    { id: 8, name: "cumtrol", score: 267, ping: 66 },
    { id: 10, name: "benja_guerrero", score: 11, ping: 224 },
    { id: 12, name: "pato_pinuer", score: 30, ping: 178 },
    { id: 14, name: "zoom_saaaa", score: 20110, ping: 137 }
  ]
}
```
