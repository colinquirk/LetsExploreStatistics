//Helpers
//https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

function mean(values) {
    sum = 0;
    for(i=0; i < values.length; i++) {
        sum += values[i];
    }
    return sum / values.length
}

// Set up data
var nSamples = 100
var sample_n = 20;
var sd = 1;

var data_sample = [];
var data_sample_obj = [];
var sample_means = [];

function get_sample_data() {
    data_sample = [];
    data_sample_obj = [];
    var value = 0;
    for (var i=0; i < sample_n; i++) {
        value = jStat.normal.sample(0, sd);
        data_sample.push(value);
        data_sample_obj.push({x: value});
    }
}

function get_sample_means() {
    sample_means = [];
    for (var i=0; i < nSamples; i++) {
        for (var j=0; j < sample_n; j++) {
            get_sample_data()
        }
        sample_means.push({x: mean(data_sample)})
    }
}

get_sample_means();

// Setup margins
const margin = { top: 15, bottom: 30, left: 40, right: 20 };
var width = width - margin.left - margin.right;
var height = height - margin.top - margin.bottom;

var domainHeight = 60;

// Add titles
svg
  .append("text")
  .attr("x", width / 4 + margin.left / 2)
  .attr("y", margin.top)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Sample Distribution");

svg
  .append("text")
  .attr("x", (3 * width) / 4 + margin.left / 2)
  .attr("y", margin.top)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Sampling Distribution");

// Create plots
const samplePlot = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const samplingPlot = svg
  .append("g")
  .attr("transform", `translate(${width / 2 + margin.left}, ${margin.top})`);

const xscale_sampling = d3
  .scaleLinear()
  .domain([-2, 2])
  .range([0, width / 2 - margin.left]);

const xscale_sample = d3
  .scaleLinear()
  .domain([-3, 3])
  .range([0, width / 2 - margin.left]);

const yscale_sampling = d3
  .scaleLinear()
  .domain([0, domainHeight])
  .range([height, 0]);

const yscale_sample = d3
  .scaleLinear()
  .domain([0, domainHeight])
  .range([height, 0]);

const xaxis_sampling = d3.axisBottom().scale(xscale_sampling);
const xaxis_sample = d3.axisBottom().scale(xscale_sample);
const yaxis_samping = d3.axisLeft().scale(yscale_sampling);
const yaxis_sample = d3.axisLeft().scale(yscale_sample);

samplingPlot
  .append("g")
  .attr("transform", `translate(0,${height})`)
  .call(xaxis_sampling);
  samplingPlot.append("g").call(yaxis_samping);

samplePlot
  .append("g")
  .attr("transform", `translate(0,${height})`)
  .call(xaxis_sample);
samplePlot.append("g").call(yaxis_sample);

// Add sample hist
var sample_hist = d3
    .histogram()
    .value(d => {
    return d.x;
    })
    .domain(xscale_sample.domain())
    .thresholds(16);

var sample_bins = sample_hist(data_sample_obj);

samplePlot
    .selectAll("rect")
    .data(sample_bins)
    .enter()
    .append("rect")
    .attr("width", function(d) {
    return xscale_sample(d.x1) - xscale_sample(d.x0);
    })
    .attr("height", function(d) {
    return height - yscale_sample(d.length);
    })
    .attr("transform", function(d) {
    return "translate(" + xscale_sample(d.x0) + "," + yscale_sample(d.length) + ")";
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

var sampling_bins = sampling_hist(sample_means);

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
update_plots = function() {
    get_sample_means();
    sample_bins = sample_hist(data_sample_obj);
    sampling_bins = sampling_hist(sample_means);

    samplePlot
        .selectAll("rect")
        .data(sample_bins)
        .transition()
        .attr("width", function(d) {
        return xscale_sample(d.x1) - xscale_sample(d.x0);
        })
        .attr("height", function(d) {
        return height - yscale_sample(d.length);
        })
        .attr("transform", function(d) {
        return "translate(" + xscale_sample(d.x0) + "," + yscale_sample(d.length) + ")";
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
    sample_n = d3.select("#nSlider2").property("value");
    d3.select("#nSliderLabel2").html(`n: ${sample_n}`);

    sd = d3.select("#sdSlider").property("value");
    d3.select("#sdSliderLabel").html(`sd: ${sd}`);
};

d3.select("#nSlider2")
    .attr("value", sample_n)
    .attr("max", "200")
    .attr("min", "10")
    .attr("step", "10");

d3.select("#sdSlider")
    .attr("value", sd)
    .attr("max", "3")
    .attr("min", "1")
    .attr("step", "1");

d3.select("#nSlider2")
    .on("input", on_slider_input)
    .on("change", update_plots);

d3.select("#sdSlider")
    .on("input", on_slider_input)
    .on("change", update_plots);

// Make labels nice
d3.selectAll("label")
    .style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif")
    .style("font-size", "1.2em");
