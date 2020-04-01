//Helpers
function mean(values) {
  sum = 0;
  for(i=0; i < values.length; i++) {
      sum = sum + values[i];
  }
  return sum / values.length
}

// Set up data
var numSamples = 500;
var NPerSample = 25;
var popMean = 0;
var popSD = 1;

var popSample = [];
var sampleMeans = [];
var temp = [];

function get_population() {
  popSample = [];
  for (i=0; i < numSamples; i++) {
    popSample.push({x: jStat.normal.sample(popMean, popSD)})
  }
}

function generate_sample_means() {
  sampleMeans = [];
  for (idx=0; idx < numSamples; idx++) {
    temp = [];
    for (j=0; j < NPerSample; j++) {
        temp.push(jStat.normal.sample(popMean, popSD));
    }
    sampleMeans.push({x: mean(temp)});
  }
}

get_population();
generate_sample_means();

// Setup margins
const margin = { top: 15, bottom: 30, left: 40, right: 20 };
var width = width - margin.left - margin.right;
var height = height - margin.top - margin.bottom;

var popDomainHeight = 150;
var samplingDomainHeight = 150;

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
  .text("Sampling Distribution");

// Create plots
const popPlot = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const samplingPlot = svg
  .append("g")
  .attr("transform", `translate(${width / 2 + margin.left}, ${margin.top})`);

const xscale_sampling = d3
  .scaleLinear()
  .domain([-2, 2])
  .range([0, width / 2 - margin.left]);

const xscale_pop = d3
  .scaleLinear()
  .domain([-3, 3])
  .range([0, width / 2 - margin.left]);

const yscale_sampling = d3
  .scaleLinear()
  .domain([0, samplingDomainHeight])
  .range([height, 0]);

const yscale_pop = d3
  .scaleLinear()
  .domain([0, popDomainHeight])
  .range([height, 0]);

const xaxis_sampling = d3.axisBottom().scale(xscale_sampling);
const xaxis_pop = d3.axisBottom().scale(xscale_pop);
const yaxis_samping = d3.axisLeft().scale(yscale_sampling);
const yaxis_pop = d3.axisLeft().scale(yscale_pop);

samplingPlot
  .append("g")
  .attr("transform", `translate(0,${height})`)
  .call(xaxis_sampling);
  samplingPlot.append("g").call(yaxis_samping);

popPlot
  .append("g")
  .attr("transform", `translate(0,${height})`)
  .call(xaxis_pop);
popPlot.append("g").call(yaxis_pop);

// Add pop hist
var pop_hist = d3
    .histogram()
    .value(d => {
    return d.x;
    })
    .domain(xscale_pop.domain())
    .thresholds(16);

var pop_bins = pop_hist(popSample);

popPlot
    .selectAll("rect")
    .data(pop_bins)
    .enter()
    .append("rect")
    .attr("width", function(d) {
    return xscale_pop(d.x1) - xscale_pop(d.x0);
    })
    .attr("height", function(d) {
    return height - yscale_pop(d.length);
    })
    .attr("transform", function(d) {
    return "translate(" + xscale_pop(d.x0) + "," + yscale_pop(d.length) + ")";
    })
    .attr("fill", "steelblue");

// Add sampling hist
var sampling_hist = d3
  .histogram()
  .value(d => {
    return d.x;
  })
  .domain(xscale_sampling.domain())
  .thresholds(32);

var sampling_bins = sampling_hist(sampleMeans);

samplingPlot
  .selectAll("rect")
  .data(sampling_bins)
  .enter()
  .append("rect")
  .attr("width", function(d) {
    return xscale_sampling(d.x1) - xscale_sampling(d.x0);
  })
  .attr("height", function(d) {
    return height - yscale_sampling(d.length);
  })
  .attr("transform", function(d) {
    return "translate(" + xscale_sampling(d.x0) + "," + yscale_sampling(d.length) + ")";
  })
  .attr("fill", "steelblue");

// Add Interactivity
update_plots_pts = function() {
  get_population();
  generate_sample_means();

  pop_bins = pop_hist(popSample);
  sampling_bins = sampling_hist(sampleMeans);

  popPlot
      .selectAll("rect")
      .data(pop_bins)
      .transition()
      .attr("width", function(d) {
        return xscale_pop(d.x1) - xscale_pop(d.x0);
      })
      .attr("height", function(d) {
        return height - yscale_pop(d.length);
      })
      .attr("transform", function(d) {
        return "translate(" + xscale_pop(d.x0) + "," + yscale_pop(d.length) + ")";
      })
      .attr("fill", "steelblue");

  samplingPlot
      .selectAll("rect")
      .data(sampling_bins)
      .transition()
      .attr("width", function(d) {
          return xscale_sampling(d.x1) - xscale_sampling(d.x0);
      })
      .attr("height", function(d) {
          return height - yscale_sampling(d.length);
      })
      .attr("transform", function(d) {
          return "translate(" + xscale_sampling(d.x0) + "," + yscale_sampling(d.length) + ")";
      })
      .attr("fill", "steelblue");
};

on_slider_input = function() {
  popMean = parseInt(d3.select("#meanSlider").property("value"));
  d3.select("#meanSliderLabel").html(`mean: ${popMean}`);

  popSD = parseInt(d3.select("#sdSlider").property("value"));
  d3.select("#sdSliderLabel").html(`sd: ${popSD}`);
};

d3.select("#meanSlider")
  .attr("value", popMean)
  .attr("max", "2")
  .attr("min", "-2")
  .attr("step", "1");

d3.select("#sdSlider")
  .attr("value", popSD)
  .attr("max", "3")
  .attr("min", "1")
  .attr("step", "1");

d3.select("#meanSlider")
  .on("input", on_slider_input)
  .on("change", update_plots_pts);

d3.select("#sdSlider")
  .on("input", on_slider_input)
  .on("change", update_plots_pts);

// Make labels nice
d3.selectAll("label")
  .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
  .style("font-size", "1.2em");
