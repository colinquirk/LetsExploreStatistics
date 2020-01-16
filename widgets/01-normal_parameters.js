var standard_normal = [];
var user_normal = [];

user_normal_mean = 2;
user_normal_sd = 3;

for (i=-10; i<=10; i=i+0.1) {
  standard_normal.push({x:i, y:jStat.normal.pdf(i, 0, 1)});
  user_normal.push({x:i, y:jStat.normal.pdf(i, user_normal_mean, user_normal_sd)});
}

const margin = {top: 20, bottom: 20, left: 30, right: 20};
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

var line = d3.line()
  .x(function(d) { return xscale(d.x); })
  .y(function(d) { return yscale(d.y); })
  .curve(d3.curveMonotoneX);

g.append("path")
  .attr("class", "dist stand_dist")
  .datum(standard_normal)
  .attr("d", line);

g.append("path")
  .attr("class", "dist user_dist")
  .datum(user_normal)
  .attr("d", line);

g.selectAll(".dist")
  .style("fill-opacity", 0.25)
  .style("stroke-width", 2)
  .style("stroke", "black");

g.select(".stand_dist")
  .style("fill", "blue");

g.select(".user_dist")
  .style("fill", "red");
