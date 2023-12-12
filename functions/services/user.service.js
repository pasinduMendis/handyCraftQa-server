const User = require("../models/User.model");
const { isDataMatch } = require("../utils/encryption.util");
const { isValidId } = require("./utils");

const get = async (id) => {
    try {
        isValidId(id);
        const user = await User.findById(id);
        if (!user) {
            throw new Error("Account not found");
        }
        return user;
    } catch (error) {
        throw new Error(error);
    }
};

const isExist = async (id) => {
    try {
        isValidId(id);
        const user = await User.findById(id);
        if (user) {
            return true;
        }
        return false;
    } catch (error) {
        throw new Error(error);
    }
};

const isExistForEmail = async (email) => {
    try {
        const user = await User.findOne({ "email.email": email });
        if (user) {
            return true;
        }
        return false;
    } catch (error) {
        throw new Error(error);
    }
};

const getAll = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        throw new Error(error);
    }
};

const create = async (data, password) => {
    try {
        const isExist = await isExistForEmail(data.email.email);
        if (isExist) {
            throw new Error("User already exists for email " + data.email.email);
        }

        const user = await User.create({
            ...data,
            password,
        });
        return user;
    } catch (error) {
        throw new Error(error);
    }
};

const update = async (data) => {
    try {
        isValidId(data.id);
        const exist = await isExist(data.id);
        if (!exist) {
            throw new Error("User not found for the uid " + data.id);
        }
        const user = await User.findByIdAndUpdate(data.id, data, {
            new: true,
        });
        if (user) {
            return user;
        }
        throw new Error("Error while updating the user");
    } catch (error) {
        throw new Error(error);
    }
};

const remove = async (id) => {
    try {
        isValidId(id);
        const exist = await isExist(id);
        if (!exist) {
            throw new Error("User not found for the uid " + id);
        }
        const user = await User.findByIdAndDelete(id);
        if (user) {
            return user;
        }
        throw new Error("Error while deleting the user");
    } catch (error) {
        throw new Error(error);
    }
}

const login = async (email, password) => {
    try {
        const isExist = await isExistForEmail(email);
        if (!isExist) {
            throw new Error("No user exists for email " + email);
        }

        const user = await User.findOne({ "email.email": email });
        if (!user) {
            throw new Error("No user exists for email " + email);
        }

        const isMatch = await isDataMatch(password, user.password);

        if (isMatch) {
            return user;
        }
        throw new Error("Wrong password");
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    userService: {
        get,
        getAll,
        create,
        update,
        remove,
        login,
        isExist,
        isExistForEmail,
    },
};