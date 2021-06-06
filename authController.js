const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require ('express-validator');
const { secret } = require('./config')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h" })
}

class authController {
    async registration(req, res) {
         try {
             const errors = validationResult(req)
             if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Registration error ', errors })
             }
            const {username, password} = req.body;
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: "Current user is already exist in DB"})
            }
            const hashPassword = bcrypt.hashSync(password, 7); //Make hashpass 1.User pass, 2. Salt
            const userRole = await Role.findOne({value: "USER"}) //Get user role from DB 
            const user = new User( {username, password: hashPassword, roles: [userRole.value]} )
            await user.save()
            return res.json({message: "User has been successfully registered"})
         } catch (error) {
            console.log(error)
            res.status(400).json( {message:'Registration error'})
         }
    }
    async login(req, res) {
        try {
             const {username, password} = req.body;
             const user = await User.findOne({username})
             if (!user) {
                 return res.status(400).json({message: `User ${username} not found.`})
             }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: 'Not valid password'})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token})   // return token to client
        } catch (error) {
            console.log(error)
            res.status(400).json( {message:'Login error'})
        }
    }
    async getUsers(req, res) {
        try {
            // Hardcode for fast creating roles in DB
            // const userRole = new Role()
            // const adminRole = new Role({value:"ADMIN"})
            // await  userRole.save()
            // await  adminRole.save()
            const users = await User.find() 
            res.json(users)
            
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new authController()