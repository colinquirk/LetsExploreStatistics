// Helpers
function arrSum(a) {
  sum = 0;
  for (i=0; i<a.length; i++) {
    sum = sum + a[i].y;
  }
  return(sum);
}

// Setup data
var colors = ['#e6194b',
              '#3cb44b',
              '#ffe119',
              '#4363d8',
              '#f58231',
              '#911eb4',
              '#46f0f0',
              '#f032e6'];
var colorIndex = 0;

var samples = 1000;
var flips = [];
var flipCumMean = [];

function flip(n) {
  flips = [];
  for (i=1; i<samples+1; i++) {
    flips.push({x:i, y:Math.round(Math.random())});
  }
}

function getCumMean() {
  flipCumMean = [];
  for (i=1; i<samples+1; i++) {
    flipCumMean.push({x:i, y:arrSum(flips.slice(0, i)) / i});
  }
}

flip();
getCumMean();

// Setup plots
const margin = {top: 15, bottom: 30, left: 40, right: 20};
var width = width - margin.left - margin.right;
var height = height - margin.top - margin.bottom;

const tracePlot = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const xscale = d3.scaleLog()
  .domain([1, 1000])
  .range([0, width - margin.left]);

const yscale = d3.scaleLinear()
  .domain([0, 1])
  .range([height, 0]);

const xaxis = d3.axisBottom()
  .scale(xscale)
  .tickFormat(d3.format(",.0f"))
  .tickValues([1, 2, 3, 4, 5, 7, 10, 15, 20, 30, 50, 100, 200, 500, 1000]);
const yaxis = d3.axisLeft().scale(yscale);

tracePlot.append('g')
  .attr('transform',`translate(0,${height})`)
  .call(xaxis);
tracePlot.append('g').call(yaxis);

var chanceData = [];
for (i=1; i<1001; i++) {
  chanceData.push({x:i});
}

var chanceLine = d3.line()
  .x(function(d) { return xscale(d.x);})
  .y(function(d) { return yscale(0.5);});

var flipLine = d3.line()
  .x(function(d) { return xscale(d.x);})
  .y(function(d) { return yscale(d.y);});

tracePlot.append("path")
  .datum(chanceData)
  .attr("d", chanceLine)
  .style("fill", "none")
  .style("stroke-width", 2)
  .style("stroke", "black");

// Plot data
function plotData() {
  tracePlot.append("path")
    .datum(flipCumMean)
    .attr("d", flipLine)
    .attr("class", "traceData")
    .style("fill", "none")
    .style("stroke-width", 2)
    .style("stroke", colors[colorIndex]);
}

// Add Interactivity
d3.select('#plotButton')
  .on('click', function() {
    d3.event.preventDefault();
    flip();
    getCumMean();

    plotData();

    colorIndex = colorIndex + 1;
    if (colorIndex == colors.length) {
      colorIndex = 0;
    }
  });

d3.select('#resetButton')
  .on('click', function() {
    d3.event.preventDefault();
    flips = [];
    flipCumMean = [];

    svg.selectAll(".traceData").remove();
  });
