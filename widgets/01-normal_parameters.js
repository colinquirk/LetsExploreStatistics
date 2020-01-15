var standard_normal = [];

for (var i = -10; i <= 10; i = i + 0.1) {
  standard_normal.push([i, jStat.normal.pdf(i, 0, 1)]);
}


