import { StatusCodes } from 'http-status-codes';
import {
  buildError,
  buildNext,
  buildOrders,
  buildReq,
  buildRes,
} from 'test/builders';
import * as validator from 'express-validator';
import { index, validate } from './orders.controller';

jest.mock('express-validator');

describe('Controllers > orders', () => {
  it('should return 200 and a list of orders', async () => {
    const req = buildReq();
    const res = buildRes();
    const next = buildNext();
    const orders = buildOrders();

    jest.spyOn(req.service, 'listOrders').mockReturnValueOnce(orders);

    await index(req, res, next);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ orders });

    expect(req.service.listOrders).toHaveBeenCalledTimes(1);
    expect(req.service.listOrders).toHaveBeenLastCalledWith(req.user.id);
  });

  it('should forward an error when service.listOrder fails', async () => {
    const req = buildReq();
    const res = buildRes();
    const next = buildNext();
    const error = buildError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Some error message',
    );

    jest.spyOn(req.service, 'listOrders').mockRejectedValueOnce(error);

    await index(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should return 200 and a list of orders', () => {});

  it('should return error when service.listOrder fails', () => {});

  it('should build a list of errors', () => {
    const method = 'create';
    const existsFn = jest
      .fn()
      .mockReturnValueOnce(`Please provide a list of products`);

    jest.spyOn(validator, 'body').mockReturnValueOnce({
      exists: existsFn,
    });

    const errors = validate(method);

    expect(errors).toHaveLength(1);
    expect(errors).toEqual(['Please provide a list of products']);
    expect(validator.body).toHaveBeenCalledTimes(1);
    expect(validator.body).toHaveBeenCalledWith(
      'products',
      'Please provide a list of products',
    );
  });

  fit('should throw an error when an unknow method is provided', () => {
    expect(() => {
      validate('some unknow method');
    }).toThrowError('Please provide a valid method name');
  });
});
