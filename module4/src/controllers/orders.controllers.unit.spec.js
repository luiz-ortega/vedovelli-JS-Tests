import { StatusCodes } from 'http-status-codes';
import {
  buildError,
  buildNext,
  buildOrders,
  buildReq,
  buildRes,
} from 'test/builders';
import { index } from './orders.controller';

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

  fit('should forward an error when service.listOrder fails', async () => {
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
});
