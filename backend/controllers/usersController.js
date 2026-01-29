import { UsersModel } from "../models/usersModel.js";

export const getUsers = async (req, res) => {
    const array = await UsersModel.find({}).select('fullName')
    res.send(array)
}
