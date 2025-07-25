import connection from '../libs/db.js'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({ path: 'a.env' })
const saltRounds = 10
const expirationTime = '12h'

class AuthenticationService {
  async findUser(username) {
    try {
      const [data] = await connection.execute(
        'SELECT * FROM users WHERE username=?',
        [username]
      )
      if (data[0]) {
        return data
      }
      return false
    } catch (e) {
      console.log(e)
    }
  }

  processPassword(password) {
    try {
      const hash = bcrypt.hashSync(password, saltRounds)
      return hash
    } catch (e) {
      console.log(e)
    }
  }

  verifyPassword() {}

  async addUser(username, password) {
    try {
      if (await this.findUser(username)) {
        throw new Error('El usuario ya existe')
      }
      const userId = uuidv4()
      const securePassword = this.processPassword(password)
      console.log(securePassword)
      console.log('USER ID: ', userId)
      connection.execute(
        'INSERT INTO users (id_user, username, password) VALUES(?, ?, ?)',
        [userId, username, securePassword]
      )
    } catch (e) {
      console.log(e)
    }
  }

  async logIn(username, password) {
    try {
      const data = await this.findUser(username)
      if (data[0]) {
        const isLoged = await bcrypt.compare(password, data[0].password)
        if (isLoged) {
          console.log('Te logeaste correctamente')
          return true
        } else {
          return false
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  getToken(objToSign) {
    const privateKey = process.env.PRIVATE_KEY
    const hash = jwt.sign(objToSign, privateKey, { expiresIn: expirationTime })
    return hash
  }
}
export default AuthenticationService
