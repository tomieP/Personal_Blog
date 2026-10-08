import prisma from "../../../config/prisma.js"

const findByEmail = async (email) =>{
    return await prisma.user.findUnique({
        where: {email}
    });
};

const findByUsername = async (username) => {
    return await prisma.user.findUnique({
        where: {username}
    })
}

const create = async (userData) =>{
    return await prisma.user.create({
        data: userData
    });
};

export default {
    findByEmail,
    findByUsername,
    create
}