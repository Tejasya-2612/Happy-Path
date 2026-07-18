import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { sanitizeObject } from '../utils/sanitize.js';
import { createToken } from '../utils/token.js';

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email
  };
}

export async function register(req, res, next) {
  try {
    const payload = sanitizeObject(req.body, ['name', 'email', 'password']);
    const existingUser = await User.findOne({ email: payload.email.toLowerCase() }).select('+password');

    if (existingUser) {
      existingUser.name = payload.name;
      existingUser.password = payload.password;
      await existingUser.save();

      const token = createToken(existingUser._id);

      res.status(200).json({
        token,
        user: publicUser(existingUser),
        message: 'Account password updated'
      });
      return;
    }

    const user = await User.create(payload);
    const token = createToken(user._id);

    res.status(201).json({ token, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const payload = sanitizeObject(req.body, ['email', 'password']);
    const user = await User.findOne({ email: payload.email.toLowerCase() }).select('+password');

    if (!user || !(await user.verifyPassword(payload.password))) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = createToken(user._id);

    res.status(200).json({ token, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}
