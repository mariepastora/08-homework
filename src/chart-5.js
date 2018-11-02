import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }

var height = 450 - margin.top - margin.bottom

var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 65

let radiusScale = d3
  .scaleLinear()
  .domain([0, 70])
  .range([36, radius])

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

var xPositionScale = d3.scaleBand().range([0, width])

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {


  var holder = svg
    .append('g')
    // .attr('transform', 'translate(200,200)')
    .attr('transform', `translate(${width / 10}, 0)`)


  let bands = [20, 40, 60, 80, 100]
  let labels = [20, 60, 100]

  var nested = d3
    .nest()
    .key(function(d) {
      return d.city
    })
    .entries(datapoints)

  var names = nested.map(d => d.key)
  xPositionScale.domain(names)

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

      console.log(d)

      var datapointsLastMonth = d.values
      datapointsLastMonth.push(d.values[0])
      g.datum(datapointsLastMonth)
        .append('path')
        .attr('d', line)
        .attr('fill', 'rgba(230, 173, 173, 1)')
        // .attr('opacity', 1)
        .attr('stroke', 'none')



      g.selectAll('.text-band')
        .data(labels)
        .enter()
        .append('text')
        .text(d => d + '°')
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('dy', -1)
        .attr('font-size', 8)

        g
    .selectAll('.scale-band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', 'none')
    .attr('stroke', 'grey')
    .attr('cx', 0)
    .attr('cy', 0)


      g.datum(d)
        .append('text')
        .text(function(d) {
          return d.key
        })
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', 0)
        .attr('font-weight', 'bold')
        .attr('font-size', 14)
    })
}
