const _env = {};

const properties = {
  writable: false,
  configurable: false,
  enumerable: false,
};

Object.freeze(properties);

Object.defineProperties(_env, {
  ORIGIN: { value: process.env.ORIGIN, ...properties },
  PORT: { value: process.env.PORT, ...properties },
  MONGODB_URI: { value: process.env.MONGODB_URI, ...properties },
  ACCESS_TOKEN_SECRET: {
    value: process.env.ACCESS_TOKEN_SECRET,
    ...properties,
  },
  ACCESS_TOKEN_EXPIRY: {
    value: process.env.ACCESS_TOKEN_EXPIRY,
    ...properties,
  },
  REFRESH_TOKEN_SECRET: {
    value: process.env.REFRESH_TOKEN_SECRET,
    ...properties,
  },
  REFRESH_TOKEN_EXPIRY: {
    value: process.env.REFRESH_TOKEN_EXPIRY,
    ...properties,
  },
  CLOUD_NAME: { value: process.env.CLOUD_NAME, ...properties },
  API_KEY: { value: process.env.API_KEY, ...properties },
  API_SECRET: { value: process.env.API_SECRET, ...properties },
});

const DB_NAME = "FlashCrowd";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

export { _env, DB_NAME, cookieOptions };
