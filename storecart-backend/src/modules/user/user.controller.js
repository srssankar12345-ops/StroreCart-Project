const userService = require("./user.service");
const { success, fail } = require("../../utils/response");

async function signup(req, res, next) {
  try {

    const { email, password, name } = req.body;
    if (!email || !password) return fail(res, "Email & password required", 400);
    const user = await userService.signup({ email, password, name });
    return success(res, { user }, "User created", 201);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { accessToken, user } = await userService.login({ email, password }, res);
    return success(res, { accessToken, user }, "Logged in");
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const cookieName = process.env.COOKIE_NAME || "storecart_rt";
    const rt = req.cookies[cookieName];
    const data = await userService.refresh({ cookieRefreshToken: rt }, res);
    return success(res, { accessToken: data.accessToken, user: data.user }, "Token refreshed");
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const cookieName = process.env.COOKIE_NAME || "storecart_rt";
    const rt = req.cookies[cookieName];
    await userService.logout({ cookieRefreshToken: rt }, res);
    return success(res, {}, "Logged out");
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login, refresh, logout };
