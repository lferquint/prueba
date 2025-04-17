import express from 'express'
import pdfRouter from './routes/pdf.routes.js'
import prueba from './routes/dbGetDataProducts.routes.js'
import addRegisters from './routes/addRegisters.routes.js'
import authenticationMiddleWare from './middlewares/authentication.middleware.js'
import login from './routes/authentication.routes.js'
import deleteRegisters from './routes/deleteRegisters.routes.js'
import modifyRegisters from './routes/modifyRegisters.routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

const PORT = 3000

app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)

app.use(express.json())
app.use(pdfRouter, login, prueba)
app.use('/protected', authenticationMiddleWare)
app.use('/protected', addRegisters)
app.use('/protected', deleteRegisters)
app.use('/protected', modifyRegisters)
app.use(express.static('src/public'))

app.listen(PORT)
console.log('Server on port 3000')
/*
  console.log()
*/
