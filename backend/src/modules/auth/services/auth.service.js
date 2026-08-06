import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authRepository from '../repositories/auth.repository.js';
import env from "../../../config/env.js"
const register = async (registerData) => {
    const existingUser = await authRepository.findByEmail(registerData.email);
    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(registerData.password, 10);

    const newUser = await authRepository.create({
        name: registerData.name,
        email: registerData.email,
        username: registerData.username,
        hashPassword: hashedPassword
    });

    const { hashPassword, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

const login = async (loginData) => {
    const user = await authRepository.findByEmail(loginData.email);
    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(loginData.password, user.hashPassword);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ id: user.id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn});

    return { token };
};

export default {
    register,
    login
};