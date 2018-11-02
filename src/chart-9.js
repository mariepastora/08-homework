import * as d3 from 'd3'

let margin = { top: 20, left: 20, right: 20, bottom: 20 }

let height = 430 - margin.top - margin.bottom
let width = 370 - margin.left - margin.right

let radius = 120

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
  .angle(function(d) {
    if (d.name != 'Name' && d.name != 'Team') {
      return angleScale(d.name)
    }
  })

d3.csv(require('./data/nba.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  var allPlayers = []

  let maxMinutes = 40
  let maxPoints = 30
  let maxFieldGoals = 10
  let max3PointsFieldGoals = 5
  let maxFreeThrows = 10
  let maxRebounds = 15
  let maxAssists = 10
  let maxSteals = 5
  let maxBlocks = 5

  // This is potentially garbage!!

  var i
  for (i = 0; i < datapoints.length; i++) {
    var player = datapoints[i]

    var playerIndexed = [
      { name: 'Minutes', value: player.MP / maxMinutes },
      { name: 'Points', value: player.PTS / maxPoints },
      { name: 'Field Goals', value: player.FG / maxFieldGoals },
      {
        name: '3-Point Field Goals',
        value: player['3P'] / max3PointsFieldGoals
      },
      { name: 'Free Throws', value: player.FT / maxFreeThrows },
      { name: 'Rebounds', value: player.TRB / maxRebounds },
      { name: 'Assists', value: player.AST / maxAssists },
      { name: 'Steals', value: player.STL / maxSteals },
      { name: 'Blocks', value: player.BLK / maxBlocks }
    ]
    allPlayers.push(playerIndexed)
  }

  console.log(allPlayers)
  var holder = d3.select('#chart-9')

  var categories = allPlayers[0].map(d => d.name)
  angleScale.domain(categories)

  console.log(categories)

  // NOW that I've defined categories,
  // Ugh
  // I guuuuess I can add a name and a team and THEN bam I can nest
  //   for (i = 0; i < datapoints.length; i++) {
  //   	var player = datapoints[i]

  //     allPlayers[i].push(
  //     { name: 'Name', value: player.Name },
  //     { name: 'Team', value: player.Team }
  //   )
  // }
  // console.log(allPlayers)

  // Creating teams full names!
  // We'll make a variable called team in which we'll store this info

  var nested = d3.nest().entries(allPlayers)

  console.log(nested)

  let bands = [0.2, 0.4, 0.6, 0.8, 1]

  holder
    .selectAll('.temp-graph')
    .data(datapoints)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${width / 2 + margin.left}, ${height / 2})`)
    .each(function(d) {
      console.log('HI THERE', datapoints)
      let player = datapoints[0]

      let nameTeam = datapoints[0].Team
      let namePlayer = datapoints[0].Name

      let playerOne = [
        { name: 'Minutes', value: player.MP / maxMinutes },
        { name: 'Points', value: player.PTS / maxPoints },
        { name: 'Field Goals', value: player.FG / maxFieldGoals },
        {
          name: '3-Point Field Goals',
          value: player['3P'] / max3PointsFieldGoals
        },
        { name: 'Free Throws', value: player.FT / maxFreeThrows },
        { name: 'Rebounds', value: player.TRB / maxRebounds },
        { name: 'Assists', value: player.AST / maxAssists },
        { name: 'Steals', value: player.STL / maxSteals },
        { name: 'Blocks', value: player.BLK / maxBlocks }
      ]

      var g = d3.select(this)

      console.log(nameTeam)
      g.append('mask')
        .attr('id', `player-${namePlayer.replace(' ', '-')}`)
        .datum(playerOne)
        .append('path')
        .attr('d', line)
        .attr('fill', 'white')
        // .attr('opacity', 1)
        .attr('stroke', 'none')
        .raise()

      // Category texts

      g.append('g')
        .attr('class', nameTeam)

        .attr('mask', `url(#player-${namePlayer.replace(' ', '-')})`)
        .selectAll('.color-band')
        .data(bands)
        .enter()
        .append('circle')
        .attr('r', d => radiusScale(d))
        .attr('stroke', 'none')
        .attr('cx', 0)
        .attr('cy', 0)
        .lower()

      g.selectAll('.category-text')
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

      g.selectAll('.scale-band')
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

      g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 3)
        .attr('fill', 'white')

      // I'm lazy sooo we'll add each scale info individually

      g.selectAll('.scale-text')
        .data(bands)
        .enter()
        .append('text')
        .text(d => d * maxMinutes)
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('dy', -3)
        .attr('font-size', 10)

      g.selectAll('.scale-text')
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

      g.selectAll('.scale-text')
        .data(bands)
        .enter()
        .append('text')
        .text(d => d * maxFieldGoals)
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('dy', -3)
        .attr('font-size', 10)
        .attr(
          'transform',
          `rotate(${(angleScale('Field Goals') / Math.PI) * 180})`
        )

      g.selectAll('.scale-text')
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

      g.selectAll('.scale-text')
        .data(bands)
        .enter()
        .append('text')
        .text(d => d * maxFreeThrows)
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('dy', -3)
        .attr('font-size', 10)
        .attr(
          'transform',
          `rotate(${(angleScale('Free Throws') / Math.PI) * 180})`
        )

      g.selectAll('.scale-text')
        .data(bands)
        .enter()
        .append('text')
        .text(d => d * maxRebounds)
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('dy', -3)
        .attr('font-size', 10)
        .attr(
          'transform',
          `rotate(${(angleScale('Rebounds') / Math.PI) * 180})`
        )

      g.selectAll('.scale-text')
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

      g.selectAll('.scale-text')
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

      g.selectAll('.scale-text')
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

      g.append('text')
        .text(namePlayer)
        .attr('x', 0)
        .attr('y', -radiusScale(1))
        .attr('dy', -60)
        .attr('font-size', 20)
        .attr('text-anchor', 'middle')

      if (nameTeam === 'CLE') {
        var team = 'Cleveland Cavaliers'
      } else if (nameTeam === 'GSW') {
        var team = 'Golden State Warriors'
      } else if (nameTeam === 'HOU') {
        var team = 'Houston Rockets'
      } else if (nameTeam === 'SAS') {
        var team = 'San Antonio Spurs'
      } else if (nameTeam === 'NOP') {
        var team = 'New Orleans Pelicans'
      } else if (nameTeam === 'MIL') {
        var team = 'Milwaukee Bucks'
      } else if (nameTeam === 'OKC') {
        var team = 'Oklahoma City Thunder'
      } else if (nameTeam === 'PHI') {
        var team = 'Philadelphia 76ers'
      } else if (nameTeam === 'MIN') {
        var team = 'Minnesota Timberwolves'
      }

      g.append('text')
        .text(team)
        .attr('x', 0)
        .attr('y', -radiusScale(1))
        .attr('dy', -44)
        .attr('text-anchor', 'middle')
        .attr('font-size', 14)

      // NOW that I've defined categories,
      // Ugh
      // I guuuuess I can add a name and a team and THEN bam I can nest
      datapoints.shift()

      // console.log(allPlayers)
    })
}
