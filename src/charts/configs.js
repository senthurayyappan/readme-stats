// Define a common set of system-safe fonts
const FONT_FAMILY = 'Arial, sans-serif';
const FONT_COLOR = "#666666";
const FONT_SIZE = 14;
const LABEL_COLOR = "#ffffff";

exports.ALL_TIME_COLOR = '#A1D6CB';
exports.LAST_7_DAYS_COLOR = '#FFF574';

exports.chartConfigs = {
  projects: {
    title: 'Time Spent by Project',
    width: 500,
    height: 500,
    fontFamily: FONT_FAMILY,
    fontColor: FONT_COLOR,
    labelColor: LABEL_COLOR,
    maxLength: 6,
    fontSize: FONT_SIZE
  },
  languages: {
    title: 'Programming Languages',
    width: 500,
    height: 500,
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE,
    maxLength: 6,
    fontColor: FONT_COLOR,
    labelColor: LABEL_COLOR,
  },
}; 