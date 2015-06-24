var Util = Util || {};

Util.Teams = {
    Swifts : {id: 0, name : "NSW Swifts"},
    Vixens : {id : 1, name : "Melbourne Vixens"},
    Pulse : {id : 2, name : "Central Pulse"},
    Magic : {id : 3, name : "Waikato Bay of Plenty Magic"},
    Tactix : {id : 4, name : "Canterbury Tactix"},
    Steel : {id : 5, name : "Southern Steel"},
    Thunderbirds : {id : 6, name : "Adelaide Thunderbirds"},
    Mystics : {id : 7, name : "Northen Mystics"},
    Fever : {id : 8, name : "West Coast Fever"},
    Firebirds : {id : 9, name : "Queensland Firebirds"}
}

Util.match = function (round, homeTeam, awayTeam, scoreHome, scoreAway, venue, gameDate) {
    this.round = round, this.homeTeam = homeTeam, this.awayTeam = awayTeam, this.scoreHome = scoreHome,
    this.scoreAway = scoreAway, this.venue = venue, this.gameDate = gameDate;
}

Util.match.prototype.winner = function() {
    if (this.scoreHome > this.scoreAway) {
        return this.homeTeam;
    }else if (this.scoreHome == this.scoreAway) {
        return this.awayTeam;
    }else return undefined;
}

Util.getPaths = function() {
    return _.range(2008, 2014).map(function(year) {return {path : "data/"+year+".csv", year : year};});
}

Util.parseEverything = function(items, thenWhat) {
    //this is a recursive function so this is our base case.
    if (items.length == 0) {
        //call the callback when parsing is finished
        if (thenWhat) thenWhat();
        return;
    }
    
    //matches stored in an object in Util namespace
    if (!Util.allMatches) {
        Util.allMatches = {};
    }
    
    //Now we parse the file at index 0 of paths
    //all the rows in that file are converted into lists of matches
    //we add this list to the allMatches object and recursively call
    //parseEverything to continue the process
    var item = items.shift(), year = item.year;
    Papa.parse(item.text, {header : true,
               delimiter : ",",
               complete : function(rows) {
        var matches =  _.map(rows.data, function(d) {
            d.year = year;
            return Util.parseRowData(d, year);
        });
        matches = _.filter(matches, function(x){return x != undefined;});
        Util.allMatches[year] = (matches);
        Util.parseEverything(items);
        }
    });
}

Util.parseRowData = function(rowData, year) {
    if ((new RegExp(/BYES/)).exec(rowData['Date'])) {
        console.log("Houston we have  a bye");
        return undefined;
        }
    var scorePair = rowData["Score"].replace(/\s+/, "").split(/\D+/), date = Util.parseDate(rowData["Date"], year);
    scorePair[0] = parseInt(scorePair[0]);
    scorePair[1] = parseInt(scorePair[1]);
    var home = Util.parseTeam(rowData["Home Team"]);
    var away = Util.parseTeam(rowData["Away Team"]);
    
    return new Util.match(parseInt(rowData["Round"]), home, away, scorePair[0], scorePair[1], rowData["Venue"], date);
}

Util.parseDate = function(date, year) {
    var monthAndDate = new RegExp(/^\w+\s+(\d+\s+\w+)/);
    var d = monthAndDate.exec(date);
    var out = moment(d[1]+" "+year, "DD MMM YYYY");
    return out.toDate();
}

Util.parseTeam = function(name) {
    for (var key in Util.Teams) {
        if (Util.Teams.hasOwnProperty(key)) {
            var fullName = Util.Teams[key].name;
            var elems = fullName.toLowerCase().split(/\s+/);
            for (var i = 0 ; i < elems.length ; i++) {
                if (new RegExp(elems[i]).exec(name.toLowerCase())) {
                    return Util.Teams[key];
                }
            }
        }
    }
    throw "Could not parse team "+name;
}

Util.parseEverything(_.range(2008, 2014)
    .map(function(y) {
         var info = {text : window["y"+y], year : y}
         return info;
         ;}));
