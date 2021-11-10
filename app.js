const express = require('express')
const authRouter = require('./routers/auth')
const recipeRouter = require('./routers/recipe')
require('dotenv').config()
const cors = require('cors')

const app = express()
app.use(cors({origin: '*', credentials: true, optionSuccessStatus: 200}))
app.listen(process.env.PORT || 3000, () => console.log('Server started'))

app.use('/api', authRouter)
app.use('/recipe', recipeRouter)