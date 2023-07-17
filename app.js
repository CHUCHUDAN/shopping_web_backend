if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const session = require('express-session')
const cors = require('cors')
const passport = require('./config/passport')
const SESSION_SECRET = process.env.SESSION_SECRET

// const corsOptions = {
//   origin: [
//     process.env.GITHUB_PAGE,
//     'http://localhost:3000'
//   ],
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//   allowedHeaders: ['Content-Type', 'Authorization']
// }

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

require('./routes')(app)

app.listen(port, () => {
  console.info(`Example app listening on http://localhost:${port}`)
})
