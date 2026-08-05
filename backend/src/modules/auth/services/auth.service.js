const register = async (registerData) => {
    return{
        success: true,
        message: "service OK",
        data: registerData
    };
};

export default{
    register
};