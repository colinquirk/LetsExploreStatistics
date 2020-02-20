// Generate data
var data = [];
var userPoint = [];
var fillData = [];

for (i = -5; i <= 5; i = i + 0.1) {
  data.push({
    x: i,
    pdf_y: jStat.normal.pdf(i, 0, 1),
    cdf_y: jStat.normal.cdf(i, 0, 1)
  });
}

updateUserPoint = function(userX) {
  var x = d3.min([5, d3.max([-5, userX])]);

  userPoint = [
    { x: x, pdf_y: jStat.normal.pdf(x, 0, 1), cdf_y: jStat.normal.cdf(x, 0, 1) }
  ];
};

updateUserPoint(0);

updatePdfFill = function(userX) {
  fillData = [];

  for (i = 0; i < data.length; i++) {
    if (data[i].x <= userX) {
      fillData.push(data[i]);
    } else {
      fillData.push({
        x: userX,
        pdf_y: jStat.normal.pdf(userX, 0, 1)
      });
      fillData.push({
        x: userX,
        pdf_y: 0
      });
      break;
    }
  }
};

updatePdfFill(0);

// Set up plot area
const margin = { top: 15, bottom: 30, left: 40, right: 20 };
var width = width - margin.left - margin.right;
var height = height - margin.top - margin.bottom;

const pdfPlot = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const cdfPlot = svg
  .append("g")
  .attr("transform", `translate(${width / 2 + margin.left}, ${margin.top})`);

const xscale = d3
  .scaleLinear()
  .domain([-5, 5])
  .range([0, width / 2 - margin.left]);

const yscale = d3
  .scaleLinear()
  .domain([0, 1])
  .range([height, 0]);

const xaxis = d3.axisBottom().scale(xscale);
const yaxis = d3.axisLeft().scale(yscale);

pdfPlot
  .append("g")
  .attr("transform", `translate(0,${height})`)
  .call(xaxis);
pdfPlot.append("g").call(yaxis);

cdfPlot
  .append("g")
  .attr("transform", `translate(0,${height})`)
  .call(xaxis);
cdfPlot.append("g").call(yaxis);

svg.style("user-select", "none");

// Create elements
var pdfLine = d3
  .line()
  .x(function(d) {
    return xscale(d.x);
  })
  .y(function(d) {
    return yscale(d.pdf_y);
  })
  .curve(d3.curveMonotoneX);

var cdfLine = d3
  .line()
  .x(function(d) {
    return xscale(d.x);
  })
  .y(function(d) {
    return yscale(d.cdf_y);
  })
  .curve(d3.curveMonotoneX);

pdfPlot
  .append("path")
  .attr("class", "distLine")
  .datum(data)
  .attr("d", pdfLine);

cdfPlot
  .append("path")
  .attr("class", "distLine")
  .datum(data)
  .attr("d", cdfLine);

svg
  .selectAll(".distLine")
  .style("fill", "none")
  .style("stroke-width", 2)
  .style("stroke", "black");

pdfPlot
  .selectAll(".dot")
  .data(userPoint)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("r", 8)
  .attr("cx", function(d) {
    return xscale(d.x);
  })
  .attr("cy", function(d) {
    return yscale(d.pdf_y);
  });

cdfPlot
  .selectAll(".dot")
  .data(userPoint)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("r", 8)
  .attr("cx", function(d) {
    return xscale(d.x);
  })
  .attr("cy", function(d) {
    return yscale(d.cdf_y);
  });

pdfPlot
  .append("path")
  .attr("class", "fillDist")
  .datum(fillData)
  .attr("d", pdfLine)
  .style("fill", "blue")
  .style("fill-opacity", 0.125);

// Add interactivity
onDrag = function(d) {
  var curx = d3.event.subject.x;
  var eventx = d3.event.x;
  var newx = xscale.invert(xscale(curx) + eventx);

  updateUserPoint(newx);
  updatePdfFill(newx);

  pdfPlot
    .selectAll(".dot")
    .data(userPoint)
    .attr("cx", function(d) {
      return xscale(d.x);
    })
    .attr("cy", function(d) {
      return yscale(d.pdf_y);
    });

  cdfPlot
    .selectAll(".dot")
    .data(userPoint)
    .attr("cx", function(d) {
      return xscale(d.x);
    })
    .attr("cy", function(d) {
      return yscale(d.cdf_y);
    });

  pdfPlot
    .selectAll(".fillDist")
    .datum(fillData)
    .attr("d", pdfLine);
};

drag = d3.drag().on("drag", onDrag);

svg.selectAll(".dot").call(drag);
