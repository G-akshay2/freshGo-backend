import { registerAs } from "@nestjs/config";

export const DATABASE_CONFIG = registerAs("DATABASE", () => {
  return {
      UESRNAME: process.env["DB_USERNAME"],
      PASSWORD: process.env["DB_PASSWORD"],
      DBNAME: "freshgo",
      get url() {
        return `mongodb+srv://${this.UESRNAME}:${this.PASSWORD}@freshgo.iee4uaz.mongodb.net/${this.DBNAME}?retryWrites=true&w=majority`
      },
      isLocal() {
        return process.env["LOCAL"];
      }
  };
});
