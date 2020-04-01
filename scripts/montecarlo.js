var monteCarloModule = (function() {

	var sampling = false;

	var samplePoints = [];
	var sampleBars = [];
	var minX = 0.0;
	var maxX = 10.0;
	var minIntegralX = 1.0;
	var maxIntegralX = 9.0;
	var minY = 0.0;
	var maxY = 3.0;

	function setup() {

		var ctx = document.getElementById('monteCarloChart').getContext('2d');
		var chart = Chart.Scatter(ctx, {
			data: monteCarloChartData,
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
					text: 'Monte Carlo'
				},
				elements: {
					point: {
						pointStyle: 'circle'
					},
				},
				scales: {
					xAxes: [{
						ticks: {
							min: minX,
		                	max: maxX,
		            	}
					}],
					yAxes: [{
						ticks: {
		                	min: minY,
		                	max: maxY,
		            	}
					}],
				}
			}
		});

		return chart;
	}

	function getFunctionValue(sample) {
		return Math.sin(sample) + 1.5;
	}

	function generateLineData(minX, maxX) {

		var data = [];
		var numSamples = 50;

		for (var i = minX; i <= maxX; i+=1/numSamples) {
			data.push({
				x: i,
				y: getFunctionValue(i)
			});
		}
		return data;
	}

	var monteCarloChartData = {
		datasets: [{
			borderColor: 'rgb(255, 99, 132)',
			fill: false,
			lineTension: 0,
			data: generateLineData(0, 10),
			type: 'line',
			pointRadius: 0,
			borderWidth: 3,
			order: 1,
		}, {
			borderColor: 'rgb(150, 150, 150)',
			fill: false,
			lineTension: 0,
			data: [],
			type: 'scatter',
			pointRadius: 5,
			borderWidth: 2,
			order: 0,
		}, {
			borderColor: 'rgb(0, 99, 132)',
			fill: false,
			lineTension: 0,
			data: [],
			type: 'line',
			pointRadius: 0,
			borderWidth: 1,
			order: 0,
		}] 
	};

	function addSample(callback) {

		if (sampling) {

			var sample = minX + (maxX - minX) * Math.random();
			var value = getFunctionValue(sample);

			// Update sample point data
			samplePoints.push({
				x: sample,
				y: value
			});

			// Update sample bars data
			sampleBars.push({
				x: sample,
				y: -1
			});
			sampleBars.push({
				x: sample,
				y: value
			});
			sampleBars.push({
				x: sample,
				y: -1
			});

			monteCarloChartData.datasets[1].data = samplePoints;
			monteCarloChartData.datasets[2].data = sampleBars;

			callback();
			window.monteCarlo.update();

			function addWithCallback() {
				addSample(callback);
			}

			window.setTimeout(addWithCallback, 100);
		}
	}

	function startSampling(callback) {
		sampling = true;

		function addWithCallback() {
			addSample(callback);
		}

		window.setTimeout(addWithCallback, 100);
	}

	function stopSampling() {
		sampling = false;
	}

	function reset() {
		sampling = false;
		samplePoints = [];
		sampleBars = [];

		monteCarloChartData.datasets[1].data = samplePoints;
		monteCarloChartData.datasets[2].data = sampleBars;

		window.monteCarlo.update();
	}

	function getSumValues() {

		var values = [];

		var sum = 0;
		for (var i = 0; i < samplePoints.length; i++) {

			var sample = samplePoints[i];
			sum += sample.y;

			var value = (sum / i);
			values.push(value);
		}

		return values;
	}

	return {
	    setup: setup,
	    startSampling: startSampling,
	    stopSampling: stopSampling,
	    reset: reset,
	    getSumValues: getSumValues
	 };

})();