import { registerAs } from "@nestjs/config";

export const JWT_CONFIG = registerAs("JWT", () => {
  return {
    sercretToken: "Akshay",
    expiryTime: 432000
  };
});
