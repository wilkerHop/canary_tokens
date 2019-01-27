const app = require('express')()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const path = require('path')
const fs = require('fs');

app.use(bodyParser.json())

app.post('/', async (req, res) => {
    insert(req.body)

    res.sendStatus(200)
})

app.get('/dog.jpg', async(req, res) => {
    await insert({
        address: req.connection.localAddress,
        'user-agent': req.headers["user-agent"],
        date: new Date(),
        cookies: req.cookies,
        headers:req.headers
    })
    res.sendFile(path.join(__dirname, 'dog.jpg'))
})

const insert = async (obj) => {
    const db = await MongoClient.connect(require(`./config/database`), { useNewUrlParser: true })
    const dbo = db.db('canary_tokens')
    await dbo.collection('tokens').insertOne(obj)
    db.close()
}
app.listen(process.env.PORT || 3000, console.log('server up'))
