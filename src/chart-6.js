import * as d3 from 'd3'

let margin = { top: 20, left: 10, right: 10, bottom: 20 }
let height = 400 - margin.top - margin.bottom
let width = 400 - margin.left - margin.right

let svg = d3
  .select('#chart-6')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

d3.csv(require('./data/ratings.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

let radius = 170

let radiusScale = d3
  .scaleLinear()
  // .domain([0, 10])
  .range([0, radius])

var angleScale = d3
  .scaleBand()
  // .domain(months)
  .range([0, Math.PI * 2])

var line = d3
  .radialLine()
  .radius(d => radiusScale(+d.score))
  .angle(d => angleScale(d.category))

function ready(datapoints) {
  datapoints.push(datapoints[0])
  var categories = datapoints.map(d => d.category)
  angleScale.domain(categories)

  var maxRadius = d3.max(datapoints, function(d) {
    return +d.score
  })

  radiusScale.domain([0, maxRadius])

  var holder = svg
    .append('g')
    // .attr('transform', 'translate(200,200)')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  let bands = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

  holder
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'rgba(255, 0, 0, 0.1)')
    // .attr('fill', 'red')
    // .attr('opacity', 1)
    .attr('stroke', 'grey')
    .attr('stroke-width', 1)

  holder
    .selectAll('.scale-band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', 'none')
    .attr('stroke', 'silver')
    .attr('cx', 0)
    .attr('cy', 0)

  holder
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 4)
    .attr('fill', '#666666')

  // appending lines
// Poping the last category we added to make sure the stroke was complete

categories.pop()

  holder
    .selectAll('.scale')
    .data(categories)
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', 0)
    .attr('y2', -radiusScale(maxRadius))
    .attr('stroke', 'silver')
    .attr('stroke-width', 1)
    .attr('transform', 
    	function(d){
    	return `rotate(${angleScale(d)/Math.PI*180})`})


// text

  holder
    .selectAll('.scale-text')
    .data(categories)
    .enter()
    .append('text')
    .text(d=>d)
    .attr('fill', 'black')
    .attr('x', 0)
    .attr('y', -radiusScale(maxRadius))
    .attr('dy', -10)
    .attr('transform', 
    	function(d){
    	return `rotate(${angleScale(d)/Math.PI*180})`})
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('font-weight', 'bold')


    

}
