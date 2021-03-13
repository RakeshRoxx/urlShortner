const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


app.set('view engine', 'ejs')
app.use(express.urlencoded({
    extended: false
}))

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', {
        shortUrls: shortUrls
    });
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({
        full: req.body.fullUrl
    })
    res.redirect('/')
})

app.get('/:url', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({
        short: req.params.url
    })
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)
})

app.listen(3000, (req, res) => {
    console.log("Listening on 3000");
});