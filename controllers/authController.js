const {promisify} = require('util');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/usersModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');


function sign_token (id) {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRE});
}

function send_token (user, statusCode, req, res) {
    const token = sign_token(user._id);
    
    
    res.cookie('jwt', token, {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
      });
    
    console.log(res);
    res.cookie('jwt', token, {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
      });
    
      // Remove password from output
      user.password = undefined;    

          res.status(200).json({
            status: 'success',
            data: user,
            token
       });
}

module.exports.signUp = asyncHandler(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        password_confirm: req.body.password_confirm
    });
    
    send_token(user, 200, req, res);
});

module.exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body ;
    if (!email || !password)
        return next(new AppError('both email and password must be provided'), 400);

    const user = await User.findOne({email}).select('+password');

    if (!user)
        return next(new AppError("Incorrect username or password"), 404);

    if (!user.passwordComparison(password, user.password))
        return next(new AppError("Incorrect username or password"), 404);
        console.log(user._id);
    send_token(user, 200, req, res);    
});

module.exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
        token = req.headers.authorization.split(' ')[1];
    else if (req.cookies.jwt)
        token = req.cookies.jwt;

    if (!token) {
        return next(new AppError('You are not logged in, Please login'), 401);
    }

    let decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    const user = await User.findById(decoded.id);

    if (!user) {
        return next(new AppError('User belonging to this token does not exist'), 401);
    }

    if(user.changePasswordAuthentication(decoded.iat)) {
        return next(new AppError('Password was changed, please login again'), 401);
    }
    req.user = user;
    next();
});















