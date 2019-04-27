const app = require('express')() // express server
const expressip = require('express-ip') // lib for more user info
const MongoClient = require('mongodb').MongoClient // MongoDB driver
const path = require('path') // native path controll driver
const slideLink = 'https://docs.google.com/presentation/d/1Ryo64FmYSiQPRT7CdavwOkevNBikc4mjkoVOKcrZCEw/edit?usp=sharing'
const base64string = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
const gitLink = 'https://github.com/wilkerHop/canary_tokens'

app.use(expressip().getIpInfoMiddleware) // configures express-ip into express

app.get('**', async (req, res) => {
  await insert(req) // inserts request into database
  switch (req.url) { // checks url
    case '/dog.jpg':
      const dog = path.join(__dirname, 'dog.jpg')
      return res.sendFile(dog) // renders an image
    case '/slide':
      return res.redirect(slideLink) // redirects to another external link
    case '/git':
      return res.redirect(gitLink) // redirects to another external link
    default:
      res.write(
        Buffer.alloc(
          base64string.length,
          base64string,
          'base64'
        )
      )
      return res.send()
  }
})

const insert = async req => {
  const insert = { // inserts
    route: req.url, // access route,
    address: req.connection.localAddress, // ip v6 of the request,
    date: new Date(), // timestamp of the access,
    cookies: req.cookies, // cookies, if any,
    headers: req.headers, // headers, incluing user-agent,
    hostname: req.hostname, // this server domain,
    ipInfo: req.ipInfo // and express-ip juice
  }

  const con = await MongoClient.connect(require(`./config/database`), // connects to mLab
    { useNewUrlParser: true }) // using safer url parser
  await con.db('canary_tokens').collection('tokens').insertOne(insert);
  con.close() // closes the connection with mLab
}

app.listen(process.env.PORT || 3000, console.log('server up')) // starts the server
