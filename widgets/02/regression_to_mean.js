// Generate data
var n = 1000;
var skills = [];
var test1 = [];
var test2 = [];
var lowCutoff = 0;
var highCutoff = 0;

function generateSkills() {
    skills = [];
    for (i=0; i<n; i++) {
        skills.push(Math.round(jStat.normal.sample(0, 130)))
    }
}

function generateTestScores() {
    test1 = [];
    test2 = [];

    for (i=0; i<n; i++) {
        var score1 = Math.round(jStat.normal.sample(1100, 100) + skills[i]);
        var score2 = Math.round(jStat.normal.sample(1100, 100) + skills[i]);
        test1.push({x:i, y:Math.max(600, Math.min(1600, score1))});
        test2.push({x:i, y:Math.max(600, Math.min(1600, score2))});
    }
}

function calculateCutoffs() {
    var scores = [];
    for (i=0; i<test1.length; i++) {
        scores.push(test1[i].y);
    }
    scores.sort(function(a, b){return a-b});
    lowCutoff = scores[50];
    highCutoff = scores[950];
}

generateSkills();
generateTestScores();
calculateCutoffs();

console.log(lowCutoff);
console.log(highCutoff);

// Setup plots
const margin = {top: 30, bottom: 30, left: 30, right: 30};
var width = width - margin.left - margin.right;
var height = height - margin.top - margin.bottom;

const xscale = d3.scaleLinear()
  .domain([600, 1600])
  .range([0, width/2 - margin.left]);

const yscalePop = d3.scaleLinear()
  .domain([0, 100])
  .range([height, 0]);

const yscaleSamp = d3.scaleLinear()
  .domain([0, 50])
  .range([height / 2 - margin.top, 0]);

const xaxis = d3.axisBottom().scale(xscale);
const yaxisPop = d3.axisLeft().scale(yscalePop);
const yaxisSamp = d3.axisLeft().scale(yscaleSamp);

const popPlot = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const lowSamplePlot = svg.append('g')
  .attr('transform', `translate(${(width / 2) + margin.left}, ${margin.top})`);

const highSamplePlot = svg.append('g')
  .attr('transform', `translate(${(width / 2) + margin.left}, ${height / 2 + margin.top})`);

popPlot.append('g')
  .attr('transform',`translate(0,${height})`)
  .call(xaxis);
popPlot.append('g').call(yaxisPop);

lowSamplePlot.append('g')
  .attr('transform',`translate(0,${height / 2 - margin.top})`)
  .call(xaxis);
lowSamplePlot.append('g').call(yaxisSamp);

highSamplePlot.append('g')
  .attr('transform',`translate(0,${height / 2})`)
  .call(xaxis);
highSamplePlot.append('g')
  .attr('transform',`translate(0,${margin.top})`)
  .call(yaxisSamp);

svg.append("text")
  .attr("x", width / 4 + margin.left / 2)
  .attr("y", margin.top)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("All SAT Scores");

svg.append("text")
  .attr("x", 3 * width / 4 + margin.left / 2)
  .attr("y", margin.top)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("Low Scorers - Test 2 Score");

svg.append("text")
  .attr("x", 3 * width / 4 + margin.left / 2)
  .attr("y", height / 2 + margin.top * 2)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .text("High Scorers - Test 2 Score");

// Plot data
var hist = d3.histogram()
  .value((d) => {return d.y;})
  .domain(xscale.domain())
  .thresholds(32);

var test1Bins = hist(test1);

popPlot
  .selectAll("rect")
  .data(test1Bins)
  .enter().append("rect")
    .attr("width", function(d) {return xscale(d.x1) - xscale(d.x0);})
    .attr("height", function(d) {return height - yscalePop(d.length);})
    .attr("transform", function(d) {
      return "translate(" + xscale(d.x0) + "," + yscalePop(d.length) + ")"; })
    .attr("fill", "steelblue");

function drawCutoffs() {
  popPlot.append("line")
    .attr("x1", xscale(lowCutoff))
    .attr("y1", 0 + margin.top)
    .attr("x2", xscale(lowCutoff))
    .attr("y2", height)
    .attr("class", "cutoffLine")
    .style("stroke-width", 2)
    .style("stroke", "black")
    .style("fill", "none");
  
  popPlot.append("line")
    .attr("x1", xscale(highCutoff))
    .attr("y1", 0 + margin.top)
    .attr("x2", xscale(highCutoff))
    .attr("y2", height)
    .attr("class", "cutoffLine")
    .style("stroke-width", 2)
    .style("stroke", "black")
    .style("fill", "none");
}

drawCutoffs();

// Add interactivity
updatePlots = function() {
  svg.selectAll(".cutoffLine").remove();
  drawCutoffs();

  popPlot.selectAll("rect")
    .data(test1Bins)
    .transition()
    .attr("height", function(d) {return height - yscalePop(d.length);})
    .attr("transform", function(d) {
      return "translate(" + xscale(d.x0) + "," + yscalePop(d.length) + ")"; })
    .attr("fill", "steelblue");
  }

d3.select('#newSampleButton')
  .on('click', function() {
    d3.event.preventDefault();
    generateSkills();
    generateTestScores();
    calculateCutoffs();
    test1Bins = hist(test1);

    updatePlots();
  });