const app = require('express')()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

app.use(bodyParser.json())

app.post('/', async (req, res) => {
    const db = await MongoClient.connect(require(`./consfig/database`))
    const dbo = db.db('canary_tokens')
    const r = await dbo.collection('tokens').insert(req.body)
    res.send({ insertResponse: r, token: req.body })
})

app.listen(process.env.PORT || 3000, console.log('server up'))  