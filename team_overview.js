var team_overview = {
  teamSelected: "",
  svg: "",
  textField: "",

  drawGraphs: function(team){
      console.log("team selected: " + team);
      this.teamSelected = team;
      this.refresh();
      // Draw Ranking Graph
      var rankings = this.calculateRank();
      this.drawRank(rankings);
      // Draw Venue Graph
      var perferred = this.calculatePerferredVenue();
      this.drawRectangles(perferred);
  },

  calculateRank: function(){
      var rankings = [];
      var years = [2008, 2009, 2010, 2011, 2012, 2013];
      var teams = ["NSW Swifts", "Melbourne Vixens", "Central Pulse", "Waikato Bay of Plenty Magic", "Canterbury Tactix", "Southern Steel",
                  "Adelaide Thunderbirds", "Northen Mystics", "West Coast Fever", "Queensland Firebirds"];
      // Find the rank for each year
      for(var i = 0; i<years.length; i++){
          var teamPoints = [];
          // First get all the matches for one year for each team
          for(var j = 0; j<teams.length; j++){
              var matches = this.getYearMatches(teams[j], years[i]);
              var pointsFromYear = this.calculatePoints(matches, teams[j]);
              teamPoints.push({team: teams[j], points: pointsFromYear});
          }
          teamPoints.sort(function(a, b){
              return b.points - a.points;
          });
          // Now that it has been sorted, print of the index of the team.
          for(var k = 0; k<teamPoints.length; k++){
              if(teamPoints[k].team == this.teamSelected){
                  console.log("Year pushing is: " + years[i]);
                  rankings.push({year: years[i], rank: (k+1)});
              }
          }
      }
      return rankings;
  },

  calculatePoints: function(matches, team){
      // Calculate the amount of points from that year
      var points = 0;
      for(var j = 0; j<matches.length; j++){
          var match = matches[j];
          if(match.homeTeam.name == team && match.scoreHome > match.scoreAway){
              points += 2;
          }
          else if(match.awayTeam.name == team && match.scoreHome < match.scoreAway){
              points += 2;
          }
          else if(match.scoreHome === match.scoreAway){
              // Case of the draw
              points += 1;
          }
      }
      return points;
  },

  calculatePerferredVenue: function(){
      // Used to check 
      var data = [];
      var years = [2008, 2009, 2010, 2011, 2012, 2013];           
      // Find how they did at each venue each year.
      for(var i = 0; i<years.length; i++){
          // First get all the matches for one year for each team
          var matches = this.getYearMatches(this.teamSelected, years[i]);
          // Go through all matches, checking if they won, if so, add an extra win to that match, if not, add a lose. Draw is not applicable.
          for(var j = 0; j<matches.length; j++){
            var match = matches[j];
            var index = this.indexOf(data, match.venue);
            // CASE FIVE: THEY WON AT HOME & VENUE ISNT THERE
            // CASE SIX: THEY LOST AT HOME & VENUE ISNT THERE
            // CASE SEVEN: THEY WON AWAY & VENUE ISNT THERE
            // CASE EIGHT: THEY LOST AWAY & VENUE ISNT THERE
            if(this.teamSelected == match.homeTeam.name && match.scoreHome > match.scoreAway){
                // CASE ONE: THEY WON AT HOME
                if(index == -1){
                  data.push({venue: match.venue, wins: 1, losses: 0, home: 1});
                }
                else{
                  var found = data[index];
                  var replace = {venue: found.venue, wins: found.wins+1, losses: found.losses, home: found.home};
                  data[index] = replace;
                }
            }
            else if(this.teamSelected == match.homeTeam.name && match.scoreHome < match.scoreAway){
                // CASE TWO: THEY LOST AT HOME
                if(index == -1){
                  data.push({venue: match.venue, wins: 0, losses: 1, home: 1});
                }
                else{
                  var found = data[index];
                  var replace = {venue: found.venue, wins: found.wins, losses: found.losses+1, home: found.home};
                  data[index] = replace;
                }
            }
            else if(this.teamSelected == match.awayTeam.name && match.scoreHome < match.scoreAway){
                // CASE ONE: THEY WON AWAY
                if(index == -1){
                  data.push({venue: match.venue, wins: 1, losses: 0, home: 0});
                }
                else{
                  var found = data[index];
                  var replace = {venue: found.venue, wins: found.wins+1, losses: found.losses, home: found.home};
                  data[index] = replace;
                }
            }
            else if(this.teamSelected == match.awayTeam.name && match.scoreHome > match.scoreAway){
              // CASE TWO: THEY LOST AWAY
              if(index == -1){
                data.push({venue: match.venue, wins: 0, losses: 1, home: 0});
              }
              else{
                var found = data[index];
                var replace = {venue: found.venue, wins: found.wins, losses: found.losses+1, home: found.home};
                data[index] = replace;
              }
          }
        }
    }
    return data;    
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

  indexOf : function(data, venue){
        // JSON of the stored data is {venue, gameswon, gameslost, home}
        // data is the list
        // checking if venue is in that list
        for(var i = 0; i<data.length; i++){
            if(data[i].venue == venue){
              return i;
            }
        }
        return -1;
    },

  // Perferred Venue is the venue that the team has had the most wins in
  
  
  drawRank: function(rankings){
      console.log("rankings length: " + rankings.length);
      var margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = 700 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

      // X scale will fit all values from data[] within pixels 0-w
      var x = d3.scale.linear().domain([2008,2013]).range([0, width]);
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
          .x(function(d) { return x(d.year); })
          .y(function(d) { return y(d.rank); });

      var backline = d3.svg.line()
          .x(function(d) { return x(d.year); })
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
        line = d3.svg.line()
          .x(function(d) { return x(d.year); })
          .y(function(d) { return y(d.val); });


        for(var i = 1; i<=10; i++){
          svg.append("line")
            .attr("x1", x(2008))
            .attr("y1", y(i))
            .attr("x2", x(2013))
            .attr("y2", y(i))
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("opacity", 0.2)
            .attr("fill", "none");
        }

  },

    drawRectangles: function(data){
        var margin = {top: 40, right: 20, bottom: 35, left: 50},
            width = 700 - margin.left - margin.right,
            height = 340 - margin.top - margin.bottom;

        svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Set up textField.
        this.textField = svg.append("g")
            .attr("width", width + margin.left + margin.right)
            .attr("height", 200);


        // Top 5 (best win percentage)
        svg.append("text")
           .attr("x", margin.right+8)
           .attr("y", 10)
           .text("Most Preferred Venues");

        var gap = 25;
        var gap2 = 10;
        var x = margin.right;
        var rectwidth = (width - margin.right - margin.left - (gap*2))/3;
        var y = margin.top;
        var rectheight = (height - margin.top - margin.bottom - (gap2*4))/5;

        data.sort(function(a, b){
          var an = a.wins/(a.wins+a.losses);
          var bn = b.wins/(b.wins+b.losses);
          return bn - an;
        });

        this.draw(data.slice(0, 5), svg, x, y, rectwidth, rectheight, gap2, margin);
      

        // Bottom 5 (worst win percent)
        svg.append("text")
           .attr("x", (margin.right+rectwidth+gap+8))
           .attr("y", 10)
           .text("Least Preferred Venues");

        var x = x+rectwidth + gap;

        data.sort(function(a, b){
          var an = a.wins/(a.wins+a.losses);
          var bn = b.wins/(b.wins+b.losses);
          return an - bn;
        });

        this.draw(data.slice(0,5), svg, x, y, rectwidth, rectheight, gap2, margin);

        // Draw home venues
        svg.append("text")
           .attr("x", (margin.right+(rectwidth*2)+(gap*2)+35))
           .attr("y", 10)
           .text("Home Venues");

        data.sort(function(a, b){
          if(a.home == 1 && b.home == 0){
            return -1;
          }
          else if(a.home == 0 && b.home == 1){
            return 1;
          }
          else{
            return -1;
          }
        });

        var index = 0;
        for(index; index<data.length; index++){
            if(data[index].home == 0){
              break;
            }
        }

        var x = x+rectwidth+gap;
        var gap = 25;
        var gap2 = 10;
        var rectheight = (height - margin.top - margin.bottom - (gap2*4))/index;

        this.draw(data.slice(0,index), svg, x, y, rectwidth, rectheight, gap2, margin);
    },

      draw : function(data, svg, x, y, rectwidth, rectheight, gap2, margin){
        svg.selectAll()
           .data(data)
           .enter()
           .append("rect")
           .attr("x", x)
           .attr("y", function(d, i){
              return margin.top + (rectheight*i) + (gap2*i);
            })
           .attr("width", rectwidth)
           .attr("height", rectheight)
           .attr("fill", "green")
           .on("click", function(d){
              team_overview.drawStadium(d);
           });

        svg.selectAll()
           .data(data)
           .enter()
           .append("rect")
           .attr("x", function(d){
              var percentLoss = (d.losses)/(d.wins + d.losses);
              return x + rectwidth - (rectwidth*percentLoss);
           })
           .attr("y", function(d, i){
              return margin.top + (rectheight*i) + (gap2*i);
            })
           .attr("width", function(d){
              var percentLoss = (d.losses)/(d.wins + d.losses);
              return rectwidth*percentLoss;
           })
           .attr("height", rectheight)
           .attr("fill", "red")
           .on("click", function(d){
              team_overview.drawStadium(d);
           });
    },
 

    drawStadium : function(d){
        this.textField.selectAll("*")
                      .remove();
        this.textField.append("text")
                       .attr("x", 20)
                       .attr("y", 260)
                       .attr("font-size", "20px")
                       .text("Venue: " + d.venue);
        this.textField.append("text")
                       .attr("x", 20)
                       .attr("y", 285)
                       .attr("font-size", "20px")
                       .text("Wins: " + d.wins + " Losses: " + d.losses);
    },

  refresh: function(){
      d3.select("body")
        .selectAll("svg")
        .remove();
  },    
    

}