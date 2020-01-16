var array1 = Random_normal_Dist(30, 15);
var array2 = Random_normal_Dist(30, 10);

var x = d3.scaleLinear()
  .rangeRound([0, width]);

//Min q
var d1 = d3.min(array1, function (d) { return d.q; });
var d2 = d3.min(array2, function (d) { return d.q; });
var min_d = d3.min([d1, d2]);

//Max q
d1 = d3.max(array1, function (d) { return d.q; });
d2 = d3.max(array2, function (d) { return d.q; });
var max_d = d3.max([d1, d2]);

//Max p
d1 = d3.max(array1, function (d) { return d.p; });
d2 = d3.max(array2, function (d) { return d.p; });
var max_p = d3.max([d1, d2]);

x.domain([min_d, max_d]).nice;

var y = d3.scaleLinear()
  .domain([0, max_p])
  .range([height, 0]);

svg
  .append("g")

var gX = svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

var line = d3.line()
  .x(function (d) { return x(d.q); })
  .y(function (d) { return y(d.p); });

svg.append("path")
  .datum(array1)
  .attr("d", line)
  .style("fill", "#fdae61")
  .style("opacity", "0.5")
  .style("stroke-width", 2)
  .style("stroke", "black");

svg.append("path")
  .datum(array2)
  .attr("d", line)
  .style("fill", "#4393c3")
  .style("opacity", "0.5")
  .style("stroke-width", 2)
  .style("stroke", "black");


function Random_normal_Dist(mean, sd) {
    data = [];
    for (var i = mean - 4 * sd; i < mean + 4 * sd; i += 1) {
        q = i;
        p = jStat.normal.pdf(i, mean, sd);
        arr = {
            "q": q,
            "p": p
        };
        data.push(arr);
    }
    return data;
}
