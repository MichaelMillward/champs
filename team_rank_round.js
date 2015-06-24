var team_rank_round = {
  teamSelected: "",
  yearSelected: "",

  drawGraph: function(team, year){
  	this.teamSelected = team;
    this.yearSelected = year;
  	var ranks = this.calculateRank();
    this.refresh();
    this.drawRank(ranks);
  },

  calculateRank: function(){
      var rankings = []; // rankings is a list of the selected teams ranking where index is round.
      var teams = ["NSW Swifts", "Melbourne Vixens", "Central Pulse", "Waikato Bay of Plenty Magic", "Canterbury Tactix", "Southern Steel",
                  "Adelaide Thunderbirds", "Northen Mystics", "West Coast Fever", "Queensland Firebirds"];
      // Find the rank for each year
      var teamPoints = [];
      // First get all the matches for one year for each team
      for(var j = 0; j<teams.length; j++){
      	  // Should be picking a year that the user choses. 
          var matches = this.getYearMatches(teams[j], this.yearSelected);
          var pointsFromYear = this.calculatePoints(matches, teams[j]);
          if(teams[j] === this.teamSelected){
            //console.log("points over round for " + this.teamSelected);
            for(var i = 0; i<pointsFromYear.length; i++){
              //console.log(pointsFromYear[i]);
            }
          }
          teamPoints.push({team: teams[j], points: pointsFromYear});
      }
      // teamPoints is a list of all the different teams and how their points vaired over rounds of a particular year. 

      // Find out many matches were played for the team selected 
      var max;
      var matches = this.getYearMatches(this.teamSelected, this.yearSelected);
      if(this.yearSelected === 2011){
        max = matches.length
      }
      else{
        max = matches[matches.length-1].round;
      }
      console.log("matches: " + max);
      for(var k = 0; k<max; k++){
      	// Now create a list with all the scores from each round. k = round number.
      	var rankingsForYear = [];
      	for(var l = 0; l<teamPoints.length; l++){

      		var teamFocus = teamPoints[l].team;
      		var allpointsforateam = teamPoints[l].points;
          if(allpointsforateam[k] !== undefined){
            rankingsForYear.push({team: teamFocus, points: allpointsforateam[k]});
          }
      	}

      	// rankingsForYear has each team and how many points they had in round k 

      	// Now sort the list
		rankingsForYear.sort(function(a, b){
          return b.points - a.points;
      	});

      	// Find the selected teams positioning on the table and add that to the rankings.
		for(var m = 0; m<rankingsForYear.length; m++){
      //console.log("Team: " + rankingsForYear[m].team + " Rank: " + (m+1) + " Points: " + rankingsForYear[m].points);
      		if(rankingsForYear[m].team == this.teamSelected){
      			rankings.push({round: k+1, rank: m+1});
      		}
      	}
      }
      // Now that it has been sorted, print of the index of the team.
      for(var k = 0; k<rankings.length; k++){
        //console.log("Round: " + k + " Rank: " + rankings[k].rank)
      }
      return rankings;
  },

  calculatePoints: function(matches, team){
      // Calculate the amount of points from that year
      var points = [];
      var index = 1;
      for(var j = 0; j<matches.length; j++){
          //console.log("Loop 4");
          var match = matches[j];
          var currentPoints = 0;
          if(j > 0){
          	currentPoints = points[j-1];
          }
          if(this.yearSelected != 2011){
            while(index>0 && match.round != index){
              //console.log("Hellp!");
              points.push(currentPoints);
              index++;
            }
          }
          if(match.homeTeam.name == team && match.scoreHome > match.scoreAway){
              points.push(currentPoints+2);
              index++;
          }
          else if(match.awayTeam.name == team && match.scoreHome < match.scoreAway){
              points.push(currentPoints+2);
              index++;
          }
          else if(match.scoreHome === match.scoreAway){
              // Case of the draw
              points.push(currentPoints+1);
              index++;
          }
          else{
          	  // Case of not winning
          	  points.push(currentPoints);
              index++;
          }
      }
      return points;
  },

  getYearMatches: function(team, year){
	  var homeAndAway = [];
	  var allMatches = Util.allMatches[year];
	  for(var i = 0; i<allMatches.length; i++){
	      var match = allMatches[i];
	      if(match.homeTeam.name == team || match.awayTeam.name == team){
	          homeAndAway.push(match);
	      }
	  }
	  return homeAndAway;
	},

  drawRank: function(rankings){
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // X scale will fit all values from data[] within pixels 0-w
    var x = d3.scale.linear().domain([1,17]).range([0, width]);
    // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
    var y = d3.scale.linear().domain([10, 1]).range([height, 0]);

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xAxis = d3.svg.axis().scale(x).ticks(6).tickSize(5).tickFormat(d3.format("d"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(5)
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) { return x(d.round); })
        .y(function(d) { return y(d.rank); });

    var backline = d3.svg.line()
        .x(function(d) { return x(d.round); })
        .y(function(d) { return y(d.rank); });

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -35)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Rank");
    
      svg.append("path")
          .attr("d", line(rankings))
          .attr("stroke", "blue")
          .attr("stroke-width", 2)
          .attr("fill", "none");

      // drawing small balls at each year
      for(var i = 0; i<rankings.length; i++){
        svg.append("oval")
          .attr("x", x(i+1))
          .attr("y", y(i+1))
          .attr("width", 50)
          .attr("height", 50)
          .attr("fill", "black");
      }

      line = d3.svg.line()
        .x(function(d) { return x(d.round); })
        .y(function(d) { return y(d.val); });


      for(var i = 1; i<=10; i++){
        svg.append("line")
          .attr("x1", x(1))
          .attr("y1", y(i))
          .attr("x2", x(17))
          .attr("y2", y(i))
          .attr("stroke", "black")
          .attr("stroke-width", 1)
          .attr("opacity", 0.2)
          .attr("fill", "none");
      }

      svg.append("oval")
          .attr("x", 100)
          .attr("y", 100)
          .attr("width", 50)
          .attr("height", 50)
          .attr("fill", "yellow");


},

refresh: function(){
      d3.select("body")
        .selectAll("svg")
        .remove();
  },   
}