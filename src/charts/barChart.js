const vega = require('vega');
const { chartConfigs } = require('./configs');

exports.createBarChart = async function(data, field) {
  const config = chartConfigs[field];
  
  const spec = {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "width": config.width,
    "height": config.height,
    "padding": 5,
    "title": {
      "text": config.title,
      "fontSize": config.fontSize,
      "font": config.fontFamily,
      "color": config.fontColor
    },
    "data": [
      {
        "name": "table",
        "values": data[field].filter(item => item.total > 0)
      }
    ],
    "signals": [
      {"name": "tooltip", "value": {}}
    ],
    "scales": [
      {
        "name": "xscale",
        "type": "band",
        "domain": {"data": "table", "field": "key"},
        "range": "width",
        "padding": 0.05,
        "round": true
      },
      {
        "name": "yscale",
        "domain": {"data": "table", "field": "total"},
        "nice": true,
        "range": "height"
      }
    ],
    "axes": [
      {
        "orient": "bottom",
        "scale": "xscale",
        "labelAngle": -45,
        "labelAlign": "right",
        "labelFont": config.fontFamily,
        "titleFont": config.fontFamily,
        "titleColor": config.fontColor,
        "labelColor": config.fontColor
      },
      {
        "orient": "left", 


        "scale": "yscale",
        "labelFont": config.fontFamily,
        "titleFont": config.fontFamily,
        "titleColor": config.fontColor,
        "labelColor": config.fontColor

      }
    ],
    "marks": [
      {
        "type": "rect",
        "from": {"data": "table"},
        "encode": {
          "enter": {
            "x": {"scale": "xscale", "field": "key"},
            "width": {"scale": "xscale", "band": 1},
            "y": {"scale": "yscale", "field": "total"},
            "y2": {"scale": "yscale", "value": 0},
            "fill": {"value": "#4C78A8"}
          }
        }
      }
    ]
  };

  const view = new vega.View(vega.parse(spec), {renderer: 'none'});
  return await view.toCanvas();
};

exports.createLanguageBarChart = async function(data) {
  const config = chartConfigs.languages;
  
  const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": config.width,
    "height": config.height,
    "title": {
      "text": config.title,
      "fontSize": config.fontSize,
      "font": config.fontFamily,
      "color": config.fontColor
    },
    "data": {
      "values": data.languages.map(lang => ({
        "language": lang.key,
        "heartbeats": lang.total
      }))
    },
    "mark": "bar",
    "encoding": {
      "y": {
        "field": "language",
        "type": "nominal",
        "sort": "-x",
        "axis": {
          "labelFont": config.fontFamily,
          "titleFont": config.fontFamily,
          "labelColor": config.fontColor,
          "titleColor": config.fontColor
        }
      },
      "x": {
        "field": "heartbeats",
        "type": "quantitative",
        "axis": {
          "labelFont": config.fontFamily,
          "titleFont": config.fontFamily,
          "labelColor": config.fontColor,
          "titleColor": config.fontColor
        }
      },
      "color": {
        "field": "language",
        "type": "nominal",
        "legend": null
      }
    },
    "config": {
      "view": {"stroke": "transparent"},
      "axis": {"grid": false}
    }
  };

  const view = new vega.View(vega.parse(spec), {renderer: 'none'});
  return await view.toCanvas();
}; 