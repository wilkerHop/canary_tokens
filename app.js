const app = require('express')()
const expressip = require('express-ip')
const MongoClient = require('mongodb').MongoClient
const path = require('path')

app.use(expressip().getIpInfoMiddleware)

app.get('/dog.jpg', async (req, res) => {
    console.log('expressip', req.ipInfo)
    await insert({
        address: req.connection.localAddress,
        date: new Date(),
        cookies: req.cookies,
        headers: req.headers,
        hostname: req.hostname,
        ipInfo: req.ipInfo
        // connection:JSON.stringify(req.connection),
    })
    res.sendFile(path.join(__dirname, 'dog.jpg'))
})

app.get('/flower.png', (req, res) => {
    await insert({
        address: req.connection.localAddress,
        date: new Date(),
        cookies: req.cookies,
        headers: req.headers,
        hostname: req.hostname,
        ipInfo: req.ipInfo
        // connection:JSON.stringify(req.connection),
    })
    res.sendFile('https://cdn.pixabay.com/photo/2018/03/02/08/47/rose-3192610_960_720.png')
})

const insert = async (obj) => {
    const db = await MongoClient.connect(require(`./config/database`),
        { useNewUrlParser: true })
    const dbo = db.db('canary_tokens')
    await dbo.collection('tokens').insertOne(obj)
    db.close()
}

app.listen(process.env.PORT || 3000, console.log('server up'))
