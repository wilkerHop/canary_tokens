const app = require('express')()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

app.use(bodyParser.json())

app.post('/', async (req, res) => {
    insert(req.body)
    
    res.sendStatus(200)

})

app.get('/dog.jpg',(req,res)=>{
    insert(req.connection.localAddress,
        req.headers["user-agent"],
        new Date(),
        req.cookies,
        req.params.urlCode)
    res.sendFile('./dog.jpg')
})
const insert = async (obj)=>{
    const db = await MongoClient.connect(require(`./consfig/database`))
    const dbo = db.db('canary_tokens')
    await dbo.collection('tokens').insert(obj)
    db.close()
}
app.listen(process.env.PORT || 3000, console.log('server up'))  