import prisma from '../../config/db.js';
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

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  console.log(user)
  if (!user) throw new Error('Invalid email or password');

  const isValid = await comparePassword(password, user.password);
  console.log(isValid)
  if (!isValid) throw new Error('Invalid email or password');

  return user;
};