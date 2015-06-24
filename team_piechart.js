var wol = {
    team : "",
    year : "",
    nonAlteredMatches : "",
    svg : "",

    drawGraph: function(teamArg, yearArg){
        this.team = teamArg;
        this.year = yearArg;
        console.log("year: " + this.year + " team: " + this.team);
        nonAlteredMatches = this.getMatches();
        winloss = this.getwol(nonAlteredMatches);
        this.refresh();
        this.drawwol(winloss.slice(0, 2), "Wins vs. Loss", 1);
        this.drawwol(winloss.slice(2, 4), "Home: Wins vs. Losses",  2);
        this.drawwol(winloss.slice(4, 7), "Away: Wins vs. Losses", 3);
    },

    /**
    *   Returns a sorted list of all the matches for a given team in a given year.
    */
    getMatches: function(){
        var homeAndAway = [];
        var allMatches = Util.allMatches[this.year];
        for(var i = 0; i<allMatches.length; i++){
            var match = allMatches[i];
            if(match.homeTeam.name == this.team || match.awayTeam.name == this.team){
                homeAndAway.push(match);
            }
        }
        return homeAndAway;
    },

    getwol: function(matches){
        var wins = 0;
        var losses = 0;
        var draw = 0;
        var winsAway = 0;
        var winsHome = 0;
        var lossAway = 0;
        var lossHome = 0; 
        for(var i = 0; i<matches.length; i++){
            var match = matches[i];
            console.log("match Details.. Home team: " + match.homeTeam.name + "  Away Team: " + match.awayTeam.name + "   scoreHome: " + match.scoreHome + "   awayHome:  " + match.scoreAway);
            if(isNaN(match.scoreHome)){
                console.log("DRAW :" + match);
            }
            else if(match.homeTeam.name == this.team){
                if((match.scoreHome - match.scoreAway) > 0){   
                    console.log("Win at home!");
                    wins++; 
                    winsHome++;
                 }
                else                                       { 
                    console.log("Loss at home!"); 
                    losses++;
                    lossHome++; 
                }
            }
            else if(match.awayTeam.name == this.team){
                if((match.scoreHome - match.scoreAway) < 0){    
                    console.log("Win at away!");
                    wins++; 
                    winsAway++ 
                }
                else                                       { 
                    console.log("Loss at away!"); 
                    losses++; 
                    lossAway++;
                }
            }
        }
        console.log("amount of wins: " + wins + " amount of losses: " + losses);
        return([{label: "Wins", value: wins}, {label: "Losses", value: losses}, {label: "Wins", value: winsHome}, {label: "Losses", value: lossHome},  
            {label: "Wins", value: winsAway}, {label: "Losses", value: lossAway}]);
    },

    drawwol: function(wol, title, number){
        var width = 250;
        var height = 300;
        var radius = Math.min(width, height) / 2;
        var gap = 20;

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
          

        svg.append("text")
           .attr("x", -(width/2) + 40)
           .attr("y", -(height/2) + 20)
           .text(title);

        svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var color = d3.scale.ordinal()
            .range(["#98abc5", "#8a89a6"]);

        var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.value; });

        for(var i = 0; i<wol.length; i++) {
          wol.forEach(function(d) {
            d.value = +d.value;
          });

          var g = svg.selectAll(".arc")
              .data(pie(wol))
            .enter().append("g")
              .attr("class", "arc");

          g.append("path")
              .attr("d", arc)
              .style("fill", function(d) { return color(d.data.label); });

          g.append("text")
              .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
              .attr("dy", ".35em")
              .style("text-anchor", "middle")
              .text(function(d) { return d.data.label; });

        }
    },

    refresh: function (){
        d3.select("body")
          .selectAll("svg")
          .remove();
    }
}