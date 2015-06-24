function graph6() {
	// define dimensions of graph
	var m = [40, 40, 60, 40]; // margins
	var w = 900 - m[1] - m[3]; // width
	var h = 500 - m[0] - m[2]; // height

	var color = d3.scale.category20();

	// X scale will fit all values from data[] within pixels 0-w
	var x = d3.scale.linear().domain([1,17]).range([0, w]);
	// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
	var y = d3.scale.linear().domain([10, 1]).range([h, 0]);
	// automatically determining max range can work something like this
	// var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

	// create a line function that can convert data[] into x and y points
	var line = d3.svg.line()
	// assign the X function to plot our line as we wish
	.x(function(d,i) { 
		return x(i+1); 
	})
	.y(function(d) { 
		return y(d); 
	})

	var qTeam = sTeam;
	sYear = showYear;

	var titleDiv = d3.select('#chart').append('div').attr('class','remove').style('padding-top', '20px').style('text-align', 'center').html('<h2>Team: <span id="teamname">' + sTeam + '</span></h2>');
	titleDiv.select('#teamname').style('color', isNewZealand[sTeam] ? 'Blue' : 'Red');
	var select = titleDiv.append('div').attr('class','remove').append('select').on('change', function(e){sTeam = this.value;d3.select('#teamname').html(sTeam);titleDiv.select('#teamname').style('color', isNewZealand[sTeam] ? 'Blue' : 'Red');
		graph5(sTeam);

		graph.selectAll('.area').remove();
		graph.selectAll('circle').remove();
		qTeam = sTeam; sYear = showYear; selectA.property('value', showYear); selectB.property('value',sTeam); update()

});

	select.selectAll('option')
	.data(listTeams.slice().sort()).enter()
	.append('option')
	.attr('value', function(e){ 
		return e;})
		.text(function(d){return d;});
	
	select.property('value', sTeam);
	var other = select;

	titleDiv.append('p').attr('class', 'hovertext').text('Click a line for more options. Right click to delete a single line.');

	// Add an SVG element with the desired dimensions and margin.
	var graph = d3.select("#chart").append('div').attr('class','remove').style('text-align','center').append("svg:svg").style('text-align','center')
	.attr("width", w + m[1] + m[3])
	.attr("height", h + m[0] + m[2])
	.append("svg:g")
	.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	// create yAxis
	var xAxis = d3.svg.axis().scale(x).ticks(17).tickSize(-15);
	// Add the x-axis.
	graph.append("svg:g").append("svg:g").attr('class', 'focus').append('svg:g')
	.attr("class", "x axis")
	.attr("transform", "translate(" + 0 +"," + (h + 15) + ")")
	.call(xAxis).append("text")
    .attr("transform", "translate("+ w/2 + ")")
    .attr("y", 25)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Round").style('font-weight', 'bold');

	graph.append('rect').attr('x', x(14.5)).attr('y',0)
	.attr('width', 2.5*w/16).attr('height', h)
	.style('fill', 'yellow').style('opacity', '0.5')
	.on('mouseover', function(e) {var s = d3.select(this); s.style('fill', 'gold');} ).on('click', function(){createFinals();})
	.on('mouseout', function(e) {var s = d3.select(this); s.style('fill', 'yellow'); /*graph.selectAll('.temp').remove();*/});
	graph.append('svg:g').append('svg:text').attr('class','temp').text('FINALS').style('font-weight', 'bold').attr('x',x(16.0)).attr('y', y(9.5));

	// create left yAxis
	var yAxisLeft = d3.svg.axis().scale(y).orient("left").tickSize(-w).tickSubdivide(true);
	// Add the y-axis to the left
	var context = graph.append("svg:g").attr('class', 'focus').append('svg:g')
	.attr("class", "y axis")
	.attr("transform", "translate(0,0)")
	.call(yAxisLeft)
	.append("text")
    .attr("transform", "rotate(-90)")
	.attr('y', -30)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Rank").style('font-weight', 'bold');

	function update() {
		// tabulate round data
		if (sYear === "All") {
			var totalData = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			var incre = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			listYears.forEach(function(x){	
				var yearGames = allGames[x];
				var index = 0;
				var games = [];
				var data = [];
				for (var i = 1; i < 15; i++) {
					// while you haven't got to the next round yet
					while (yearGames[index].Round <= i) {
						games.push(yearGames[index]);
						index++;
					}
					data.push(teamRank(games).sort(function(a,b){ return b.points - a.points;}));
				}
				//console.log(data);

				var rData = data.map(function(e) { 
					for (var i = 0; i < e.length; i++) {
						if (e[i].name === qTeam) {
							return i+1;
						}
					}
				});
				var r = rank(x).indexOf(qTeam) + 1;
				//console.log(r);
				if (r !== -1) {
					// if they ranked
					var rr = rData[rData.length - 1];
					if (rr <= 2) {
						if (r === 3) {rData.push(2); rData.push(3);} else {
							var rrr = yearGames[index];
							var sss = teamRank([rrr]).filter(function(e) {return e.name === qTeam;})[0];
							if (sss.points > 0) {
								rData.push(1);
								rData.push(1);
							} else {
								rData.push(2);
								rData.push(2);
							}
							rData.push(r);
						}
					} else {
						if (r === 4) {rData.push(4);}
						if (r === 3) {rData.push(3); rData.push(3);}
						if (r === 2) {rData.push(3); rData.push(2); rData.push(2);}
						if (r === 1) {rData.push(3); rData.push(2); rData.push(1);}
					}
				}	
				for (var i = 0; i < rData.length; i++) {
					totalData[i] += rData[i];
					incre[i]++;
				}
			});
			for(var hello = 0; hello < totalData.length; hello++) {
				if (incre[hello] === 0) {
					totalData = totalData.slice(0,hello);
					break;
				}
				totalData[hello] = totalData[hello]/incre[hello];
			}	
			rData = totalData;
			//console.log(rData);
		} else {
			var yearGames = allGames[sYear];
			var index = 0;
			var games = [];
			var data = [];
			for (var i = 1; i < 15; i++) {
				// while you haven't got to the next round yet
				while (yearGames[index].Round <= i) {
					games.push(yearGames[index]);
					index++;
				}
				//console.log(i);
				//console.log(index);
				data.push(teamRank(games).sort(function(a,b){ return b.points - a.points;}));
			}
			//console.log(data);

			var rData = data.map(function(e) { 
				for (var i = 0; i < e.length; i++) {
					if (e[i].name === qTeam) {
						return i+1;
					}
				}
			});
			var r = rank(sYear).indexOf(qTeam) + 1;
			//console.log(r);
			if (r !== -1) {
				// if they ranked
				var rr = rData[rData.length - 1];
				if (rr <= 2) {
					if (r === 3) {rData.push(2); rData.push(3);} else {
						var rrr = yearGames[index];
						var sss = teamRank([rrr]).filter(function(e) {return e.name === qTeam;})[0];
						if (sss.points > 0) {
							rData.push(1);
							rData.push(1);
						} else {
							rData.push(2);
							rData.push(2);
						}
						rData.push(r);
					}
				} else {
					if (r === 4) {rData.push(4);}
					if (r === 3) {rData.push(3); rData.push(3);}
					if (r === 2) {rData.push(3); rData.push(2); rData.push(2);}
					if (r === 1) {rData.push(3); rData.push(2); rData.push(1);}
				}
			}	
		}

		var ctx = graph.selectAll('.dots').data([rData]);

		var toReview = null;
		var yearR = null;

		ctx.enter().append('g').attr('class', 'line').attr('team',qTeam).attr('year',sYear).on('click', function(){
			d3.select('.line').classed('selected',false);
			var t = d3.select(this).attr('team');
			//console.log(t);
			//console.log(toReview);
			if (t == toReview) {
				d3.select(this).classed('selected', false);
				toReview = null;
				return;
			}
			toReview = t;
			yearR = d3.select(this).attr('year');
			d3.select(this).classed('selected',true);
		}).on('mouseover', function() {d3.selectAll('.hovertext').text(d3.select(this).attr('team') + " (" + d3.select(this).attr('year')+ ")");})
		.on('mouseout', function() {
			if (toReview == null) {
				d3.selectAll('.hovertext').text('Click a line for more options. Right click to delete a single line.'); return;
			}
			d3.selectAll('.hovertext').html('<span id="span1" class="hovered"> See Rivalry With This Team </span> ' + toReview + " (" + yearR + ") <span id='span2' class='hovered'> Switch To This Team </span>");
			d3.selectAll('#span1').on('click', function(e) {if (sTeam == toReview) {alert("You can't have a rivalry with yourself."); return;}rival1 = sTeam; rival2 = toReview; switchTo('rival');}).style('margin-right','50px').style('color','green').style('text-decoration','underline');
			d3.selectAll('#span2').on('click', function(e) {
				sTeam = toReview;
				graph.selectAll('.area').remove();
				graph.selectAll('circle').remove();
				qTeam = sTeam; selectB.property('value',sTeam); update();
				other.property('value', sTeam);
				d3.selectAll('#teamname').html(sTeam);
			}).style('margin-left', '50px').style('color','red').style('text-decoration', 'underline');
		});

		ctx.selectAll('path').data(function(d) {return [d];}).enter().append("path")
		.attr("class", "area")
		.style('stroke', function(d) {if (qTeam == sTeam && sYear == showYear) return 'black';return color(qTeam + "" + sYear);}).style('stroke-width', '4').style('fill', 'none')
		.transition()
		.duration(2000)
		.attrTween('d', function(data) {
			var interpolate = d3.scale.quantile()
			.domain([0,1])
			.range(d3.range(1, 18));
			return function(t) {
				return line(data.slice(0, interpolate(t)));
			};
		});

		ctx.on('contextmenu', function(data, index) {d3.event.preventDefault();d3.select(this).remove();});

		var circ = ctx.selectAll('circle').data(rData)
		.enter().append('circle').transition().delay(200)
		.attr('cx', function (d, i) { return x(i+1); })
		.attr('cy', function (d) { return y(d); })
		.attr('r', 4);
		//console.log(rData);
	}

	update();

	var divvy = d3.select('#chart').append('div').attr('class','remove').style('text-align','center');
	var selectB = divvy.append('select').on('change', function(e){qTeam = this.value;});

	selectB.selectAll('option')
	.data(listTeams).enter()
	.append('option')
	.attr('value', function(e){ 
		return e;})
		.text(function(d){return d;});
	selectB.property('value', sTeam);
	qTeam = sTeam;

	var selectA = divvy.append('select').on('change', function(e){sYear = this.value;});

	selectA.selectAll('option')
	.data(['All'].concat(listYears)).enter()
	.append('option')
	.attr('value', function(e){ 
		return e;})
		.text(function(d){return d;});
	selectA.property('value', showYear);

	var select = divvy.append('input').attr('type', 'button').attr('value', 'Add line').on('click', function(e){update();});



	var select = divvy.append('input').attr('type', 'button').attr('value', 'Reset').on('click', function(e){
		graph.selectAll('.area').remove();
		graph.selectAll('circle').remove();
		qTeam = sTeam; sYear = showYear; selectA.property('value', showYear); selectB.property('value',sTeam); /*update()*/

	;});

	var select = divvy.append('input').attr('type', 'button').attr('value', 'All Years For Team').on('click', function(e){
		var temp = sYear;
		listYears.forEach(function(e) {sYear = e; update();});
		sYear = temp;
	;});

	var select = divvy.append('input').attr('type', 'button').attr('value', 'All Teams For Year').on('click', function(e){
		var temp = qTeam;
		listTeams.forEach(function(e) {qTeam = e; update();});
		qTeam = temp;
	;});

	d3.selectAll('.picker').on('change', function(e){
	graph5(sTeam);
		graph.selectAll('.area').remove();
		graph.selectAll('circle').remove();
	qTeam = sTeam; sYear = showYear; selectA.property('value', showYear); selectB.property('value',sTeam); update();});

}