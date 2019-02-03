const app = require('express')()
const expressip = require('express-ip')
const MongoClient = require('mongodb').MongoClient
const path = require('path')

app.use(expressip().getIpInfoMiddleware)

app.get('**:subject', async (req, res) => {
    await insert(req)
    console.log(req.url)
    switch (req.url) {
        case '/dog.jpg':
            return res.sendFile(path.join(__dirname, 'dog.jpg'))
        case '/slide':
            return res.redirect('https://docs.google.com/presentation/d/1Ryo64FmYSiQPRT7CdavwOkevNBikc4mjkoVOKcrZCEw/edit?usp=sharing')
        default:
            const imgBinary = Buffer.alloc(6, '47494638396101000100800000dbdfef00000021f90401000000002c00000000010001000002024401003b', 'hex');
            res.write(imgBinary)
            res.send();
    }
})

const insert = async (req) => {
    const db = await MongoClient.connect(require(`./config/database`),
        { useNewUrlParser: true })
    const dbo = db.db('canary_tokens')
    await dbo.collection('tokens').insertOne({
        route: req.url,
        address: req.connection.localAddress,
        date: new Date(),
        cookies: req.cookies,
        headers: req.headers,
        hostname: req.hostname,
        ipInfo: req.ipInfo
        // connection:JSON.stringify(req.connection),
    })
    db.close()
}

app.listen(process.env.PORT || 3000, console.log('server up'))
