// server.js
const { app, startServer } = require("./index.js");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger");

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc, {
    swaggerOptions: {
      persistAuthorization: true,
      requestInterceptor: (req) => {
        // Force-add Authorization so see it in Network tab (f12)
        const h = req.headers.Authorization || req.headers.authorization || "";
        if (h && !h.startsWith("Bearer ")) {
          req.headers.Authorization = `Bearer ${h}`;
        } else if (h) {
          req.headers.Authorization = h;
        }
        return req;
      },
    },
  })
);

startServer();
