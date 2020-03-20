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
var samples = 5000;
var n = 20;
var popDomainHeight = 1000;
var sampDomainHeight = 70;

var normal_data = [];
var skew_data = [];
var unif_data = [];

var sample_data = [];

function get_normal_samples() {
  normal_data = [];
  for (var i=0; i < samples; i++) {
    normal_data.push({ x: jStat.normal.sample(0, 1) });
  }
}

function get_skew_samples() {
  skew_data = [];
  for (var i=0; i < samples; i++) {
    skew_data.push({ x: jStat.beta.sample(7, 2) * 6 - 4.66 });
  }
}

function get_unif_samples() {
  unif_data = [];
  for (var i=0; i < samples; i++) {
    unif_data.push({ x: Math.random() * 6 - 3 });
  }
}

function get_sample(data, n) {
  shuffled = shuffle(data);
  sample_data = shuffled.slice(0, n)
}

get_normal_samples();
get_skew_samples();
get_unif_samples();

get_sample(normal_data, n)

// Setup margins
const margin = { top: 15, bottom: 30, left: 40, right: 20 };
var width = width - margin.left - margin.right;
var height = height - margin.top - margin.bottom;

// Add titles
svg
  .append("text")
  .attr("x", width / 4 + margin.left / 2)
  .attr("y", margin.top)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Population Distribution");

svg
  .append("text")
  .attr("x", (3 * width) / 4 + margin.left / 2)
  .attr("y", margin.top)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Sample Distribution");

// Create plots
const popPlot = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const samplePlot = svg
  .append("g")
  .attr("transform", `translate(${width / 2 + margin.left}, ${margin.top})`);

const xscale = d3
  .scaleLinear()
  .domain([-3, 3])
  .range([0, width / 2 - margin.left]);

const yscale_pop = d3
  .scaleLinear()
  .domain([0, popDomainHeight])
  .range([height, 0]);

const yscale_samp = d3
  .scaleLinear()
  .domain([0, sampDomainHeight])
  .range([height, 0]);

const xaxis = d3.axisBottom().scale(xscale);
const yaxis_pop = d3.axisLeft().scale(yscale_pop);
const yaxis_samp = d3.axisLeft().scale(yscale_samp);

popPlot
  .append("g")
  .attr("transform", `translate(0,${height})`)
  .call(xaxis);
popPlot.append("g").call(yaxis_pop);

samplePlot
  .append("g")
  .attr("transform", `translate(0,${height})`)
  .call(xaxis);
samplePlot.append("g").call(yaxis_samp);

// Add population hist
var pop_hist = d3
  .histogram()
  .value(d => {
    return d.x;
  })
  .domain(xscale.domain())
  .thresholds(32);

var popBins = pop_hist(normal_data);

popPlot
  .selectAll("rect")
  .data(popBins)
  .enter()
  .append("rect")
  .attr("width", function(d) {
    return xscale(d.x1) - xscale(d.x0);
  })
  .attr("height", function(d) {
    return height - yscale_pop(d.length);
  })
  .attr("transform", function(d) {
    return "translate(" + xscale(d.x0) + "," + yscale_pop(d.length) + ")";
  })
  .attr("fill", "steelblue");

// Add sample hist
var samp_hist = d3
  .histogram()
  .value(d => {
    return d.x;
  })
  .domain(xscale.domain())
  .thresholds(16);

var sampBins = samp_hist(sample_data);

samplePlot
  .selectAll("rect")
  .data(sampBins)
  .enter()
  .append("rect")
  .attr("width", function(d) {
    return xscale(d.x1) - xscale(d.x0);
  })
  .attr("height", function(d) {
    return height - yscale_samp(d.length);
  })
  .attr("transform", function(d) {
    return "translate(" + xscale(d.x0) + "," + yscale_samp(d.length) + ")";
  })
  .attr("fill", "steelblue");

// Add Interactivity
updatePlots = function() {
  popPlot
    .selectAll("rect")
    .data(popBins)
    .transition()
    .attr("height", function(d) {
      return height - yscale_pop(d.length);
    })
    .attr("transform", function(d) {
      return "translate(" + xscale(d.x0) + "," + yscale_pop(d.length) + ")";
    })
    .attr("fill", "steelblue");

  samplePlot
    .selectAll("rect")
    .data(sampBins)
    .transition()
    .attr("height", function(d) {
      return height - yscale_samp(d.length);
    })
    .attr("transform", function(d) {
      return "translate(" + xscale(d.x0) + "," + yscale_samp(d.length) + ")";
    })
    .attr("fill", "steelblue");

};

d3.select("#normalDistButton").on("click", function() {
  d3.event.preventDefault();
  get_normal_samples();
  get_sample(normal_data, n)
  popBins = pop_hist(normal_data);
  sampBins = samp_hist(sample_data);

  updatePlots();
});

d3.select("#skewDistButton").on("click", function() {
  d3.event.preventDefault();
  get_skew_samples();
  get_sample(skew_data, n)
  popBins = pop_hist(skew_data);
  sampBins = samp_hist(sample_data);

  updatePlots();
});

d3.select("#unifDistButton").on("click", function() {
  d3.event.preventDefault();
  get_unif_samples();
  get_sample(unif_data, n)
  popBins = pop_hist(unif_data);
  sampBins = samp_hist(sample_data);

  updatePlots();
});

onSliderInput = function() {
  n = d3.select("#nSlider").property("value");
  d3.select("#nSliderLabel").html(`n: ${n}`);
};

d3.select("#nSlider")
  .attr("value", n)
  .attr("max", "200")
  .attr("min", "10")
  .attr("step", "10");

d3.select("#nSlider")
  .on("input", onSliderInput);

// Make labels nice
d3.selectAll("label")
  .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
  .style("font-size", "1.2em");
