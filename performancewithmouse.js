var performance = {
    svg : "",
    nonAlteredMatches : "",
    fg : "",
    team : "",
    year : "",

    drawGraph: function(teamArg, yearArg){
        this.team = teamArg;
        this.year = yearArg;
        nonAlteredMatches = this.getMatches();
        var seasonPerformance = this.getSeasonPerformance(nonAlteredMatches);
        this.refresh();
        this.draw(seasonPerformance);
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

    // SKIPS BYES... WHATS GOING ON! NEED TO INSERT A BYE OBJECT
    // BYES SHOULD NOT BE INSERT IF THE YEAR IS 2011
    getSeasonPerformance: function(matches){
      var seasonPerformance = [];
      var index = 0;
      var ival;
      if(this.year == 2011){
        for(var i = 0; i<matches.length; i++){
            var pointDifference;
            var match = matches[i];
            // Deals if there is a draw
            if(isNaN(match.scoreHome)){
                pointDifference = 0;
            }
            else if(match.homeTeam.name == this.team){
                pointDifference = match.scoreHome - match.scoreAway;
            }
            else if(match.awayTeam.name == this.team){
                pointDifference = match.scoreAway - match.scoreHome;
            }
            var matchNumber = index+1;
            var matchAbbr = {homeTeam: match.homeTeam, awayTeam: match.awayTeam, matchno: matchNumber, round: match.round, score: pointDifference, scoreHome: match.scoreHome, scoreAway: match.scoreAway, venue: match.venue, gameDate: match.gameDate};
            seasonPerformance.push(matchAbbr);
            index++;
        }
      }
      else{
        for(var i = 0; i<matches.length; i++){
          console.log("hello!: " + matches.length);
            var pointDifference;
            var match = matches[i];
            // Deals if there is a draw
            if(isNaN(match.scoreHome)){
                pointDifference = 0;
            }
            else if(match.homeTeam.name == this.team){
                pointDifference = match.scoreHome - match.scoreAway;
            }
            else if(match.awayTeam.name == this.team){
                pointDifference = match.scoreAway - match.scoreHome;
            }
            var matchNumber = index+1;
            // A hack to check if a bye has been made:
            if(index>0 && match.round - seasonPerformance[index-1].round == 2){
                var byeObject = {homeTeam: this.team, awayTeam: "BYE", matchno: matchNumber, round: index+1, score: 0, scoreHome: 0, scoreAway: 0, venue: "BYE", gameDate: "BYE"};
                seasonPerformance.push(byeObject);
                index++;
                matchNumber++;
            }
            console.log("MATCH NUMBER: " + matchNumber);
            var matchAbbr = {homeTeam: match.homeTeam, awayTeam: match.awayTeam, matchno: matchNumber, round: match.round, score: pointDifference, scoreHome: match.scoreHome, scoreAway: match.scoreAway, venue: match.venue, gameDate: match.gameDate};
            seasonPerformance.push(matchAbbr);
            console.log("MATCH ABBR!!!!!!!!: " + matchAbbr.scoreHome);
            index++;
        }
      }
      return seasonPerformance;
    },

    draw: function(matches){
        for(var j = 0; j<matches.length; j++){
            console.log("round: " + matches[j].round + " score: " + matches[j].score);
        }
        var margin = {top: 30, right: 10, bottom: 0, left: 40},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

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

        textField = d3.select("body").append("svg")
            .attr("x", 0)
            .attr("width", width + margin.left + margin.right)
            .attr("height", 80)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
           .on("mouseover", function(d){
              textField.append("text")
                 .attr("x", (width/2)-90)
                 //.attr("y", height+20)
                 .attr("height", 40)
                 .attr("font-size", "20px")
                 .attr("font-family", "sans-serif")
                 .text(""+ d.homeTeam.name + ": " + d.scoreHome);
              textField.append("text")
                 .attr("x", (width/2)-90)
                 .attr("y", 23)
                 .attr("width", width)
                 .attr("height", 40)
                 .attr("font-size", "20px")
                 .attr("font-family", "sans-serif")
                 .text(""+ d.awayTeam.name + ": " + d.scoreAway);
              textField.append("text")
                 .attr("x", (width/2)-90)
                 .attr("y", 46)
                 .attr("width", width)
                 .attr("height", 40)
                 .attr("font-size", "20px")
                 .attr("font-family", "sans-serif")
                 .text("Venue: " + d.venue);

           })
           .on('mouseout', function(d){
              textField.selectAll('*')
                       .remove();
           });

        this.svg.append("g")
           .attr("class", "x axis")
           .call(xAxis);

        this.svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Point Margin");
      

        // the final argument is a int which is the value of the final match    
        

    },


    drawSeasonBlocks: function(margin, yMin, yMax, xFunc, matches){
      // Early season
      var x = 0;
      var width = xFunc(4) + xFunc.rangeBand() + margin.right; 
      var height = (Math.abs(yMin)+yMax);
      console.log("Width is: " + width + " yeeaaa");
      this.svg.append("rect")
         .attr("x", x)
         .attr("y", 0)
         .attr("width", width)
         .attr("height", height)
         .attr("fill", "grey")
         .attr("opacity", 0.2)
         .on("click", function(){
            focusView(matches.slice(0, 4));
        }); 

      // Mid season
      if(this.year == 2011){
        width = xFunc(10) - xFunc(5);
      }
      else{
        width = xFunc(11) - xFunc(5);
      }
      x = xFunc(5);
      this.svg.append("rect")
         .attr("x", x)
         .attr("y", 0)
         .attr("width", width)
         .attr("height", height)
         .attr("fill", "black")
         .attr("opacity", 0.2)
         .on("click", function(){
            if(this.year == 2011){
              focusView(matches.slice(4, 9));
            }
            else{
              focusView(matches.slice(4, 10));
            }
        });  

      // End season
      if(this.year == 2011){
        x = xFunc(10);
        width = xFunc(13) - xFunc(9);
      }
      else{
        x = xFunc(11);
        width = (xFunc(14)+xFunc.rangeBand()+margin.right) - xFunc(11);
      }
      this.svg.append("rect")
         .attr("x", x)
         .attr("y", 0)
         .attr("width", width)
         .attr("height", height)
         .attr("fill", "grey")
         .attr("opacity", 0.2)
         .on("click", function(){
            if(this.year == 2011){
              this.focusView(matches.slice(9, 13));
            }
            else{
              this.focusView(matches.slice(10, 14));
            }
        });  

      // Finals
      if(this.year == 2011 && matches.length > 13){
         x = xFunc(14);
         width = (xFunc(matches.length)+xFunc.rangeBand()+margin.right) - xFunc(14);
         this.svg.append("rect")
             .attr("x", x)
             .attr("y", 0)
             .attr("width", width)
             .attr("height", height)
             .attr("fill", "black")
             .attr("opacity", 0.2)
             .on("click", function(){
              focusView(matches.slice(13, matches.length));
            });  
      }
      else if(matches.length > 14){
           x = xFunc(15);
           width = (xFunc(matches.length)+xFunc.rangeBand()+margin.right) - xFunc(15);
           this.svg.append("rect")
               .attr("x", x)
               .attr("y", 0)
               .attr("width", width)
               .attr("height", height)
               .attr("fill", "black")
               .attr("opacity", 0.2)
               .on("click", function(){
                focusView(matches.slice(14, matches.length));
              });  
            }
    },

    // Draws new svg with focused view of that set of matches!
    focusView: function (matches){ 
      var margin = {top: 20, right: 20, bottom: 60, left: 40},
      width = 800 - margin.left - margin.right,
      height = 350 - margin.top - margin.bottom;

      var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1);

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var svg = d3.select("body").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var yMax = -1000;

      for(var j = 0; j<matches.length; j++){
         var match = matches[j];
         if(match.homeScore > yMax){
              yMax = match.homeScore;
         }
         if(match.awayScore > yMax){
              yMax = match.awayScore;
         }
      }

      var fakeMatches = [{no: 1}, {no: 2}, {no: 3}, {no: 4}];

      for(var i = 0; i<matches.length; i++){
          x.domain(fakeMatches.map(function(d) {
            console.log(console.log("matchnumberInGere: " + d.no)); return d.no; 
          }));
          y.domain( [0, yMax]); // 2 is just a border
      }

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Points");

      // First draw home scores
      for(var j = 0; j<matches.length; j++){
        var d = matches[j];
        width = (x.rangeBand()/2)- 5;
        var gap = 5;
        // Home Score
        svg.append("rect")
           .attr("class", "bar")
           .attr("x", x(d.matchno))
           .attr("width", width)
           .attr("y", y(d.homeScore))
           .attr("height", (height - y(d.homeScore)))
           .attr("fill", d.homeColour);
        // Away Score
        svg.append("rect")
           .attr("class", "bar")
           .attr("x", x(d.matchno) + width + gap)
           .attr("width", width)
           .attr("y", y(d.awayScore))
           .attr("height", (height - y(d.awayScore)))
           .attr("fill", d.awayColour);

        var time = d.time; 
        var date = d.date; 
        var venue = d.venue; 

        svg.append("text")
           .attr("x", x(d.matchno))
           .attr("y", height + 20)
           .attr("height", (height - y(d.awayScore)))
           .text(time);

        svg.append("text")
           .attr("x", x(d.matchno))
           .attr("y", height +40)
           .attr("height", (height - y(d.awayScore)))
           .text(date);

        svg.append("text")
           .attr("x", x(d.matchno))
           .attr("y", height + 60)
           .attr("height", (height - y(d.awayScore)))
           .text(venue);

        // The text to go on home bar
        var homeText = d.home + ": " + d.homeScore;
        var messageWidth = x.rangeBand()/2 - 10;

        svg.append("text")
           .attr('x', (x(d.matchno)+26))
           .attr('font-family', 'sans-serif')
           .attr('font-size', "20px")
           .attr('y', (y(d.homeScore-6)))
           .attr("fill", "white")
           .text(d.homeScore);

        // The text to go on the away bar
        var awayText = d.awayTeam + ": " + d.awayScore;
        svg.append("text")
           .attr('x', (x(d.matchno)+24+width+gap))
           .attr('y', (y(d.awayScore-6)))
           .attr('font-family', 'sans-serif')
           .attr('font-size', "20px")
           .attr("fill", "white")
           .text(d.awayScore);

        svg.append("text")
           .attr('font-family', 'sans-serif')
           .attr('font-size', "12px")
           .attr("fill", "white")
           .call(wrap, d.home, (x.rangeBand()/2)-6, 15)
           .attr("transform", "translate(" + (x(d.matchno)+3) + ", " + (y(d.homeScore-8))+ ")");

        svg.append("text")
           .attr('font-family', 'sans-serif')
           .attr('font-size', "12px")
           .attr("fill", "white")
           .call(wrap, d.awayTeam, (x.rangeBand()/2)-6, 15)
           .attr("transform", "translate(" + (x(d.matchno)+2+width+gap) + ", " + (y(d.awayScore-8))+ ")");
    }
  },

    /** function wraps text so that it fits on the screen in a certain area (enters linebreaks if needed). */
    wrap : function(selected, message, width, lineHeight) {
        var text = selected; // This is the text element holding the tspan elements
        var words = message.split(/\s+/).reverse();
        var line = []; // This is the line that will hold the current line being added to
        var lineNumber = 0; // Needed for calculating how many lines needed to go down

        // Y starts at lineHeight so the first line of text is on screen 
        var tspan = text.append("tspan").attr("x", 0).attr("y", lineHeight).attr("dy", 0);

      while(word = words.pop()){
        line.push(word);
        tspan.text(line.join(" ")); //joins the elements in the array line together, place " " where needed
                      //then assigning that line to the selected tspan element.
        if(tspan.node().getComputedTextLength() > width){ // If the line is bigger than the width
          line.pop(); // Get rid of the last element from the line
          tspan.text(line.join(" ")); // Assign tspan the line without that last element
          line = [word]; // Now start a new line with the word that was popped.
          tspan = text.append("tspan").attr("x", 0).attr("y", lineHeight).attr("dy", ++lineNumber*lineHeight).text(word); 
          // For above statement, now make a new tspan element, assign it to text, change dy value accordingly, and add word (in case thats all there is)
        }
      }    
    },

    type: function(d){
      d.value = +d.value;
      return d;
    },
      
    refresh: function(){
        d3.select("body")
          .selectAll("svg")
          .remove();
    }
};