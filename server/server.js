const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
mongoose.connect(`mongodb+srv://nikunj05108:${process.env.MONGO_DB_URL_PASSWORD}@cluster0.yt6sk7x.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser : true,
    useUnifiedTopology : false,
})
.then(() => {
    console.log('DB Connected');
})
.catch(err => console.log(err))

const authRoutes = require('./routes/auth')

app.use(morgan('dev'))
app.use(express.json())
// app.use(cors())

if(process.env.NODE_ENV == 'development') {
    app.use(cors({origin : `http://localhost:3000`}))
}

app.use('/api', authRoutes)



const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`${port} - ${process.env.NODE_ENV}`);
})