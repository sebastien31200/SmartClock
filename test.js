var lights = require("./controllers/lights.js");

require("dotenv").config({ path: `vue-app/.env.${process.env.NODE_ENV}` });

lights.setAllLightsStatus({ on: false, bri: 100 }, null);
