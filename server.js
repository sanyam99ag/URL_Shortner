const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const ShortenUrl = require('./models/shortenUrl')
const app = express()


mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser : true,
    useUnifiedTopology: true
})

app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }))

app.get('/' , async (req, res) => {
    const shortUrls =  await ShortenUrl.find()
    res.render('index', {shortUrls: shortUrls})

})

app.post('/shortenUrl',async (req, res) => {
    const check = await ShortenUrl.exists({full: req.body.fullUrl})
    if(check == false)
    {
        await ShortenUrl.create( { full: req.body.fullUrl })
    }
    

    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortenUrl.findOne( {short: req.params.shortUrl})

    if(shortUrl == null)    return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(5000, () => console.log('Listeninig on Port 3000'));
// app.listen(process.env.PORT || 5000);