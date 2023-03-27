const express = require ('express')
const app = express()
app.get('',(req, res) => {
    res.send('hello!')
})
app.listen(8000, err => {
    if (err) console.log(err)
})