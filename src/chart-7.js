import * as d3 from 'd3'

var margin = { top: 0, left: 0, right: 0, bottom: 0 }
var height = 600 - margin.top - margin.bottom
var width = 600 - margin.left - margin.right

var svg = d3
  .select('#chart-7')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 300

let radiusScale = d3
  .scaleLinear()
  .domain([0, 90000])
  .range([0, radius])

var times = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00'
]

var angleScale = d3.scaleBand().range([0, Math.PI * 2])

var line = d3
  .radialArea()
  .innerRadius(d => radiusScale(40000))
  .outerRadius(d => radiusScale(+d.total))
  .angle(d => angleScale(d.time))

// var colorScaleBelowAverage = d3.scaleSequential(d3.interpolateCool).domain([10000, 60000])
// var colorScaleAboveAverage = d3.scaleSequential(d3.interpolateOranges).domain([20000,100000])

var colorScale = d3.scaleSequential(d3.interpolateRdYlBu)

d3.csv(require('./data/time-binned.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])

  var domainAngle = datapoints.map(d => d.time)

  angleScale.domain(domainAngle)

  var minBabies = d3.min(datapoints, function(d) {
    return +d.total
  })
  var maxBabies = d3.max(datapoints, function(d) {
    return +d.total
  })

  colorScale.domain([maxBabies, minBabies])

  var holder = svg
    .append('g')
    // .attr('transform', 'translate(200,200)')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  let band = [60000]

  holder
    .selectAll('.scale-band')
    .data(band)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', 'none')
    .attr('stroke', 'grey')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('stroke-width', 2)

  holder
    .selectAll('.scale-circle')
    .data(times)
    .enter()
    .append('circle')
    .attr('fill', 'grey')
    .attr('cx', 0)
    .attr('cy', -radiusScale(60000))
    .attr('transform', function(d) {
      return `rotate(${(angleScale(d) / Math.PI) * 180})`
    })
    .attr('r', 4)
    .attr('stroke-width', 3)
    .attr('stroke', 'white')

  holder
    .selectAll('.scale-text')
    .data(times)
    .enter()
    .append('text')
    .text(function(d) {
      if (d === '00:00') {
        return 'Midnight'
      } else {
        return d.replace(':00', '')
      }
    })
    .attr('fill', 'grey')
    .attr('x', 0)
    .attr('y', -radiusScale(60000))
    .attr('dy', 20)
    .attr('transform', function(d) {
      return `rotate(${(angleScale(d) / Math.PI) * 180})`
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)

  holder
    .append('mask')
    .attr('id', 'births')
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'white')
    // .attr('opacity', 1)
    .attr('stroke', 'none')
    .raise()

  var colorBands = d3.range(0, 90000, 2000)

  holder
    .append('g')
    .attr('mask', 'url(#births)')
    .selectAll('.color-bands')
    .data(colorBands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(+d))
    .attr('fill', function(d) {
      // 	if (+d < 40000){
      // 		return colorScaleBelowAverage(+d)
      // 	}
      // 	else{
      // 		return colorScaleAboveAverage(+d)
      // 	}
      return colorScale(+d)
    })
    .attr('cx', 0)
    .attr('cy', 0)
    .lower()

  holder
    .append('text')
    .attr('dy', '-2em')
    .text('EVERYONE!')
    .attr('text-anchor', 'middle')
    .attr('font-weight', 'bold')
    .attr('font-size', 20)

  holder
    .append('text')
    .attr('dy', '-1em')
    .text('is born at 8am')
    .attr('text-anchor', 'middle')
    .attr('font-weight', 'bold')
    .attr('font-size', 15)

  holder
    .append('text')
    .attr('dy', '1em')
    .text('(read Macbeth for details)')
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
}
