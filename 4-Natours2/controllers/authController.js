const User = require('../model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1]Check if email and passowrd exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //2]Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  // console.log(user);
  const correct = await user.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //3]If everything is ok,send token to client
  const token = signToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
  });
});

//AUTHORIZATION
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //Getting token and checking if its there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);
  if (!token) {
    return next(
      new AppError('You are not logged in!Please log in to get access.', 401)
    );
  }

  //Verfication token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  //Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('The user belonging to this token does not exist.', 401)
    );
  }

  //Check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password.Please login again', 401)
    );
  }

  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You dont have the permission to perform this action.',
          403
        )
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get User from posted email
  const user = await User.findOne({ email: req.body.email });
  // console.log(user);
  if (!user) {
    return next(new AppError('There is no user with this email address.', 404));
  }

  //Generate random token
  const token = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  console.log(token);

  //Send token using reset password route
  const reseturl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetpassword/${token}`;

  const message = `Forgot your password? Reset your password by clicking on this link: ${reseturl}\nIf you didnt forget your password ,please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password resert url(Valid for next 10 mins!)',
      message,
    });
    res
      .status(200)
      .json({ status: 'success', message: 'Reset url sent successfully' });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email.Try again later!', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {});
