import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-3b')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 60

let radiusScale = d3
  .scaleLinear()
  .domain([0, 70])
  .range([0, radius])

let months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

var angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

var arc = d3
  .arc()
  .innerRadius(d => radiusScale(0))
  .outerRadius(d => radiusScale(d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

var colorScale = d3.scaleLinear().range(['#B6D5E3', '#F4BFCB'])

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

var xPositionScale = d3.scaleBand().range([0, width])

function ready(datapoints) {
  var holder = svg
    .append('g')
    // .attr('transform', 'translate(200,200)')
    .attr('transform', `translate(${width / 10}, 0)`)

  var nested = d3
    .nest()
    .key(function(d) {
      return d.city
    })
    .entries(datapoints)

  var names = nested.map(d => d.key)
  xPositionScale.domain(names)

  var minTemp = d3.min(datapoints, d => +d.high_temp)

  var maxTemp = d3.max(datapoints, d => +d.high_temp)

  colorScale.domain([minTemp, maxTemp])

  holder
    .selectAll('.temp-graph')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      return `translate(${xPositionScale(d.key)}, ${height / 2})`
    })
    .each(function(d) {
      var g = d3.select(this)

      g.selectAll('path')
        .data(d.values)
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(+d.high_temp))

      g.append('text')
        .text(function(d) {
          return d.key
        })
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', 20)
        .attr('dy', 95)

      g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 2)
        .attr('fill', '#666666')
    })
}
