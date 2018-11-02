import * as d3 from 'd3'

let margin = { top: 20, left: 0, right: 0, bottom: 0 }
let height = 450 - margin.top - margin.bottom
let width = 400 - margin.left - margin.right

let svg = d3
  .select('#chart-8')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 170

// S C A L E S

let radiusScale = d3
  .scaleLinear()
  .domain([0, 1])
  .range([0, radius])

var angleScale = d3
  .scaleBand()
  // .domain(months)
  .range([0, Math.PI * 2])

var line = d3
  .radialLine()
  .radius(d => radiusScale(+d.value))
  .angle(d => angleScale(d.name))

d3.csv(require('./data/nba.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  // Creating max for each category

  let maxMinutes = 40
  let maxPoints = 30
  let maxFieldGoals = 10
  let max3PointsFieldGoals = 5
  let maxFreeThrows = 10
  let maxRebounds = 15
  let maxAssists = 10
  let maxSteals = 5
  let maxBlocks = 5

  // Taking the first player info
  // And then doing a bunch of stuff with it by re-reading the data correctly

  let player = datapoints[0]

  let playerOne = [
    { name: 'Minutes', value: player.MP / maxMinutes },
    { name: 'Points', value: player.PTS / maxPoints },
    { name: 'Field Goals', value: player.FG / maxFieldGoals },
    { name: '3-Point Field Goals', value: player['3P'] / max3PointsFieldGoals },
    { name: 'Free Throws', value: player.FT / maxFreeThrows },
    { name: 'Rebounds', value: player.TRB / maxRebounds },
    { name: 'Assists', value: player.AST / maxAssists },
    { name: 'Steals', value: player.STL / maxSteals },
    { name: 'Blocks', value: player.BLK / maxBlocks }
  ]

  var categories = playerOne.map(d => d.name)

  angleScale.domain(categories)

  var holder = svg
    .append('g')
    .attr(
      'transform',
      `translate(${width / 2},${(height + margin.top * 2) / 2})`
    )

  let bands = [0.2, 0.4, 0.6, 0.8, 1]

  // Making the shape complete!

  playerOne.push(playerOne[0])

  holder
    .append('mask')
    .attr('id', 'stats')
    .append('path')
    .datum(playerOne)
    .attr('d', line)
    .attr('fill', 'white')
    .attr('stroke', 'none')
    .raise()

  // Making the shape colourful

  holder
    .append('g')
    .attr('mask', 'url(#stats)')
    .selectAll('.color-band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('class', 'color-band')
    .attr('r', d => radiusScale(d))
    .attr('fill', 'none')
    .attr('stroke', 'none')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('fill', (d, i) => {
      if (i % 2) {
        return '#FFB81C'
      } else {
        return '#c94435'
      }
      console.log('Looking at circle number', i)
    })
    .lower()

  // Category texts

  holder
    .selectAll('.category-text')
    .data(categories)
    .enter()
    .append('text')
    .text(d => d)
    .attr('fill', 'black')
    .attr('x', 0)
    .attr('y', -radiusScale(1))
    .attr('dy', -15)
    .attr('transform', function(d) {
      return `rotate(${(angleScale(d) / Math.PI) * 180})`
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .attr('font-weight', 'bold')

  // Grey circles!

  holder
    .selectAll('.scale-band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('class', 'scale-band')
    .attr('r', d => radiusScale(d))
    .attr('fill', 'none')
    .attr('stroke', 'none')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('fill', (d, i) => {
      if (i % 2) {
        return '#e8e7e5'
      } else {
        return '#f6f6f6'
      }
      console.log('Looking at circle number', i)
    })
    .lower()

  // Center of the shape

  holder
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 3)
    .attr('fill', 'black')

  // I'm lazy sooo we'll add each scale info individually

  holder
    .selectAll('.scale-text')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d * maxMinutes)
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -3)
    .attr('font-size', 10)

  holder
    .selectAll('.scale-text')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d * maxPoints)
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -3)
    .attr('font-size', 10)
    .attr('transform', `rotate(${(angleScale('Points') / Math.PI) * 180})`)

  holder
    .selectAll('.scale-text')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d * maxFieldGoals)
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -3)
    .attr('font-size', 10)
    .attr('transform', `rotate(${(angleScale('Field Goals') / Math.PI) * 180})`)

  holder
    .selectAll('.scale-text')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d * max3PointsFieldGoals)
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -3)
    .attr('font-size', 10)
    .attr(
      'transform',
      `rotate(${(angleScale('3-Point Field Goals') / Math.PI) * 180})`
    )

  holder
    .selectAll('.scale-text')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d * maxFreeThrows)
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -3)
    .attr('font-size', 10)
    .attr('transform', `rotate(${(angleScale('Free Throws') / Math.PI) * 180})`)

  holder
    .selectAll('.scale-text')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d * maxRebounds)
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -3)
    .attr('font-size', 10)
    .attr('transform', `rotate(${(angleScale('Rebounds') / Math.PI) * 180})`)

  holder
    .selectAll('.scale-text')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d * maxAssists)
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -3)
    .attr('font-size', 10)
    .attr('transform', `rotate(${(angleScale('Assists') / Math.PI) * 180})`)

  holder
    .selectAll('.scale-text')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d * maxSteals)
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -3)
    .attr('font-size', 10)
    .attr('transform', `rotate(${(angleScale('Steals') / Math.PI) * 180})`)

  holder
    .selectAll('.scale-text')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d * maxBlocks)
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -3)
    .attr('font-size', 10)
    .attr('transform', `rotate(${(angleScale('Blocks') / Math.PI) * 180})`)

  // Adding title and subtitle

  // First by adding Name and Team info to our playerOne array

  playerOne.push(
    { name: 'Name', value: player.Name },
    { name: 'Team', value: player.Team }
  )

  // Creating teams full names!
  // We'll make a variable called team in which we'll store this info

  if (playerOne[11].value === 'CLE') {
    var team = 'Cleveland Cavaliers'
  } else if (playerOne[11].value === 'GSW') {
    var team = 'Golden State Warriors'
  } else if (playerOne[11].value === 'HOU') {
    var team = 'Houston Rockets'
  } else if (playerOne[11].value === 'SAS') {
    var team = 'San Antonio Spurs'
  } else if (playerOne[11].value === 'NOP') {
    var team = 'New Orleans Pelicans'
  } else if (playerOne[11].value === 'MIL') {
    var team = 'Milwaukee Bucks'
  } else if (playerOne[11].value === 'OKC') {
    var team = 'Oklahoma City Thunder'
  } else if (playerOne[11].value === 'PHI') {
    var team = 'Philadelphia 76ers'
  } else if (playerOne[11].value === 'MIN') {
    var team = 'Minnesota Timberwolves'
  }

  svg
    .append('g')
    .datum(playerOne[10].value)
    .append('text')
    .text(d => d)
    .attr('x', width / 2)
    .attr('y', 0)
    // .attr('transform', `translate(${width / 2},0)`)
    .attr('text-anchor', 'middle')

  svg
    .append('g')
    .datum(team)
    .append('text')
    .text(d => d)
    .attr('x', width / 2)
    .attr('y', 0)
    .attr('dy', 17)
    // .attr('transform', `translate(${width / 2},0)`)
    .attr('text-anchor', 'middle')
    .attr('font-size', 13)
}
