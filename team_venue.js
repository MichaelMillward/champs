var team_venue = {
    teamSelected : "",

    drawGraph: function(team){
        // Draw Ranking Graph
        this.teamSelected = team;
        var perferred = this.calculatePerferredVenue();
        this.refresh();
        this.drawRectangles(perferred);
    },

    // Perferred Venue is the venue that the team has had the most wins in
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

    drawRectangles: function(data){
        var margin = {top: 40, right: 20, bottom: 0, left: 50},
            width = 700 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


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
              console.log(d.venue);
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
              console.log(d.venue);
           });
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

    getYearMatches : function(team, year){
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

    refresh : function(){
        d3.select("body")
          .selectAll("svg")
          .remove();
    }
  }