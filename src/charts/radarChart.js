const vega = require('vega');
const { chartConfigs } = require('./configs');

const ALL_TIME_COLOR = '#c4dbf7';
const LAST_7_DAYS_COLOR = '#c6efbf';
const TODAY_COLOR = '#fba097';

const fillOpacityMap = {
  'all_time': 0.1,
  'last_7_days': 0.5,
  'today': 0.5
}

exports.createRadarChart = async function(datasets, field) {
  // Validate input data
  if (!datasets || !datasets.length) {
    throw new Error('No datasets provided for radar chart');
  }

  const config = chartConfigs[field];
  
  // 1. First get all_time data to establish reference axes
  const allTimeDataset = datasets.find(d => d.period === 'all_time');
  if (!allTimeDataset) {
    throw new Error('All-time dataset is required for radar chart');
  }

  // Get reference axes from all_time data
  const referenceAxes = allTimeDataset.data[field]
    .filter(item => item.percent > 1)
    .slice(0, config.maxLength)
    .map(item => item.name);

  // 2. Process all datasets using the reference axes
  const processedData = datasets.map(dataset => {
    const dataMap = new Map(
      dataset.data[field].map(item => [item.name, item])
    );
    return referenceAxes.map(axisName => {
      const item = dataMap.get(axisName);
      const totalMinutes = item ? (item.hours * 60 + item.minutes) : 0;
      const roundedHours = Math.ceil(totalMinutes / 60);
      
      return {
        period: dataset.period,
        language: axisName,
        percent: item ? Math.min(item.percent, 50) : 0,
        actualPercent: item ? item.percent : 0,
        hours: totalMinutes / 60,
        formattedHours: roundedHours >= 1 ? `${roundedHours}h` : ""
      };
    });
  }).flat();

  const spec = {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "description": "Radar chart showing coding time across different time periods",
    "width": config.width,
    "height": config.height,
    "padding": 50,
    "autosize": {"type": "none", "contains": "padding"},

    "signals": [
      {"name": "radius", "update": "width / 2"}
    ],

    "data": [
      {
        "name": "table",
        "values": processedData
      },
      {
        "name": "keys",
        "source": "table",
        "transform": [
          {
            "type": "aggregate",
            "groupby": ["language"]
          }
        ]
      }
    ],

    "scales": [
      {
        "name": "angular",
        "type": "point",
        "range": {"signal": "[-PI, PI]"},
        "padding": 0.5,
        "domain": referenceAxes
      },
      {
        "name": "radial",
        "type": "linear",
        "range": {"signal": "[0, radius]"},
        "zero": true,
        "nice": false,
        "domain": [0, 50],
        "domainMin": 0
      },
      {
        "name": "color",
        "type": "ordinal",
        "domain": ["all_time", "last_7_days", "today"],
        "range": [ALL_TIME_COLOR, LAST_7_DAYS_COLOR, TODAY_COLOR]

      }
    ],

    "encode": {
      "enter": {
        "x": {"signal": "radius"},
        "y": {"signal": "radius"}
      }
    },

    "marks": [
      {
        "type": "group",
        "name": "categories",
        "zindex": 1,
        "from": {
          "facet": {"data": "table", "name": "facet", "groupby": ["period"]}
        },
        "marks": [
          {
            "type": "line",
            "name": "category-line",
            "from": {"data": "facet"},
            "encode": {
              "enter": {
                "interpolate": {"value": "linear-closed"},
                "x": {"signal": "scale('radial', datum.percent) * cos(scale('angular', datum.language))"},
                "y": {"signal": "scale('radial', datum.percent) * sin(scale('angular', datum.language))"},
                "stroke": {"scale": "color", "field": "period"},
                "strokeWidth": {"value": 2},
                "fill": {"scale": "color", "field": "period"},
                "fillOpacity": {"value": 0.5}
              }
            }
          },
          {
            "type": "symbol",
            "name": "category-point",
            "from": {"data": "facet"},
            "encode": {
              "enter": {
                "x": {"signal": "scale('radial', datum.percent) * cos(scale('angular', datum.language))"},
                "y": {"signal": "scale('radial', datum.percent) * sin(scale('angular', datum.language))"},
                "size": {"value": 50},
                "fill": {"scale": "color", "field": "period"},
                "stroke": {"value": "white"},
                "strokeWidth": {"value": 1}
              }
            }
          },
          {
            "type": "text",
            "name": "value-text",
            "from": {"data": "facet"},
            "encode": {
              "enter": {
                "x": {"signal": "scale('radial', datum.percent) * cos(scale('angular', datum.language))"},
                "y": {"signal": "scale('radial', datum.percent) * sin(scale('angular', datum.language))"},
                "text": {"field": "formattedHours"},
                "align": [
                  {
                    "test": "abs(scale('angular', datum.language)) > PI / 2",
                    "value": "right"
                  },
                  {
                    "value": "left"
                  }
                ],
                "baseline": [
                  {
                    "test": "scale('angular', datum.language) > 0",
                    "value": "bottom"
                  },
                  {
                    "test": "scale('angular', datum.language) < 0",
                    "value": "top"
                  },
                  {
                    "value": "middle"
                  }
                ],
                "dx": [
                  {
                    "test": "abs(scale('angular', datum.language)) > PI / 2",
                    "value": -5
                  },
                  {
                    "value": 0
                  }
                ],
                "dy": [
                  {
                    "test": "scale('angular', datum.language) > 0",
                    "value": -5
                  },
                  {
                    "test": "scale('angular', datum.language) < 0",
                    "value": 5
                  },
                  {
                    "value": 0
                  }
                ],
                "fontSize": {"value": 14},
                "font": {"value": config.fontFamily},
                "fill": {"value": "#ffffff"}
              }
            }
          }

        ]
      },
      {
        "type": "rule",
        "name": "radial-grid",
        "from": {"data": "keys"},
        "zindex": 0,
        "encode": {
          "enter": {
            "x": {"value": 0},
            "y": {"value": 0},
            "x2": {"signal": "radius * cos(scale('angular', datum.language))"},
            "y2": {"signal": "radius * sin(scale('angular', datum.language))"},
            "stroke": {"value": "lightgray"},
            "strokeWidth": {"value": 1}
          }
        }
      },
      {
        "type": "text",
        "name": "key-label",
        "from": {"data": "keys"},
        "zindex": 1,
        "encode": {
          "enter": {
            "x": {"signal": "(radius + 15) * cos(scale('angular', datum.language))"},
            "y": {"signal": "(radius + 15) * sin(scale('angular', datum.language))"},
            "text": {"field": "language"},
            "align": [
              {
                "test": "abs(scale('angular', datum.language)) > PI / 2",
                "value": "right"
              },
              {
                "value": "left"
              }
            ],
            "baseline": [
              {
                "test": "scale('angular', datum.language) > 0", "value": "top"
              },
              {
                "test": "scale('angular', datum.language) == 0", "value": "middle"
              },
              {
                "value": "bottom"
              }
            ],
            "fill": {"value": config.fontColor},
            "font": {"value": config.fontFamily},
            "fontSize": {"value": 12}
          }
        }
      }
    ]
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
