const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).send({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  res.send({ email, password });
};

module.exports = { register, login };
