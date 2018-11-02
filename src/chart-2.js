import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' +width/8 + ',' + margin.top + ')')

var pie = d3.pie().value(function(d) {
  return +d.minutes
})

var radius = 70

var xPositionScale = d3
  .scaleBand()
  .range([margin.left, width])

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

var colorScale = d3
  .scaleOrdinal()
  .domain(['Reading StackOverflow', 'Typing code', 'Rewriting code'])
  .range(['#F6BF85', '#7FC97F', '#BEAED4'])

d3.csv(require('./data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  console.log(datapoints)

  var nested = d3
    .nest()
    .key(function(d) {
      return d.project
    })
    .entries(datapoints)
  console.log('this is nested', nested)

  var names = nested.map(d => d.key)


  xPositionScale.domain(names)

  // var holder = svg.append('g').attr('transform', `translate(${width / 6},${height / 6})`)
	svg
    .selectAll('projects-graph')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {

      return `translate(${xPositionScale(d.key)}, ${height / 2})`
    })
    .each(function(d) {
      var g = d3.select(this)

      g.selectAll('path')
        .data(pie(d.values))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))

      g.append('text')
        .text(function(d) {
          return d.key
        })
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', 20)
        .attr('dy', 80)
    })
}
