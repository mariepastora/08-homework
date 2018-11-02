import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

d3.csv(require('./data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

let radius = 120

let radiusScale = d3
  .scaleLinear()
  .domain([0, 70])
  .range([20, radius])

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

var line = d3
  .radialArea()
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))
  .angle(d => angleScale(d.month_name))

function ready(datapoints) {
  datapoints.push(datapoints[0])

  let bands = [20, 30, 40, 50, 60, 70, 80, 90]
  let labels = [30, 50, 70, 90]

  var holder = svg
    .append('g')
    // .attr('transform', 'translate(200,200)')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  holder
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'rgba(173, 216, 230, 0.7')
    .attr('fill', '#ADD8E6')
    //.attr('opacity', 1)
    .attr('stroke', 'none')

  holder
    .selectAll('.scale-band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', 'none')
    .attr('stroke', 'grey')
    .attr('cx', 0)
    .attr('cy', 0)
   

  holder
    .append('text')
    .text('NYC')
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', 0)
    .attr('dy', 0)
    .attr('font-weight', 'bold')
    .attr('font-size', 23)

   holder
   	.selectAll('.text-band')
   	.data(labels)
    .enter()
    .append('text')
    .text(d => d + '°')
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -3)
    .attr('font-size', 10)



}
