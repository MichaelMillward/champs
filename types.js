var Util = Util || {};

Util.Teams = {
    Swifts : {name : "New South Wales Swifts"},
    Vixens : {name : "Melbourne Vixens"},
    Pulse : {name : "Central Pulse"},
    Magic : {name : "Waikato Bay of Plenty Magic"},
    Tactix : {name : "Canterbury Tactix"},
    Steel : {name : "Southern Steel"},
    Thunderbirds : {name : "Adelaide Thunderbirds"},
    Mystics : {name : "Northen Mystics"},
    Fever : {name : "West Coast Fever"},
    Firebirds : {name : "Queensland Firebirds"}
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

Util.parseData(rowData) {
    var scorePair = rowData.split(','), date = Util.parseDate(rowData.date);
    scorePair[0] = parseInt(scorePair[0]);
    scorePair[1] = parseInt(scorePair[1]);
}

Util.parseDate(date, year) {
    var monthAndDate = new RegExp("^.+\s+(d+\s+\w+)");
    var out = moment(monthAndDate + " "+year).format("MMM D YYYY");
    return out;
}

Util.parseTeam(name) {
    for (var key in p) {
        if (p.hasOwnProperty(key)) {
        }
    }
}
