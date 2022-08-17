

import { Context, helpers } from "../../deps.ts";
import logger from "../middlewares/logger.ts";

import dbConn from "../middlewares/mongo.conn.ts";

const prods = dbConn.collection('prods');

export const findAll = async (ctx: Context) => {
    try {
        ctx.response.status = 200;
        logger.debug(`status: ${ctx.response.status} method: findAll handler`);

        const resprods = await prods.find({}).toArray();
        ctx.response.body = await {code: '00', data: resprods};
    } catch (error) {
        ctx.response.status = 500;

        logger.error(`status: ${ctx.response.status} ${error}`);
        ctx.response.body = {code: '99', msg: error};
    }
}

export const findProd= async (ctx: Context) =>{
    try {
        const { prodId } = helpers.getQuery(ctx, {mergeParams: true});
        const prodRestuly = await prods.findOne({uuid:prodId})

        if (prodRestuly) {
            ctx.response.body = await {code: '00', data: prodRestuly};
        } else {
            ctx.response.body = await {code: '01', msg: `Usuario con id ${prodId} no encontrado.`};
        }
    } catch (error) {
        ctx.response.status = 500;

        logger.error(`status: ${ctx.response.status} ${error}`);
        ctx.response.body = {code: '99', msg: error};
    }
}

export const createProd = async (ctx: Context ) => {
    try {
        ctx.response.status = 201;
        logger.debug(`status: ${ctx.response.status} method: createUser handler`);

        const { name, description, stock, image } = await ctx.request.body().value;
        
        const resprods = await prods.find({}).toArray();

        let newId = 0;
        if (resprods.length > 0) {
            newId = Number(resprods[resprods.length - 1].uuid) + 1;                   
        } else {
            newId = 1;
        }

        const prod = {
            uuid: newId.toString(),
            name: name,
            description: description,
            stock: stock,
            image: image
           
        }
        await prods.insertOne(prod);

        ctx.response.body = await {code: '00', data: prod};
    } catch (error) {
        ctx.response.status = 500;

        logger.error(`status: ${ctx.response.status} ${error}`);
        ctx.response.body = {code: '99', msg: error};
    }
}

