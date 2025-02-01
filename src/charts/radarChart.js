const vega = require('vega');
const { chartConfigs } = require('./configs');

exports.createLanguageRadarChart = async function(data) {
  // Validate input data
  if (!data || !data.languages || data.languages.length === 0) {
    throw new Error('No language data provided for radar chart');
  }

  const config = chartConfigs.languages;
  
  // Take top N languages based on config
  const topLanguages = data.languages.slice(0, config.maxLanguages);
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
    "layer": [
      {
        "mark": {
          "type": "line",
          "color": config.fontColor,
          "strokeWidth": 1
        },
        "encoding": {
          "y": {"field": "x", "type": "quantitative"},
          "x": {"field": "y", "type": "quantitative"}
        },
        "data": {
          "values": Array.from({length: 361}, (_, i) => {
            const angle = (i * Math.PI) / 180;
            return {
              x: Math.cos(angle),
              y: Math.sin(angle)
            };
          })
        }
      },
      {
        "mark": {"type": "line", "color": config.fontColor},
        "encoding": {
          "y": {"field": "y", "type": "quantitative"},
          "x": {"field": "x", "type": "quantitative"},
          "detail": {"field": "language"}
        }
      },
      {
        "mark": {"type": "text", "color": config.fontColor},
        "encoding": {
          "y": {"field": "y", "type": "quantitative"},
          "x": {"field": "x", "type": "quantitative"},
          "text": {"field": "language"}
        }
      }
    ],
    "padding": 40,
    "data": [
      {
        "name": "languages",
        "values": topLanguages.map(lang => ({
          "language": lang.key,
          "heartbeats": lang.total
        }))
      }
    ],

    "scales": [
      {
        "name": "angular",
        "type": "point",
        "range": {"signal": "[-PI, PI]"},
        "padding": 0.5,
        "domain": {"data": "languages", "field": "language"}
      },
      {
        "name": "radial",
        "type": "linear",
        "range": {"signal": "[0, width/2.5]"},
        "zero": true,
        "domain": {"data": "languages", "field": "heartbeats"}
      }
    ],

    "marks": [
      {
        "type": "group",
        "center": true,
        "encode": {
          "enter": {
            "x": {"signal": "width/2"},
            "y": {"signal": "height/2"}
          }
        },
        "marks": [
          {
            "type": "line",
            "from": {"data": "languages"},
            "encode": {
              "enter": {
                "interpolate": {"value": "linear-closed"},
                "x": {"signal": "scale('radial', datum.heartbeats) * cos(scale('angular', datum.language))"},
                "y": {"signal": "scale('radial', datum.heartbeats) * sin(scale('angular', datum.language))"},
                "stroke": {"value": "#4C78A8"},
                "strokeWidth": {"value": 2},
                "fill": {"value": "#4C78A8"},
                "fillOpacity": {"value": 0.2}
              }
            }
          },
          {
            "type": "rule",
            "from": {"data": "languages"},
            "encode": {
              "enter": {
                "x": {"value": 0},
                "y": {"value": 0},
                "x2": {"signal": "width/2.5 * cos(scale('angular', datum.language))"},
                "y2": {"signal": "width/2.5 * sin(scale('angular', datum.language))"},
                "stroke": {"value": "#ddd"},
                "strokeWidth": {"value": 1}
              }
            }
          },
          {
            "type": "symbol",
            "from": {"data": "languages"},
            "encode": {
              "enter": {
                "x": {"signal": "scale('radial', datum.heartbeats) * cos(scale('angular', datum.language))"},
                "y": {"signal": "scale('radial', datum.heartbeats) * sin(scale('angular', datum.language))"},
                "size": {"value": 50},
                "fill": {"value": "#4C78A8"}
              }
            }
          },
          {
            "type": "text",
            "from": {"data": "languages"},
            "encode": {
              "enter": {
                "x": {"signal": "(width/2.5 + 10) * cos(scale('angular', datum.language))"},
                "y": {"signal": "(width/2.5 + 10) * sin(scale('angular', datum.language))"},
                "text": {"field": "language"},
                "align": {"signal": "cos(scale('angular', datum.language)) < -0.5 ? 'right' : (cos(scale('angular', datum.language)) > 0.5 ? 'left' : 'center')"},
                "baseline": {"signal": "sin(scale('angular', datum.language)) < -0.5 ? 'top' : (sin(scale('angular', datum.language)) > 0.5 ? 'bottom' : 'middle')"},
                "fontSize": {"value": 12},
                "font": {"value": config.fontFamily},
                "fill": {"value": config.fontColor}
              }
            }
          },
          {
            "type": "text",
            "from": {"data": "languages"},
            "encode": {
              "enter": {
                "x": {"signal": "scale('radial', datum.heartbeats) * cos(scale('angular', datum.language))"},
                "y": {"signal": "scale('radial', datum.heartbeats) * sin(scale('angular', datum.language))"},
                "text": {"field": "heartbeats"},
                "dx": {"value": 10},
                "fontSize": {"value": 10},
                "font": {"value": config.fontFamily},
                "fill": {"value": "#666"}
              }
            }
          }
        ]
      }
    ],
    "encoding": {
      "text": {
        "field": "language",
        "type": "nominal"
      },
      "color": {"value": config.fontColor}
    },
    "config": {
      "text": {"color": config.fontColor},
      "title": {"color": config.fontColor}
    }
  };

  try {
    const view = new vega.View(vega.parse(spec), {
      renderer: 'none',
      width: config.width,
      height: config.height
    });

    await view.initialize();
    const canvas = await view.toCanvas();
    
    return canvas;
  } catch (error) {
    console.error('Error creating chart:', error);
    throw error;
  }
};
