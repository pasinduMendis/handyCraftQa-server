const { model } = require('mongoose');
const { orderService } = require('../services/order.service');
const { SuccessResponse, ErrorResponse } = require('../utils/response.util');
const { validateOrder } = require('../validation/order.schema');

const get = async (req, res) => {
    try {
        const order = await orderService.get(req.params.id);
        return new SuccessResponse(res).ok({ order: order.toModel() });
    } catch (error) {
        return new ErrorResponse(res).badRequest(error.message);
    }
};

const getAll = async (req, res) => {
    try {
        const orders = await orderService.getAll();
        return new SuccessResponse(res).ok({
            orders: orders.map((order) => order.toModel()),
        });
    } catch (error) {
        return new ErrorResponse(res).badRequest(error.message);
    }
};

const create = async (req, res) => {
    try {
        const { error, value } = validateOrder(req.body);
        if (error) {
            return new ErrorResponse(res).badRequest(error.message);
        }
        const order = await orderService.create(value);
        return new SuccessResponse(res).created({ order: order.toModel() });
    } catch (error) {
        return new ErrorResponse(res).badRequest(error.message);
    }
};

const update = async (req, res) => {
    try {
        const id = req.params.id;
        const { error, value } = validateOrder(req.body);
        if (error) {
            return new ErrorResponse(res).badRequest(error.message);
        }
        const order = await orderService.update({ ...value, id: id });
        return new SuccessResponse(res).created({ order: order.toModel() });
    } catch (error) {
        return new ErrorResponse(res).badRequest(error.message);
    }
};

const remove = async (req, res) => {
    try {
        await orderService.remove(req.params.id);
        return new SuccessResponse(res).ok();
    } catch (error) {
        return new ErrorResponse(res).badRequest(error.message);
    }
};

module.exports = {
    orderController: { get, getAll, create, update, remove },
};