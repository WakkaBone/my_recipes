const {Router} = require('express')
const authController = require('../controllers/auth')
const validator = require('express-validator')
const bodyParser = require('body-parser')
const middleware = require('../middleware/auth')

const authRouter = Router()

authRouter.use(bodyParser.json())
authRouter.use(bodyParser.urlencoded({extended: true}))

authRouter.post('/login', [
    validator.check('email', 'Please enter the valid email').isEmail(),
    validator.check('password', 'Please enter the password').notEmpty(),
    validator.check('password', 'Password cannot be shorter than 6 symbols').isLength({min: 6})
], authController.login)
authRouter.post('/register', [
    validator.check('email', 'Please enter the valid email').isEmail(),
    validator.check('username', 'Please enter your username').notEmpty(),
    validator.check('password', 'Please enter the password').notEmpty(),
    validator.check('password', 'Password cannot be shorter than 6 symbols').isLength({min: 6})
], authController.register)
authRouter.get('/users', authController.getUsers)

// authRouter.post('/refresh', authController.refreshToken)

module.exports = authRouter