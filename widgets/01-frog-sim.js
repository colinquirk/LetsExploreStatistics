// Generating data
var frogs = [];

resetFrogs = function() {
  frogs = [];
  for(i=0; i<50; i++) {
    frogs.push({x:0, y:i});
  }
  return frogs;
};

getHops = function() {
  var hops = [];
  for(i=0; i<frogs.length; i++) {
    hops.push((Math.random() < 0.5) ? -1 : 1);
  }
  return hops;
};

updateFrogs = function(frogs, hops) {
  for(i=0; i<frogs.length; i++) {
    frogs[i].x = frogs[i].x + hops[i];
  }
  return frogs;
};

frogs = resetFrogs();

// Set up margin
const margin = {top: 5, bottom: 30, left: 35, right: 20};
var width = width - margin.left - margin.right;
var height = height - margin.top - margin.bottom;

// Set up plot area for raw data view
const pointPlot = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const xscale = d3.scaleLinear()
  .domain([-15, 15])
  .range([0, width/2]);

const yscale = d3.scaleLinear()
  .domain([0, frogs.length])
  .range([height, 0]);

const xaxis = d3.axisBottom().scale(xscale);
const yaxis = d3.axisLeft().scale(yscale);

pointPlot.append('g').attr('transform',`translate(0,${height})`).call(xaxis);
pointPlot.append('g').call(yaxis);

// Add frog points
var xvalue = function(d) { return d.x;};
var yvalue = function(d) { return d.y;};

var xmap = function(d) { return xscale(xvalue(d));};
var ymap = function(d) { return yscale(yvalue(d));};

pointPlot.selectAll(".dot")
  .data(frogs)
  .enter().append("circle")
  .attr("r", 2)
  .attr("cx", xmap)
  .attr("cy", ymap);
