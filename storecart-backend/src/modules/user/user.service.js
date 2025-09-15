import prisma from '../../config/db.js';
import redisClient from '../../config/redis.js'
import { hashPassword, comparePassword } from '../../utils/password.js';


export const registerUser = async (email, password, name) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('Email already registered');

  const hashedPassword = await hashPassword(password);

  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
};


export const loginUser = async (id, email, password) => {
  const redisKey = `session:${id}`;
console.log(`session:${id}` )
  const cachedUser = await redisClient.get(redisKey);
  if (cachedUser) {
    const user = JSON.parse(cachedUser);
    console.log(`User : ${user}`)
    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new Error('Invalid email or password');

    console.log(`Redis hit -> user:${email}`);
    return user;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid email or password');

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error('Invalid email or password');

  console.log(`Redis miss -> user:${email}, saving to cache`);

  // // 3. Save in Redis (mask sensitive data if needed)
  // await redisClient.set(redisKey, JSON.stringify(user), {
  //   EX: 60 * 60, // 1 hour
  // });

  return user;
};
