import prisma from "../../../config/prisma.js"

const findByEmail = async (email) =>{
    return await prisma.User.findUnique({
        where: {email}
    });
};

const findByUsername = async (username) => {
    return await prisma.User.findUnique({
        where: {username}
    })
}

const create = async (userData) =>{
    return await prisma.User.create({
        data: userData
    });
};

export default {
    findByEmail,
    findByUsername,
    create
}