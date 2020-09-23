const jwt = require('jsonwebtoken');
const rescue = require('express-rescue');
const Boom = require('boom');

const { usersServices } = require('../services');

const { SECRET = 'preguicaDeCriarUmSegredo' } = process.env;

const options = {
  expiresIn: '1d',
  algorithm: 'HS256',
};

const login = rescue(async (req, res, next) => {
  const { email, password: reqPassword } = req.body || {};

  const { error } = usersServices.loginSchema.validate({ email, password: reqPassword });

  if (error) return next(Boom.unauthorized('email ou senha inválido'));

  const { password, ...user } = await usersServices.getUserByEmail(email) || {};

  if (reqPassword !== password) return next(Boom.unauthorized('email ou senha inválido'));

  try {
    const token = jwt.sign(user, SECRET, options);

    return res.status(200).json({ token });
  } catch (err) {
    return next(Boom.unauthorized('aqui email ou senha invalido'));
  }
});

const getUser = rescue(async (req, res, next) => {
  const { email } = req.user;

  const { password, ...user } = await usersServices.getUserByEmail(email);

  if (!user) return next(Boom.unauthorized('autenticacao invalida'));
  return res.status(200).json({ ...user });
});

const validate = (req, _res, next) => {
  const { email, name, password, role } = req.body;

  if (!email || !name || !password) return next(Boom.badData('Faltando informacoes'));

  const { error, value } = usersServices.userSchema.validate({ email, name, password, role });

  if (error) return next(Boom.badData(error));

  req.validated = value;
  return next();
};

const register = rescue(async (req, res, next) => {
  const { email, password, role, name } = req.validated;

  const { id } = await usersServices.getUserByEmail(email);

  if (id) return next(Boom.conflict('email ja existe'));

  const newUser = await usersServices.createUser({ email, name, password, role });

  res.status(200).json({ ...newUser });
});

const changeUser = rescue(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.user;

  const { error } = usersServices.nameSchema.validate(name);

  if (error) return next(Boom.badData(error));
  const changedUser = await usersServices.changeUserName(name, { id });

  if (changeUser.error) return next(Boom.internal(error));

  return res.status(200).json({ ...changedUser });
});

module.exports = {
  login,
  getUser,
  validate,
  register,
  changeUser,
};
