require('dotenv').config();

exports.config = {
  wakapiToken: process.env.WAKAPI_TOKEN,
  intervals: ['all_time', 'last_7_days'],
  intervalLabels: {
    all_time: 'All Time',
    last_7_days: 'Last Week'
  }
};
