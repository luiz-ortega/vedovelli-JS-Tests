import { appError } from '@/utils';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { get } from './user.middleware';
import * as service from '@/database/service';
import { buildNext, buildRes, buildReq, buildError } from 'test/builders';

jest.mock('@/database/service');

describe('Middleware => User', () => {
  const error = buildError(
    StatusCodes.UNPROCESSABLE_ENTITY,
    `${ReasonPhrases.UNPROCESSABLE_ENTITY}: header should contain a valid email`,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should foward an error when an email is NOT provided in the headers', () => {
    const req = buildRes({ headers: {} });
    const next = buildNext();
    const error = appError(
      `${ReasonPhrases.UNPROCESSABLE_ENTITY}: header should contain a valid email`,
      StatusCodes.UNPROCESSABLE_ENTITY,
    );

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should foward an error when an email is NOT provided in the headers but is invalid', () => {
    const req = buildRes({
      headers: {
        email: 'invalidEmail',
      },
    });
    const next = buildNext();

    get(req, null, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should return an user when email provided is valid', async () => {
    const req = buildReq();
    const next = buildNext();
    const email = req.headers.email;
    const resolved = {
      id: 1,
      email,
    };

    jest.spyOn(service, 'findOrSave').mockResolvedValueOnce([resolved]);

    await get(req, null, next);

    expect(req.user).toBeDefined();
    expect(req.user).toEqual(resolved);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(/* nothing */);
  });

  it('should foward an error when service.findOrSave fails', async () => {
    const req = buildReq();
    const next = buildNext();
    const email = req.headers.email;

    delete req.user;

    jest.spyOn(service, 'findOrSave').mockRejectedValueOnce('An error!');

    await get(req, null, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith('An error!');
  });
});
