//Helpers
//https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Set up data
var samples = 500;
var n = 8;
var domainHeight = 300;

var normal_data = [];
var skew_data = [];
var unif_data = [];
var sample_means = [];

function get_normal_samples() {
  normal_data = [];
  for(var i=0; i<samples; i++){
    normal_data.push({x:jStat.normal.sample(0, 1)});
  }
}

function get_skew_samples() {
  skew_data = [];
  for(var i=0; i<samples; i++){
    skew_data.push({x:jStat.beta.sample(7, 2) * 6 - 4.66});
  }
}

function get_unif_samples() {
  unif_data = [];
  for(var i=0; i<samples; i++){
    unif_data.push({x:Math.random() * 6 - 3});
  }
}

function get_sample_mean(data, n) {
  var shuffled = JSON.parse(JSON.stringify(data));
  shuffle(shuffled);
  var values = shuffled.slice(0, n);
  var value_nums = values.map(d => d.x);
  var total = value_nums.reduce((a, b) => a + b, 0);
  return total / value_nums.length;
}

function get_all_sample_means(data, n) {
  sample_means = [];
  for(var i=0; i<samples; i++) {
    sample_means.push({x: get_sample_mean(data, n)});
  }
}

get_normal_samples();
get_skew_samples();
get_unif_samples();

// Setup margins
const margin = {top: 15, bottom: 30, left: 40, right: 20};
var width = width - margin.left - margin.right;
var height = height - margin.top - margin.bottom;

// Add titles
svg.append("text")
  .attr("x", width / 4 + margin.left / 2)
  .attr("y", margin.top)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Population")

svg.append("text")
  .attr("x", 3 * width / 4 + margin.left / 2)
  .attr("y", margin.top)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Sample Means")

// Create plots
const popPlot = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const samplePlot = svg.append('g')
  .attr('transform', `translate(${(width / 2) + margin.left}, ${margin.top})`);

const xscale = d3.scaleLinear()
  .domain([-3, 3])
  .range([0, (width/2) - margin.left]);

const yscale_pop = d3.scaleLinear()
  .domain([0, domainHeight / 4])
  .range([height, 0]);

const yscale_sample = d3.scaleLinear()
  .domain([0, domainHeight])
  .range([height, 0]);

const xaxis = d3.axisBottom().scale(xscale);
const yaxis_pop = d3.axisLeft().scale(yscale_pop);
const yaxis_sample = d3.axisLeft().scale(yscale_sample);

popPlot.append('g').attr('transform',`translate(0,${height})`).call(xaxis);
popPlot.append('g').call(yaxis_pop);

samplePlot.append('g').attr('transform',`translate(0,${height})`).call(xaxis);
samplePlot.append('g').call(yaxis_sample);

// Add population hist
var hist = d3.histogram()
  .value((d) => {return d.x;})
  .domain(xscale.domain())
  .thresholds(32);

var popBins = hist(normal_data);

popPlot
  .selectAll("rect")
  .data(popBins)
  .enter().append("rect")
    .attr("width", function(d) {return xscale(d.x1) - xscale(d.x0);})
    .attr("height", function(d) {return height - yscale_pop(d.length);})
    .attr("transform", function(d) {
      return "translate(" + xscale(d.x0) + "," + yscale_pop(d.length) + ")"; })
    .attr("fill", "steelblue");

// Add sample hist
get_all_sample_means(normal_data, n);

var sampBins = hist(sample_means);

samplePlot
  .selectAll("rect")
  .data(sampBins)
  .enter().append("rect")
    .attr("width", function(d) {return xscale(d.x1) - xscale(d.x0);})
    .attr("height", function(d) {return height - yscale_sample(d.length);})
    .attr("transform", function(d) {
      return "translate(" + xscale(d.x0) + "," + yscale_sample(d.length) + ")"; })
    .attr("fill", "steelblue");

// Add Interactivity

updatePlots = function() {
  samplePlot.selectAll("rect")
  .data(sampBins)
  .transition()
  .attr("height", function(d) {return height - yscale_sample(d.length);})
  .attr("transform", function(d) {
    return "translate(" + xscale(d.x0) + "," + yscale_sample(d.length) + ")"; })
  .attr("fill", "steelblue");

  popPlot.selectAll("rect")
  .data(popBins)
  .transition()
  .attr("height", function(d) {return height - yscale_pop(d.length);})
  .attr("transform", function(d) {
    return "translate(" + xscale(d.x0) + "," + yscale_pop(d.length) + ")"; })
  .attr("fill", "steelblue");
}

d3.select('#normalDistButton')
  .on('click', function() {
    d3.event.preventDefault();
    get_normal_samples();
    popBins = hist(normal_data);
    get_all_sample_means(normal_data, n);
    sampBins = hist(sample_means);

    updatePlots();
  });

d3.select('#skewDistButton')
  .on('click', function() {
    d3.event.preventDefault();
    get_skew_samples();
    popBins = hist(skew_data);
    get_all_sample_means(skew_data, n);
    sampBins = hist(sample_means);

    updatePlots();
  });

d3.select('#unifDistButton')
  .on('click', function() {
    d3.event.preventDefault();
    get_unif_samples();
    popBins = hist(unif_data);
    get_all_sample_means(unif_data, n);
    sampBins = hist(sample_means);

    updatePlots();
  });
