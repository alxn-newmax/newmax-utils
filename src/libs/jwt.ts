import moment from 'moment';
import jwt from 'jsonwebtoken';
import {ApiError} from '../ApiError';
import { encryptData } from './crypto';

const typeTime = {
  days: 'd',
  minutes: 'm',
  seconds: 's',
};

// const secretKey = process.env.JWT_SECRET_KEY || 'secret001';
const expiresDays = 30;

type OptionsType = {
  type: 'days' | 'minutes' | 'seconds';
  expiredAt: number;
}

const healthToken = async (accessToken: string, secretKey: string) => {
  const decodedToken = jwt.verify(accessToken, secretKey);

  if (!decodedToken || decodedToken instanceof jwt.JsonWebTokenError) {
    return false;
  }

  return true;
};

export const signToken = async (data: object, secretKey: string, options: OptionsType) => {
  if (!typeTime[options.type]) {
    return {
      error: {
        message: 'This time type is not supported',
        description: `Supported types: ${Object.keys(typeTime).join(', ')}`,
      },
    };
  }

  try {
    const payload = encryptData(JSON.stringify(data), secretKey);

    const accessToken = jwt.sign({ payload }, secretKey, {
      expiresIn: `${options.expiredAt}${typeTime[options.type]}`,
    });
    const refreshToken = jwt.sign({ payload }, secretKey, {
      expiresIn: `${expiresDays}d`,
    });

    const accessTokenExpired = moment().add(options.expiredAt, options.type);
    const refreshTokenExpired = moment().add(expiresDays, 'days');

    return {
      data: {
        accessToken,
        refreshToken,
        accessTokenExpired,
        refreshTokenExpired,
      },
    };
  } catch (e) {
    return { error: new ApiError(401, 'Generate accessToken and refreshToken failed') };
  }
};

export const verifyToken = async (accessToken: string, secretKey: string) => {
  try {
    const data = jwt.verify(accessToken, secretKey);
    return { data };
  } catch (e) {
    return { error: new ApiError(401, 'Verified accessToken expired or invalid') };
  }
};

export const refreshToken = async (accessToken: string, refreshToken: string, secretKey: string,  options: OptionsType) => {
  if (!typeTime[options.type]) {
    throw new ApiError(400, 'This time type is not supported', { description: `Supported types: ${Object.keys(typeTime).join(', ')}` });
  }

  try {
    let data;

    if (!accessToken || !refreshToken) {
      throw new ApiError(400, 'AccessToken and RefreshToken not found');
    }

    const decodedAccessToken = jwt.decode(accessToken) as {payload: any, exp: number};
    const decodedRefreshToken = jwt.decode(refreshToken) as {payload: any, exp: number};

    if (!!healthToken(accessToken, secretKey)) {
      const newAccessToken = jwt.sign({ payload: decodedAccessToken.payload }, secretKey, {
        expiresIn: `${options.expiredAt}${typeTime[options.type]}`,
      });
      const newRefreshToken = jwt.sign({ payload: decodedRefreshToken.payload }, secretKey, {
        expiresIn: `${expiresDays}d`,
      });

      const accessTokenExpired = moment().add(options.expiredAt, options.type);
      const refreshTokenExpired = moment().add(expiresDays, 'days');

      data = {
        status: 'AccessToken and RefreshToken has been updated',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenExpired,
        refreshTokenExpired,
      };
    } else {
      const accessTokenExpired = moment(decodedAccessToken.exp, 'X').format();
      const refreshTokenExpired = moment(decodedRefreshToken.exp, 'X').format();

      data = {
        status: 'AccessToken and RefreshToken is health. Returned is old tokens',
        accessToken,
        refreshToken,
        accessTokenExpired,
        refreshTokenExpired,
      };
    }

    return { data };
  } catch (e) {
    return { error: new ApiError(401, 'Generate new accessToken and refreshToken failed') };
  }
};
