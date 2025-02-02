// Define a common set of system-safe fonts
const FONT_FAMILY = 'Arial, sans-serif';
const FONT_COLOR = "#7c848c";
const FONT_SIZE = 12;
const LABEL_COLOR = "#bfc6cc";

exports.ALL_TIME_COLOR = '#0f452d';
exports.LAST_7_DAYS_COLOR = '#31b74c';

exports.chartConfigs = {
  projects: {
    title: 'Time Spent by Project',
    width: 400,
    height: 400,
    fontFamily: FONT_FAMILY,
    fontColor: FONT_COLOR,
    labelColor: LABEL_COLOR,
    maxLength: 6,
    fontSize: FONT_SIZE
  },
  languages: {
    title: 'Programming Languages',
    width: 400,
    height: 400,
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE,
    maxLength: 6,
    fontColor: FONT_COLOR,
    labelColor: LABEL_COLOR,
  },
}; 