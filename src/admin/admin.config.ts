import { registerAs } from "@nestjs/config";

export const ADMIN_CONFIG = registerAs("ADMIN", () => {
  return {
      UESRNAME: "username",
      PASSWORD: "password",
  };
});
