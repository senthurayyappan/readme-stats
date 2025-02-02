// Define a common set of system-safe fonts
const FONT_FAMILY = 'Arial, sans-serif';
const FONT_COLOR = "#666666";

exports.chartConfigs = {
  projects: {
    title: 'Time Spent by Project',
    width: 500,
    height: 500,
    fontFamily: FONT_FAMILY,
    fontColor: FONT_COLOR,
    maxLength: 6,
    fontSize: 16
  },
  languages: {
    title: 'Programming Languages',
    width: 500,
    height: 500,
    fontFamily: FONT_FAMILY,
    fontSize: 20,
    maxLength: 6,
    fontColor: FONT_COLOR,
  },
  operating_systems: {
    title: 'Operating Systems',
    width: 500,
    height: 500,
    fontFamily: FONT_FAMILY,
    fontColor: FONT_COLOR,
    fontSize: 16
  },
  machines: {
    title: 'Machines',
    width: 500,
    height: 500,
    fontFamily: FONT_FAMILY,
    fontColor: FONT_COLOR,
    fontSize: 16
  }
}; 