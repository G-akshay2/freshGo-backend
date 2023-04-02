import { registerAs } from "@nestjs/config";

export const JWT_CONFIG = registerAs("JWT", () => {
  return {
    sercretToken: process.env.JWT_SECRET,
    expiryTime: process.env.JWT_EXPIRE_TIME
  };
});
