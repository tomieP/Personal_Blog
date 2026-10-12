import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authRepository from '../repositories/auth.repository.js';
import env from "../../../config/env.js";
import { ConflictError, UnauthorizedError } from "../../../utils/errors/AppError.js";

const register = async (registerData) => {
    const existingEmail = await authRepository.findByEmail(registerData.email);
    if (existingEmail) {
        throw new ConflictError("Email already exists");
    }

    const existingUsername = await authRepository.findByUsername(registerData.username);
    if (existingUsername) {
        throw new ConflictError("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(registerData.password, env.bcryptSaltRounds);

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
    const createdUser = await authRepository.findByEmail(loginData.email);
    if (!createdUser) {
        throw new UnauthorizedError("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(loginData.password, createdUser.hashPassword);
    if (!isMatch) {
        throw new UnauthorizedError("Invalid credentials");
    }

    const token = jwt.sign(
        {
            id: createdUser.id,
            role: createdUser.role
        },
        env.jwtSecret,
        {
            expiresIn: env.jwtExpiresIn
        });

    const {hashPassword,...userWithoutPassword} = createdUser;
    return{ token,
            createdUser: userWithoutPassword};
};

export default {
    register,
    login
};