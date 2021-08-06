# throttler
a simple throttle middleware for express apps.this package works with redis

you can install it :

```
npm i @fraybabak/throttler

```

simple usage: 


```
const express = require('express')
const app = express()
const port = 3010

// require the Throttler
const Throttler = require("@fraybabak/throttler")


// create new instance with options
// there are only 3 options :
// 1. redis_address    ==> redis address
// 2. limit            ==> limitation per route
// 3. cooldown         ==> cooldown time per second

const throttle = new Throttler({redis_address: "127.0.0.1:6379", limit:5, cooldown: 10})


// use it like this before defining your routes
app.use((req, res, next)=>throttle.guard(req,res,next))

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/test', (req, res) => res.send('Hello World! again'))

// will register your routes 
throttle.setup(app)

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

```
