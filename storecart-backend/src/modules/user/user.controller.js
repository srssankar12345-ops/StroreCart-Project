import { sendResponse } from '../../utils/respons.js';
import { registerUser, loginUser } from './user.service.js';
import { signToken } from '../../utils/jwt.js';

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
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, null, 'Email and password required');
    }

    const user = await loginUser(email, password);

    const token = signToken({ id: user.id, email: user.email });

    sendResponse(res, 200, { token, user: { id: user.id, email: user.email, name: user.name } }, 'Login successful');
  } catch (error) {
    sendResponse(res, 401, null, error.message);
  }
};