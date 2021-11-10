require('dotenv').config()
const validator = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Pool = require('pg').Pool
const pool = new Pool({user: process.env.PG_USER, host: process.env.PG_HOST, database: process.env.PG_DATABASE, password: process.env.PG_PASSWORD, port: process.env.PG_PORT});

const login = async (req, res) => {
    const errors = validator.validationResult(req)
    if(!errors.isEmpty()) return res.status(400).json({error: errors.array()})
    const {email, password} = req.body
    const command = `select * from users where email = '${email}'`
    await pool.query(command, async (err, result) => {
        if(err) console.log(err)
        else {
            if(!result.rows.length) res.json({error: 'Such user does not exist'})
            else {
                const isMatch = await bcrypt.compare(password, result.rows[0].password)
                if(isMatch) {
                    const accessToken = jwt.sign({email}, process.env.JWT_ACCESS_SECRET, {expiresIn: "1h"})
                    // const refreshToken = jwt.sign({email}, process.env.JWT_REFRESH_SECRET, {expiresIn: "7d"})
                    // res.cookie('jid', refreshToken, {httpOnly: true})
                    res.json({message: 'Logged in', accessToken})
                } else {res.json({error: 'Wrong password'})}}
        }
    })
}

const refreshToken = (req, res) => {
    const token = req.cookies.jid
    if (!token) return res.json({error: 'Error'})
    try {
        const validate = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
        res.json({accessToken: jwt.sign({email: validate.email}, process.env.JWT_ACCESS_SECRET, {expiresIn: '1m'})})
    } catch (e) {throw new Error(e)}
}

const register = async (req, res) => {
    const errors = validator.validationResult(req)
    if(!errors.isEmpty()) return res.status(400).json({error: errors.array()})
    const {email, password, username} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const command = `insert into users(email, username, password, created) VALUES ('${email}', '${username}', '${hashedPassword}', current_timestamp)`
    await pool.query(command, (err, result) => {
        err ? res.json({error: err.detail}) : res.json({message: 'User created!'})})
}

const getUsers = async (req, res) => {
    await pool.query('select * from users', (err, result) => {
        if(err) res.json({error: err.detail})
        else res.json({users: result.rows})
    })
}

module.exports = {login, register, getUsers, refreshToken}