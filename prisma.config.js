const { defineConfig, env } = require("prisma/config");

require("dotenv").config();

module.exports = defineConfig({
   schema: "prisma/schema.prisma",
   datasource: {
      url: env("DATABASE_URL"),
   },
   generators: [
      {
         provider: "prisma-client",
         output: "../src/generated/client",
      },
   ],
});
