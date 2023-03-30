export const APP_CONFIG = () => {
  return {
    JWT: {
      sercretToken: process.env["JWT_SECRET"],
      expiryTime: process.env["JWT_EXPIRE_TIME"]
    },
    DB: {
      UESRNAME: process.env["DB_USERNAME"],
      PASSWORD: process.env["DB_PASSWORD"],
    }
  };
};
