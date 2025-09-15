import { sendResponse } from '../../utils/respons.js';
import { registerUser, loginUser } from './user.service.js';
import { signToken } from '../../utils/jwt.js';
import redisClient from '../../config/redis.js';

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, null, 'Email and password required');
    }

    const user = await registerUser(email, password, name);

    sendResponse(res, 201, { id: user.id, email: user.email, name: user.name }, 'User registered successfully');
  } catch (error) {
    sendResponse(res, 400, null, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const {id, email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, null, 'Email and password required');
    }

    const user = await loginUser(id,email, password);
    console.log(id,email, password)

    const token = signToken({ id: user.id, email: user.email });

    await redisClient.set(
      `session:${user.id}`,
      JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role,
        loginAt: Date.now(),
      }),
      { EX: 60 * 60 * 24 } // 1 day expiry
    );

    sendResponse(res, 200, { token, user: { id: user.id, email: user.email, name: user.name } }, 'Login successful');
  } catch (error) {
    sendResponse(res, 401, null, error.message);
  }
};