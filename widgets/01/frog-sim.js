var frogGreen = "#7EC850";

// Generating data
var frogs = [];

resetFrogs = function() {
  frogs = [];
  for(i=0; i<1000; i++) {
    frogs.push({x:0, y:i+1});
  }
};

getHops = function() {
  var hops = [];
  for(i=0; i<frogs.length; i++) {
    hops.push(Math.floor(Math.random() * 3) - 1);
  }
  return hops;
};

updateFrogs = function(hops) {
  for(i=0; i<frogs.length; i++) {
    frogs[i].x = frogs[i].x + hops[i];
    frogs[i].x = d3.min([frogs[i].x, 9]);
    frogs[i].x = d3.max([frogs[i].x, -9]);
  }
};

resetFrogs();

// Set up margin
const margin = {top: 5, bottom: 30, left: 40, right: 20};
var width = width - margin.left - margin.right;
var height = height - margin.top - margin.bottom;

// Set up plot area for raw data view
const pointPlot = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const xscale = d3.scaleLinear()
  .domain([-10, 10])
  .range([0, (width/2) - margin.left]);

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
  .attr('class', 'dot')
  .attr("fill", frogGreen)
  .attr("r", 2)
  .attr("cx", xmap)
  .attr("cy", ymap);

// Set up plot area for histogram
const histPlot = svg.append('g')
  .attr('transform', `translate(${(width / 2) + margin.left}, ${margin.top})`);

histPlot.append('g').attr('transform',`translate(0,${height})`).call(xaxis);
histPlot.append('g').call(yaxis);

// Add hist bars
var hist = d3.histogram()
  .value((d) => {return d.x;})
  .domain(xscale.domain())
  .thresholds(21);

var bins = hist(frogs);

histPlot
  .selectAll("rect")
  .data(bins)
  .enter().append("rect")
    .attr("width", function(d) {return xscale(d.x1) - xscale(d.x0) - 1;})
    .attr("height", function(d) {return height - yscale(d.length);})
    .attr("transform", function(d) {
	    return "translate(" + xscale(d.x0 - 0.5) + "," + yscale(d.length) + ")"; })
    .attr("fill", frogGreen);

// Add interactivity
d3.select('#progressFrogsButton')
  .on('click', function() {
    d3.event.preventDefault();
    hops = getHops();
    updateFrogs(hops);
    bins = hist(frogs);

    pointPlot.selectAll(".dot").transition()
      .attr("cx", xmap)
      .attr("cy", ymap);

    histPlot.selectAll("rect")
      .data(bins)
      .transition()
      .attr("height", function(d) {return height - yscale(d.length);})
      .attr("transform", function(d) {
		    return "translate(" + xscale(d.x0 - 0.5) + "," + yscale(d.length) + ")"; });
  });

d3.select('#resetFrogsButton')
  .on('click', function() {
    d3.event.preventDefault();
    resetFrogs();
    bins = hist(frogs);

    pointPlot.selectAll(".dot")
      .data(frogs)
      .transition()
      .attr("cx", xmap)
      .attr("cy", ymap);

    histPlot.selectAll("rect")
      .data(bins)
      .transition()
      .attr("height", function(d) {return height - yscale(d.length);})
      .attr("transform", function(d) {
		    return "translate(" + xscale(d.x0 - 0.5) + "," + yscale(d.length) + ")"; });
  });
