const vega = require('vega');
const { chartConfigs } = require('./configs');

exports.createBarChart = async function(data, field) {
  const config = chartConfigs[field];
  // Take only the first maxProjects items (data is already sorted)
  const filteredData = data[field]
    .filter(item => item.total_seconds > 0)
    .slice(0, config.maxProjects);
  const itemCount = filteredData.length;

  const spec = {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "width": config.width,
    "height": itemCount * 40,
    "padding": {"top": 30, "left": 10, "right": 30, "bottom": 10},
    "title": {
      "text": config.title,
      "fontSize": config.fontSize,
      "font": config.fontFamily,
      "color": config.fontColor
    },
    "data": [
      {
        "name": "table",
        "values": filteredData
      }
    ],
    "scales": [
      {
        "name": "yscale",
        "type": "band",
        "domain": {"data": "table", "field": "name"},
        "range": "height",
        "padding": 0.3,
        "round": true
      },
      {
        "name": "xscale",
        "domain": {"data": "table", "field": "total_seconds"},
        "nice": true,
        "range": "width"
      }
    ],
    "axes": [
      {
        "orient": "bottom",
        "scale": "xscale",
        "labelFont": config.fontFamily,
        "titleFont": config.fontFamily,
        "labelColor": config.fontColor,
        "titleColor": config.fontColor,
        "grid": true,
        "gridColor": "#f0f0f0",
        "format": "d",
        "encode": {
          "labels": {
            "update": {
              "text": {"signal": "format(datum.value / 3600, '~d') + ' hrs'"}
            }
          }
        }
      }
    ],
    "marks": [
      {
        "type": "rect",
        "from": {"data": "table"},
        "encode": {
          "enter": {
            "y": {"scale": "yscale", "field": "name"},
            "height": {"scale": "yscale", "band": 1},
            "x": {"scale": "xscale", "value": 0},
            "x2": {"scale": "xscale", "field": "total_seconds"},
            "fill": {"value": "#4C78A8"},
            "cornerRadius": {"value": 3}
          }
        }
      },
      {
        "type": "text",
        "from": {"data": "table"},
        "encode": {
          "enter": {
            "y": {"scale": "yscale", "field": "name", "band": 0.5},
            "x": {"value": 10},
            "text": {"field": "name"},
            "fontSize": {"value": 13},
            "fill": {"value": "white"},
            "align": {"value": "left"},
            "baseline": {"value": "middle"},
            "font": {"value": config.fontFamily}
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
