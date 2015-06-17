function graph5(a) {
	var w = 200,                        //width
	h = 500,                            //height
	r = 250,                            //radius
	color = d3.scale.category20c();     //builtin range of colors

	var data = [];
	/*data = [{"label":"one", "value":20}, {"label":"two", "value":50}, 		{"label":"three", "value":30}];*/

	var teamGames = allTeams[a];
	d3.selectAll('.toRemove').remove();	
	var dict = {};
	teamGames.forEach(function(e) {
		var venue = dict[e.Venue];
		if (venue == undefined) {
			venue = [e];
			dict[e.Venue] = venue;
		} else {
			venue.push(e);
		}
	});
	//console.log(dict);

	for (var key in dict) {
		if (allVenues.hasOwnProperty(key)) {
			var temp = dict[key].filter(
				function(e) { 
					if (showFinal === 'Finals') return +e.Round >= 15; if (showFinal === 'Regular') return +e.Round < 15; return true;
				}
			);	

			temp = temp.filter(function(e) { if (showYear === 'All') return true; return e.year === +showYear;});
			var t =teamRank(temp).filter(function(e){return a == e.name;})[0];
			t.venue = key;
			data.push(t);
		}
	}

	//console.log(data);

	data.sort(function(a,b) {
		if (!isNumber(b.wins/(b.wins + b.losses))) {
			return -1;
		} else if (!isNumber(a.wins/(a.wins + a.losses))) {
			return 1;
		}

		var x = b.wins / (b.wins + b.losses) - a.wins / (a.wins + a.losses);
		if (b.wins === 0 && a.wins === 0) {
			return a.losses - b.losses;
		}
		return x;
	});

data = data.filter(function(e) {return e.wins + e.losses !== 0;});
//console.log(data.slice(0,5));
//console.log(data.slice(-5).reverse());

var vis = d3.select('#chart')
	.append('svg:svg')
	.attr("width", w + 20).attr('class', 'toRemove')
	.attr('height', h).append('svg:g');

	vis.append('text').text('Best 5 Venues').attr('x', 20).attr('y',45).style('text-anchor', 'start');
	var bars = vis.selectAll('.winbars')
		.data(data.slice(0,5))
		.enter()
	var b = bars.append('g')
	b.append('title').text(function(e){ return e.venue;})
	b = b.append('svg:rect')
		.attr('x', 20)
		.attr('y', function(d,i) {return 30 * i + 50;})
		.attr('height', 20)
		.attr('width',0).style('fill','green').style('opacity', function(d) { return d.homeWin !== 0 || d.homeLoss !== 0 ? "1": "0.5";});
	b.transition()
	.delay(200)
		.attr('width', function(d) {return 150 * (d.wins / (d.wins + d.losses));});

	b.on('click', function(d){sVenue = d.venue; switchTo('venue');});

	b.on('mouseover', function(d){d3.select(this).style('fill', isNewZealand[allVenues[d.venue][0]['Home Team']] ? 'blue' : 'green')});
	b.on('mouseout', function(d){d3.select(this).style('fill', 'green');});

	var b = bars.append('g')
	b.append('title').text(function(e){ return e.venue;})
	b = b.append('svg:rect')
		.attr('x', 150)
		.attr('y', function(d,i) {return 30 * i + 50;})
		.attr('height', 20)
		.attr('width',0).style('fill','red').style('opacity', function(d) { return d.homeWin !== 0 || d.homeLoss !== 0 ? "1": "0.5";});
	b.transition()
	.delay(200)
		.attr('width', function(d) {return 150 * (d.losses / (d.wins + d.losses));})
		.attr('x', function(d) {return 20 +150 * (d.wins / (d.wins + d.losses));});

	b.on('click', function(d){sVenue = d.venue; switchTo('venue');});
	b.on('mouseover', function(d){d3.select(this).style('fill', isNewZealand[allVenues[d.venue][0]['Home Team']] ? 'blue' : 'red')});
	b.on('mouseout', function(d){d3.select(this).style('fill', 'red');});


var vis = d3.select('#chart')
	.append('svg:svg')
	.attr("width", w).attr('class', 'toRemove')
	.attr('height', h).append('svg:g').attr('class', 'toRemove');

	vis.append('text').text('Worst 5 Venues').attr('x', 0).attr('y',45).style('text-anchor', 'start');
	var bars = vis.selectAll('.winbars')
		.data(data.slice(-5).reverse())
		.enter()
	var b = bars.append('g')
	b.append('title').text(function(e){ return e.venue;})
	b = b.append('svg:rect')
		.attr('x', 0)
		.attr('y', function(d,i) {return 30 * i + 50;})
		.attr('height', 20)
		.attr('width',0).style('fill','green').style('opacity', function(d) { return d.homeWin !== 0 || d.homeLoss !== 0 ? "1": "0.5";});
	b.transition()
	.delay(200)
		.attr('width', function(d) {return 150 * (d.wins / (d.wins + d.losses));});

	b.on('click', function(d){sVenue = d.venue; switchTo('venue');});

	b.on('mouseover', function(d){d3.select(this).style('fill', isNewZealand[allVenues[d.venue][0]['Home Team']] ? 'blue' : 'green')});
	b.on('mouseout', function(d){d3.select(this).style('fill', 'green');});
	var b = bars.append('g')
	b.append('title').text(function(e){ return e.venue;})
	b = b.append('svg:rect')
		.attr('x', 150)
		.attr('y', function(d,i) {return 30 * i + 50;})
		.attr('height', 20)
		.attr('width',0).style('fill','red').style('opacity', function(d) { return d.homeWin !== 0 || d.homeLoss !== 0 ? "1": "0.5";});
	b.transition()
	.delay(200)
		.attr('width', function(d) {return 150 * (d.losses / (d.wins + d.losses));})
		.attr('x', function(d) {return 150 * (d.wins / (d.wins + d.losses));});

	b.on('click', function(d){sVenue = d.venue; switchTo('venue');});
	b.on('mouseover', function(d){d3.select(this).style('fill', isNewZealand[allVenues[d.venue][0]['Home Team']] ? 'blue' : 'red')});
	b.on('mouseout', function(d){d3.select(this).style('fill', 'red');});

var vis = d3.select('#chart')
	.append('svg:svg')
	.attr("width", w).attr('class', 'toRemove')
	.attr('height', h).append('svg:g').attr('class', 'toRemove');

	vis.append('text').text('Home Venues').attr('x', 0).attr('y',45).style('text-anchor', 'start');
	var bars = vis.selectAll('.winbars')
		.data(data.filter(function(e) {return e.homeWin !== 0 || e.homeLoss !== 0;}))
		.enter()
	var b = bars.append('g')
	b.append('title').text(function(e){ return e.venue;})
	b = b.append('svg:rect')
		.attr('x', 0)
		.attr('y', function(d,i) {return 30 * i + 50;})
		.attr('height', 20)
		.attr('width',0).style('fill','green');
	b.transition()
	.delay(200)
		.attr('width', function(d) {return 150 * (d.wins / (d.wins + d.losses));});

	b.on('click', function(d){sVenue = d.venue; switchTo('venue');});
	b.on('mouseover', function(d){d3.select(this).style('fill', isNewZealand[allVenues[d.venue][0]['Home Team']] ? 'blue' : 'green')});
	b.on('mouseout', function(d){d3.select(this).style('fill', 'green');});

	var b = bars.append('g')
	b.append('title').text(function(e){ return e.venue;})
	b = b.append('svg:rect')
		.attr('x', 150)
		.attr('y', function(d,i) {return 30 * i + 50;})
		.attr('height', 20)
		.attr('width',0).style('fill','red');
	b.transition()
	.delay(200)
		.attr('width', function(d) {return 150 * (d.losses / (d.wins + d.losses));})
		.attr('x', function(d) {return 150 * (d.wins / (d.wins + d.losses));});

	b.on('click', function(d){sVenue = d.venue; switchTo('venue');});
	b.on('mouseover', function(d){d3.select(this).style('fill', isNewZealand[allVenues[d.venue][0]['Home Team']] ? 'blue' : 'red')});
	b.on('mouseout', function(d){d3.select(this).style('fill', 'red');});
		//.ease('elastic')

/*listYears.forEach(function(e){
	var data = 
	var vis = d3.select("#chart")
	.append("svg:svg")              //create the SVG element inside the <body>
	.data([data])                   //associate our data with the document
	.attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
		.attr("height", h)
		.append("svg:g")                //make a group to hold our pie chart
		.attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

		var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
		.outerRadius(r);

		var pie = d3.layout.pie()           //this will create arc data for us given a list of values
		.value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array

		var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
		.data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
		.enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
		.append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
		.attr("class", "slice");    //allow us to style things in the slices (like text)

		arcs.append("svg:path")
		.attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
		.attr("d", arc).style("stroke", "#fff");
		});*/

}