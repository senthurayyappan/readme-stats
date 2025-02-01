require('dotenv').config();

exports.config = {
  wakapiToken: process.env.WAKAPI_TOKEN,
  interval: process.env.INTERVAL
}; 