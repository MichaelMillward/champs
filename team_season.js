var team_season = {
    svg : "",
    nonAlteredMatches : "",
    fg : "",
    rvg : "",
    x: "",
    y: "",
    teamSelected : "",
    yearSelected : "",
    focussvg : "",
    colours: [{team: "NSW Swifts", colour: "rgb(0,102,204)"}, 
              {team: "Melbourne Vixens", colour: "rgb(192,192,192)"}, 
              {team: "Central Pulse", colour: "rgb(255,128,0)"}, 
              {team: "Waikato Bay of Plenty Magic", colour: "rgb(255,178,102)"}, 
              {team: "Canterbury Tactix", colour: "rgb(0,204,0)"}, 
              {team: "Southern Steel", colour: "rgb(153,255,153)"}, 
              {team: "Adelaide Thunderbirds", colour: "rgb(204,0,0)"}, 
              {team: "Northen Mystics", colour: "rgb(255,153,152)"}, 
              {team: "West Coast Fever", colour: "rgb(0,128,255)"}, 
              {team: "Queensland Firebirds", colour: "rgb(153,153,255)"}],
    lineObjects: [],

    // Needed to clear line objects.
    firstMethod: function(teamArg, yearArg){
        console.log("CLEEAAAAAAAARRING");
        this.lineObjects = [];
        this.drawGraph(teamArg, yearArg);
        console.log("Line object length: ")
    },

    drawGraph: function(teamArg, yearArg){
        this.refresh();
        this.teamSelected = teamArg;
        this.yearSelected = yearArg;
        var ranks = this.calculateRank(teamArg, yearArg);
        this.drawRank(ranks);
        this.addToLineObjects(teamArg, yearArg);
        this.drawLine(ranks, teamArg, yearArg);
        nonAlteredMatches = this.getMatches();
        var season = this.getSeason(nonAlteredMatches);
        this.draw(season);
        // Draw focus svg so it doesn't cause undefined errors
    },

    redraw: function(team, year){
      console.log("size of lineObjects: " + this.lineObjects.length);
        this.drawGraph(team, year);
        for(var i = 0; i<this.lineObjects.length; i++){
            // Prevent it drawing the focus line
            if(!(team == this.lineObjects[i].team && year === this.lineObjects[i].year)){
              console.log("Drawing team: "+this.lineObjects[i].team+"in Year "+this.lineObjects[i].year);
              var ranks = this.calculateRank(this.lineObjects[i].team, this.lineObjects[i].year);
              this.drawLine(ranks, this.lineObjects[i].team, this.lineObjects[i].year);
          }
        }
    },

    // Helper function to prevent two of the same teams and years being added
    addToLineObjects: function(team, year){
      console.log("Trying to add: " + team + " and " + year);
      for(var i = 0; i<this.lineObjects.length; i++){
        if(team === this.lineObjects[i].team && year === this.lineObjects[i].year){
          console.log("Prevent it adding");
          return 0;
        }
      }
      // Not in lineObjects so can add
      this.lineObjects.push({team: team, year: year});
    },

    removeFromLineObjects: function(team, year){
      var index = -1;
      for(var i = 0; i<this.lineObjects.length; i++){
        if(team === this.lineObjects[i].team && year === this.lineObjects[i].year){
          console.log("FOUND IT: " + this.lineObjects[i].team + "  " + this.lineObjects[i].year);
          index = i;
        }
      }
      if(index > -1){
        this.lineObjects.splice(index, 1);
      }
      for(var i = 0; i<this.lineObjects.length; i++){
        console.log("left in lO " + this.lineObjects[i].team + " " + this.lineObjects[i].year);
      }
      this.redraw(this.teamSelected, this.yearSelected);
    },

    addLine: function(teamArg, yearArg){
        console.log("teamArg: " + teamArg + " yearArg: " + yearArg);
        var ranks = this.calculateRank(teamArg, yearArg);
        this.addToLineObjects(teamArg, yearArg);
        this.drawLine(ranks, teamArg, yearArg);
        this.redraw(this.teamSelected, this.yearSelected);
    },

    calculateRank: function(team, year){
      var rankings = []; // rankings is a list of the selected teams ranking where index is round.
      var teams = ["NSW Swifts", "Melbourne Vixens", "Central Pulse", "Waikato Bay of Plenty Magic", "Canterbury Tactix", "Southern Steel",
                  "Adelaide Thunderbirds", "Northen Mystics", "West Coast Fever", "Queensland Firebirds"];
      // Find the rank for each year
      var teamPoints = [];
      // First get all the matches for one year for each team
      for(var j = 0; j<teams.length; j++){
          //console.log("loop1");
          // Should be picking a year that the user choses. 
          var matches = this.getYearMatches(teams[j], year);
          var pointsFromYear = this.calculatePoints(matches, teams[j], year);
          if(teams[j] === team){
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
      var matches = this.getYearMatches(team, year);
      if(year == 2011){
        max = matches.length
      }
      else{
        max = matches[matches.length-1].round;
      }
      // Go through each round, 13 rounds for 2011
      for(var k = 0; k<max; k++){
        //console.log("loop2");
        // Now create a list with all the scores from each round. k = round number.
        var rankingsForYear = [];
        for(var l = 0; l<teamPoints.length; l++){
          //console.log("loop3");
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
        //console.log("loop4");
        //console.log("Team: " + rankingsForYear[m].team + " Rank: " + (m+1) + " Points: " + rankingsForYear[m].points);
          if(rankingsForYear[m].team == team){
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

  calculatePoints: function(matches, team, year){
      // Calculate the amount of points from that year
      var points = [];
      var index = 1;
      for(var j = 0; j<matches.length; j++){
        //console.log("loop5");
          //console.log("Loop 4");
          var match = matches[j];
          var currentPoints = 0;
          if(j > 0){
            currentPoints = points[j-1];
          }
          if(year != 2011){
            // Add Byes
            while(index>0 && match.round != index){
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
      //console.log("loop6");
        var match = allMatches[i];
        if(match.homeTeam.name == team || match.awayTeam.name == team){
            homeAndAway.push(match);
        }
    }
    return homeAndAway;
  },


    /**
    *   Returns a sorted list of all the matches for a given team in a given year.
    */
    getMatches: function(){
        var homeAndAway = [];
        var allMatches = Util.allMatches[this.yearSelected];
        for(var i = 0; i<allMatches.length; i++){
          //console.log("loop7");
            var match = allMatches[i];
            if(match.homeTeam.name == this.teamSelected || match.awayTeam.name == this.teamSelected){

                homeAndAway.push(match);
            }
        }
        return homeAndAway;
    },

    // SKIPS BYES... WHATS GOING ON! NEED TO INSERT A BYE OBJECT
    // BYES SHOULD NOT BE INSERT IF THE YEAR IS 2011
    getSeason: function(matches){
      var seasonteam_season = [];
      var index = 0;
      var ival;
      if(this.yearSelected == 2011){
        for(var i = 0; i<matches.length; i++){
            var pointDifference;
            var match = matches[i];
            // Deals if there is a draw
            if(isNaN(match.scoreHome)){
                pointDifference = 0;
            }
            else if(match.homeTeam.name == this.teamSelected){
                pointDifference = match.scoreHome - match.scoreAway;
            }
            else if(match.awayTeam.name == this.teamSelected){
                pointDifference = match.scoreAway - match.scoreHome;
            }
            var matchNumber = index+1;
            var matchAbbr = {homeTeam: match.homeTeam, awayTeam: match.awayTeam, matchno: matchNumber, round: match.round, score: pointDifference, scoreHome: match.scoreHome, scoreAway: match.scoreAway, venue: match.venue, gameDate: match.gameDate};
            seasonteam_season.push(matchAbbr);
            index++;
        }
      }
      else{
        for(var i = 0; i<matches.length; i++){
            var pointDifference;
            var match = matches[i];
            // Deals if there is a draw
            if(isNaN(match.scoreHome)){
                pointDifference = 0;
            }
            else if(match.homeTeam.name == this.teamSelected){
                pointDifference = match.scoreHome - match.scoreAway;
            }
            else if(match.awayTeam.name == this.teamSelected){
                pointDifference = match.scoreAway - match.scoreHome;
            }
            var matchNumber = index+1;
            // A hack to check if a bye has been made:
            if(index>0 && match.round - seasonteam_season[index-1].round == 2){
                var byeObject = {homeTeam: this.teamSelected, awayTeam: "BYE", matchno: matchNumber, round: index+1, score: 0, scoreHome: 0, scoreAway: 0, venue: "BYE", gameDate: "BYE"};
                seasonteam_season.push(byeObject);
                index++;
                matchNumber++;
            }
            var matchAbbr = {homeTeam: match.homeTeam, awayTeam: match.awayTeam, matchno: matchNumber, round: match.round, score: pointDifference, scoreHome: match.scoreHome, scoreAway: match.scoreAway, venue: match.venue, gameDate: match.gameDate};
            seasonteam_season.push(matchAbbr);
            index++;
        }
      }
      return seasonteam_season;
    },

    fixUp: function(matchesArg){
      if(this.yearSelected==2011){
        var needed = 17 - matchesArg.length;
      }
      else{
        var needed = 17 - matchesArg.length;
      }
      for(var i = 0; i<needed; i++){
        //console.log("loop7");
            matchesArg.push({homeTeam: this.teamSelected, awayTeam: "BYE", matchno: matchesArg.length+1, round: matchesArg.length+1, score: 0, scoreHome: 0, scoreAway: 0, venue: "BYE", gameDate: "BYE"});
        }
      return matchesArg;
    },

draw: function(matchesArg){
  // Needs fixing if it's missing matches
  var matches = this.fixUp(matchesArg)
    var margin = {top: 19, right: 10, bottom: 30, left: 42},
    width = 800 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom;
    var y = d3.scale.linear()
        .range([0, height]);
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .2);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top");
    var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left"); 
    this.svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var yMax = -1000;
    var yMin = 1000;
    for(var j = 0; j<matches.length; j++){
       var match = matches[j];
       if(match.score > yMax){
            yMax = match.score;
       }
       if(match.score < yMin){
            yMin = match.score;
       }
    }
    for(var i = 0; i<matches.length; i++){
        x.domain(matches.map(function(d) {return d.matchno; }));
        y.domain( [(yMax+2), (yMin-2)]); // 2 is just a border
    }

    this.drawSeasonBlocks(margin, y(yMin), y(yMax), x, matches);

    // Tool Tip Stuff
    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                  return "<span>" + d.homeTeam.name + " " + d.scoreHome +" <br> " + d.awayTeam.name + " " + d.scoreAway + "</span>";
                });
//<span style='color:red'
    this.svg.call(tip);

    this.svg.selectAll(".bar")
       .data(matches)
       .enter().append("rect")
       .attr("class", function(d) { return d.score < 0 ? "bar negative" : "bar positive"; })
       .attr("x", function(d) { 
        return x(d.matchno); 
      })
       .attr("y", function(d) { return y(Math.max(0, d.score));})
       .attr("width", x.rangeBand())
       .attr("height", function(d) { return Math.abs(y(d.score) - y(0)); })
       .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

    this.svg.append("g")
       .attr("class", "x axis")
       .call(xAxis);
    this.svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -42)
        .attr("dy", ".71em")
        .attr("x", -42)
        .style("font-weight", "bold")
        .style("text-anchor", "end")
        .text("Point Margin");
    // Text in the middle of the graph
    this.svg.append("text")
            .attr("x", -42)
            .attr("y", -8)
            .style("font-weight", "bold")
            .text("Game");
    // the final argument is a int which is the value of the final match 
    this.svg.append("text")
            .attr("x", 90)
            .attr("y", 323)
            .style("font-style", "italic")
            .style("font-size", "15px")
            .text("Right Click a line to delete. Left click a line to focus on a team and season.");
    this.svg.append("text")
        .attr("x", 160)
        .attr("y", 337)
        .style("font-style", "italic")
        .style("font-size", "15px")
        .text("Hover mouse over bar to view match detail.");    
},

// Draws new svg with focused view of that set of matches!
focus: function(matchesArg){ 
    // Find in focus.txt
},

drawSeasonBlocks: function(margin, yMin, yMax, xFunc, matches){
  // Find other season blocks in focus.txt
  var x = xFunc(14);
  var width = xFunc(4) + xFunc.rangeBand() + margin.right; 
  var height = (Math.abs(yMin)+yMax);

  // Finals
  if(this.yearSelected == 2011){
     width = (xFunc(16)+xFunc.rangeBand()+margin.right) - xFunc(14);
     this.svg.append("rect")
         .attr("x", x)
         .attr("y", 0)
         .attr("width", width)
         .attr("height", height)
         .attr("fill", "gold")
         .attr("opacity", 1)
         .on("click", function(){
          d3.select("svg")
            .remove();
        team_season.drawGraph(team_season.team, team_season.year);
          team_season.focus(matches.slice(13, matches.length));
        });
  }  
  else {
       x = xFunc(15);
       width = (xFunc(matches.length)+xFunc.rangeBand()+margin.right) - xFunc(15);
       this.svg.append("rect")
           .attr("x", x)
           .attr("y", 0)
           .attr("width", width)
           .attr("height", height)
           .attr("fill", "gold")
           .attr("opacity", 1)
           .on("click", function(){
            d3.select("svg")
          .remove();
        team_season.drawGraph(team_season.team, team_season.year);
            team_season.focus(matches.slice(14, matches.length));
          });  
  }
},

drawRank: function(){
  // Reset the line objects
  var margin = {top: 20, right: 40, bottom: 10, left: 72},
      width = 800 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;
  var max = 17;
  // X scale will fit all values from data[] within pixels 0-w
  this.x = d3.scale.linear().domain([1,max]).range([0, width]);
  // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
  this.y = d3.scale.linear().domain([10, 1]).range([height, 0]);
  this.rvg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var xAxis = d3.svg.axis().scale(this.x).ticks(16).tickSize(7).tickFormat(d3.format("d"));
  var yAxis = d3.svg.axis()
      .scale(this.y)
      .tickSize(5)
      .orient("left");
  this.rvg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  this.rvg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(-31,0)")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -41)
      .attr("x", -220)
      .attr("dy", ".71em")
      .style("font-weight", "bold")
      .style("text-anchor", "end")
      .text("Rank");
  var line = d3.svg.line()
    .x(function(d) { return x(d.matchno); })
    .y(function(d) { return y(d.val); });
  for(var i = 1; i<=10; i++){
    this.rvg.append("line")
      .attr("x1", this.x(0.3))
      .attr("y1", this.y(i))
      .attr("x2", this.x(17.6))
      .attr("y2", this.y(i))
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("opacity", 0.2)
      .attr("fill", "none");
  }
},

drawLine: function(rankingsArg, team, year){
    var x = this.x;
    var y = this.y;
    var line = d3.svg.line()
        .x(function(d) { return x(d.matchno); })
        .y(function(d) { return y(d.rank); });
    var rankings = [];
      //console.log("rankings length: " + rankingsArg.length);
      for(var i = 0; i<rankingsArg.length; i++){
          rankings.push({matchno: i+1, rank: rankingsArg[i].rank, team: team, year: year});
      } 
    // Colour decision
    var colour = "black";
    if(team !== this.teamSelected || year !== this.yearSelected){
      for(var i = 0; i<this.colours.length; i++){
        //console.log("loop10");
        if(this.colours[i].team == team){
          colour = this.colours[i].colour; 
        }
      }
    }
    this.rvg.append("path")
        .attr("d", line(rankings))
        .attr("stroke", colour)
        .attr("stroke-width", 3)
        .attr("fill", "none")
        .on("click", function(d){
          team_season.redraw(team, year);
        })
        .on("contextmenu", function(d, i){
          console.log("right clicked: " + team + " " + year);
          d3.event.preventDefault();
          team_season.removeFromLineObjects(team, year);
        });
    // drawing small balls at each year
    for(var i = 0; i<rankings.length; i++){
      //console.log("loop11");
      this.rvg.append("ellipse")
        .attr("cx", x(rankings[i].matchno))
        .attr("cy", y(rankings[i].rank))
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "black");
    }

},

      
refresh: function(){
    d3.select("body")
      .selectAll("svg")
      .remove();
}


};