// Generating data
var user_normal_mean = 2;
var user_normal_sd = 3.5;

generateData = function(mean, sd) {
  var res = [];

  res.push({x:-10, y:0});
  for (i=-10; i<=10; i=i+0.1) {
    res.push({x:i, y:jStat.normal.pdf(i, mean, sd)});
  }
  res.push({x:10, y:0});
  return res;
};

var standard_normal = generateData(0, 1);
var user_normal = generateData(user_normal_mean, user_normal_sd);

// Set up plot area
const margin = {top: 5, bottom: 30, left: 30, right: 20};
var width = width - margin.left - margin.right;
var height = height - margin.top - margin.bottom;

const g = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const xscale = d3.scaleLinear()
  .domain([-10, 10])
  .range([0, width]);

const yscale = d3.scaleLinear()
  .domain([0, 1])
  .range([height, 0]);

const xaxis = d3.axisBottom().scale(xscale);
const yaxis = d3.axisLeft().scale(yscale);

g.append('g').attr('transform',`translate(0,${height})`).call(xaxis);
g.append('g').call(yaxis);

// Create lines
var line = d3.line()
  .x(function(d) { return xscale(d.x); })
  .y(function(d) { return yscale(d.y); })
  .curve(d3.curveMonotoneX);

g.append("path")
  .attr("class", "dist")
  .attr("id", "stand_dist")
  .datum(standard_normal);

g.append("path")
  .attr("class", "dist")
  .attr("id", "user_dist")
  .datum(user_normal);

g.selectAll(".dist")
  .attr("d", line)
  .style("fill-opacity", 0.25)
  .style("stroke-width", 2)
  .style("stroke", "black");

g.select("#stand_dist")
  .style("fill", "blue");

g.select("#user_dist")
  .style("fill", "red");

// Add Interactivity
onSliderChange = function() {
  user_normal_mean = d3.select('#meanSlider').property('value');
  user_normal_sd = d3.select('#sdSlider').property('value');

  user_normal = generateData(user_normal_mean, user_normal_sd);
  g.select("#user_dist").datum(user_normal).attr("d", line);
};

onSliderInput = function() {
  user_normal_mean = d3.select('#meanSlider').property('value');
  user_normal_sd = d3.select('#sdSlider').property('value');

  d3.select('#meanSliderLabel').html(`Mean: ${user_normal_mean}`);
  d3.select('#sdSliderLabel').html(`Sd: ${user_normal_sd}`);
};

d3.select('#meanSlider')
  .attr('value', user_normal_mean)
  .attr('max', '10')
  .attr('min', '-10');

d3.select('#sdSlider')
  .attr('value', user_normal_sd)
  .attr('step', '0.5')
  .attr('max', '5')
  .attr('min', '0.5');

d3.selectAll('.slider')
  .on("input", onSliderInput)
  .on("change", onSliderChange);

// Fix form location
d3.select('#standardNormalForm')
  .style('position', 'absolute')
  .style('margin-left', `${2*width/3}px`)
  .style('margin-top', `${margin.top}px`);
