var riemannModule = (function() {

	function setupSum() {

		var ctx = document.getElementById('riemannSumChart').getContext('2d');
		var chart = Chart.Scatter(ctx, {
			data: lineChartData,
			options: {
				animation: {
		            duration: 250,
		        },
		        legend: {
		            display: false,
		        },
				tooltips: {
					enabled: false
				},
				responsive: true,
				stacked: false,
				title: {
					display: true,
					text: getGraphTitle(mode)
				},
				scales: {
					yAxes: [{
						ticks: {
		                	min: minY,
		            	}
					}],
				}
			}
		});

		return chart;
	}

	function setupConvergence() {

		var ctx = document.getElementById('riemannConvergenceChart').getContext('2d');
		var chart = Chart.Scatter(ctx, {
			data: convergenceChartData,
			options: {
				animation: {
		            duration: 250,
		        },
		        legend: {
		            display: false,
		        },
				tooltips: {
					enabled: true
				},
				responsive: true,
				stacked: false,
				title: {
					display: false,
				},
				scales: {
					xAxes: [{
						ticks: {
							min: 0,
		                	max: numSamples + 1,
		            	}
					}],
					yAxes: [{
						ticks: {
		                	min: -2,
		                	max: 2,
		            	}
					}],
				}
			}
		});

		return chart;
	}

	const modes = {
	    LEFT: 0,
	    RIGHT: 1,
	    MIDPOINT: 2,
	    TRAPEZOIDAL: 3
	}

	var minX = -Math.PI / 2.0;
	var maxX = Math.PI / 2.0;
	var minY = 0.0;
	var mode = modes.LEFT;
	var numSamples = 10.0;
	var integralSum = getFunctionIntegralValue(maxX) - getFunctionIntegralValue(minX);

	function getGraphTitle(mode) {

		var modeText = '';
		switch(mode) {
	  		case modes.LEFT:
	    		modeText = 'Left Rule';
	    		break;
	    	case modes.RIGHT:
	    	    modeText = 'Right Right';
	    		break;
	    	case modes.MIDPOINT:
	    	    modeText = 'Midpoint Rule';
	    		break;
	    	case modes.TRAPEZOIDAL:
	    	    modeText = 'Trapezoidal Rule';
	    		break;
		} 

		return 'Riemann Sum: ' + modeText;
	}

	function getFunctionValue(sample) {

		let value = Math.cos(sample);

		return value;
	}

	function getFunctionIntegralValue(sample) {
		return Math.sin(sample);
	}

	function getSegmentValues(numSamples, mode, startX, stopX) {

		var dx = (stopX - startX) / numSamples;
		var values = [];

		var sampleX = 0.0;

		switch(mode) {
	  		case modes.LEFT:
	    		sampleX = startX;
	    		break;
	    	case modes.RIGHT:
	    		sampleX = startX + dx;
	    		break;
	    	case modes.MIDPOINT:
	    		sampleX = startX + (dx / 2.0);
	    		break;
	    	case modes.TRAPEZOIDAL:
	    		sampleX = startX;
	    		break;
		}

		for (var i = 0; i < numSamples; i++) {

			var value = getFunctionValue(sampleX);
			values.push(value);

			sampleX += dx;
		}

		if (mode == modes.TRAPEZOIDAL) {
			var value = getFunctionValue(sampleX);
			values.push(value);
		}

		return values;
	}

	function generateLineData() {

		var data = [];
		let lineSamples = 50
		dx = (maxX - minX)/lineSamples;

		for (var i = minX; i < lineSamples + 1; i++) {

			let sample = minX + i * dx;
			data.push({
				x: sample,
				y: getFunctionValue(sample)
			});
		}
		return data;
	}

	function generateBarData(numSamples, mode, startX, stopX) {

		var dx = (stopX - startX) / numSamples;
		var values = getSegmentValues(numSamples, mode, startX, stopX);
		var data = [];
		var posX = startX;

		data.push({
			x: posX,
			y: minY
		});

		for (var i = 0; i < numSamples; i++) {

			var valueLeft = values[i];
			var valueRight = values[i];

			if (mode == 3) {
				valueRight = values[i + 1];
			}

			data.push({
				x: posX,
				y: valueLeft
			});

			// Update x position
			posX += dx;

			data.push({
				x: posX,
				y: valueRight
			});
			data.push({
				x: posX,
				y: minY
			});
		}

		data.push({
			x: posX,
			y: minY
		});

		return data;
	}

	function getSum(numSamples, values, mode, minX, maxX) {

		var sum = 0.0;
		var dx = (maxX - minX) / numSamples;
		for (var i = 0; i < numSamples; i++) {

			if (mode == modes.TRAPEZOIDAL) {
				var v1  = values[i];
				var v2  = values[i + 1];
				sum += (0.5 * dx * (v1 + v2));
			}
			else {
				sum += (values[i] * dx);
			}
		}

		return sum;
	}

	function generateConvergenceData(numSamples, mode, minX, maxX, integralSum) {

		var data = [];

		for (var i = 1; i <= numSamples; i++) {
			var values = getSegmentValues(i, mode, minX, maxX);
			var sum = getSum(i, values, mode, minX, maxX);
			data.push({
				x: i,
				y: (integralSum - sum)
			});
		}
		return data;
	}

	function generatePointData(numSamples, mode) {

		var dx = (maxX - minX) / numSamples;
		var data = [];

		var sample = 0.0;

		switch(mode) {
	  		case modes.LEFT:
	    		sample = minX;
	    		break;
	  		case modes.RIGHT:
	    		sample = minX + dx;
	    		break;
	    	case modes.MIDPOINT:
	    		sample = minX + (dx / 2.0);
	    		break;
	    	case modes.TRAPEZOIDAL:
	    	   	sample = minX;
	    	    break;
		}

		for (var i = 0; i < numSamples; i++) {

			var value = getFunctionValue(sample);

			data.push({
				x: sample,
				y: value
			});

			sample += dx;
		}

		// Need to add extra point for trapezoidal
		if (mode == modes.TRAPEZOIDAL) {

			var value = getFunctionValue(sample);

			data.push({
				x: sample,
				y: value
			});
		}

		return data;
	}

	var lineChartData = {
		datasets: [{
			label: 'Line',
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgb(255, 99, 132)',
			fill: false,
			lineTension: 0,
			data: generateLineData(),
			type: 'line',
			pointRadius: 0,
			borderWidth: 4,
			order: 2,
		}, {
			label: 'Bar',
			borderColor: 'rgb(77,173,237)',
			backgroundColor: 'rgba(54, 162, 235, 0.5)',
			fill: true,
			lineTension: 0,
			data: generateBarData(numSamples, mode, minX, maxX),
			type: 'line',
			pointRadius: 0,
			order: 3,
		}, {
			label: 'Bar Points',
			borderColor: 'rgb(77,173,237)',
			backgroundColor: 'rgb(255, 255, 255)',
			fill: false,
			lineTension: 0,
			data: generatePointData(numSamples, mode),
			type: 'scatter',
			pointRadius: 3,
			borderWidth: 3,
			order: 1,
		}]
	};

	var convergenceChartData = {
		datasets: [{
			label: 'Line',
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgb(255, 99, 132)',
			fill: false,
			lineTension: 0,
			data: generateConvergenceData(numSamples, mode, minX, maxX, integralSum),
			type: 'line',
			pointRadius: 3,
			borderWidth: 3,
		}] 
	};

	function addSample() {

		numSamples++;
		lineChartData.datasets[1].data = generateBarData(numSamples, mode, minX, maxX);
		lineChartData.datasets[2].data = generatePointData(numSamples, mode);

		convergenceChartData.datasets[0].data = generateConvergenceData(numSamples, mode, minX, maxX, integralSum);
		window.riemannConvergence.options.scales.xAxes[0].ticks.max = numSamples + 1;

		window.riemannSum.update();
		window.riemannConvergence.update();
	}

	function removeSample() {

		if (numSamples > 1) {
			numSamples--;
			lineChartData.datasets[1].data = generateBarData(numSamples, mode, minX, maxX);
			lineChartData.datasets[2].data = generatePointData(numSamples, mode);
			
			convergenceChartData.datasets[0].data = generateConvergenceData(numSamples, mode, minX, maxX, integralSum);
			window.riemannConvergence.options.scales.xAxes[0].ticks.max = numSamples + 1;

			window.riemannSum.update();
			window.riemannConvergence.update();
		}
	}

	function changeMode() {

		mode = (mode + 1) % (modes.TRAPEZOIDAL + 1);
		lineChartData.datasets[1].data = generateBarData(numSamples, mode, minX, maxX);
		lineChartData.datasets[2].data = generatePointData(numSamples, mode);

		convergenceChartData.datasets[0].data = generateConvergenceData(numSamples, mode, minX, maxX, integralSum);

		window.riemannSum.options.title.text = getGraphTitle(mode);
		window.riemannSum.update();
		window.riemannConvergence.update();
	}

	return {
	    setupSum: setupSum,
	    setupConvergence: setupConvergence,
	    addSample: addSample,
	    removeSample: removeSample,
	    changeMode: changeMode
	 };

})();
