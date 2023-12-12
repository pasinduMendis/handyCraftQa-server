const Order = require('../models/Order.model');
const { isValidId } = require('./utils');

const get = async (id) => {
    try {
        isValidId(id);
        const order = await Order.findById(id);
        if (order) {
            return order;
        }
        throw new Error('Order not found');
    } catch (error) {
        throw new Error(error);
    }
};

const isExist = async (id) => {
    try {
        isValidId(id);
        const order = await Order.findById(id);
        if (order) {
            return true;
        }
        return false;
    } catch (error) {
        throw new Error(error);
    }
};

const getAll = async () => {
    try {
        const orders = await Order.find();
        if (orders) {
            return orders;
        }
        throw new Error('Orders not found');
    } catch (error) {
        throw new Error(error);
    }
};

const create = async (data) => {
    try {
        const order = await Order.create(data);
        return order;
    } catch (error) {
        throw new Error(error);
    }
};

const update = async (data) => {
    try {
        const order = await Order.findByIdAndUpdate(data.id, data, {
            new: true,
        });
        if (order) {
            return order;
        }
        throw new Error('Error while updating order');
    } catch (error) {
        throw new Error(error);
    }
};

const remove = async (id) => {
    try {
        isValidId(id);
        const exists = await isExist(id);
        if (exists) {
            throw new Error('Order not found');
        }
        await Order.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = { orderService: { get, getAll, create, update, remove } };