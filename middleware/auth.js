const jwt = require('jsonwebtoken')

const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization
    if(!authorization) throw new Error('Not logged in')
    try{
        const token = authorization.split(' ')[1]
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        res.user = payload
    } catch (e) {throw new Error('Not logged in')}
    next()
}

module.exports = {isAuth}