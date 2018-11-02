import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

// At the very least you'll need scales, and
// you'll need to read in the file. And you'll need
// and svg, too, probably.

var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var pie = d3.pie().value(function(d) {
  return +d.minutes
})

var radius = 130

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

var labelArc = d3
  .arc()
  .innerRadius(150)
  .outerRadius(radius)

var colorScale = d3
  .scaleOrdinal()
  .domain(['Reading StackOverflow', 'Typing code', 'Rewriting code'])
  .range(['#F6BF85', '#7FC97F', '#BEAED4'])

d3.csv(require('./data/time-breakdown.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  console.log(datapoints)

  var container = svg
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`)


  container
    .selectAll('path')
    .data(pie(datapoints))
    .enter()
    .append('path')
    .attr('d', d => arc(d))
    .attr('fill', d => colorScale(d.data.task))

  container
    .selectAll('.text')
    .data(pie(datapoints))
    .enter()
    .append('text')
    .text(d => d.data.task)
    .attr('transform', function(d) {
      return 'translate(' + labelArc.centroid(d) + ')'
    })
    .attr('text-anchor', function(d) {
      if (d.startAngle > Math.PI) {
        return 'end'
      } else {
        return 'start'
      }
    })
}
