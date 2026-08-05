import { email } from "zod";
import prisma from "../../../config/prisma.js"
const findByEmail = async (email) =>{
    return await prisma.User.findUnique({
        where: {email}
    });
};

const create = async (userData) =>{

};

export default {
    findByEmail,
    create
}