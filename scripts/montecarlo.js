var monteCarloModule = (function() {

	var sampling = false;

	var samplePoints = [];
	var sampleBars = [];
	var minX = -Math.PI / 2.0;
	var maxX = Math.PI / 2.0;
	var minY = 0.0;
	var maxY = 1.1;
	var sampleRate = 10;

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
					yAxes: [{
						ticks: {
		                	min: 0,
		            	}
					}],
				}
			}
		});

		return chart;
	}

	function getFunctionValue(sample) {

		let value = Math.cos(sample);

		return value;
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
			data: generateLineData(minX, maxX),
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

			window.setTimeout(addWithCallback, sampleRate);
		}
	}

	function startSampling(callback) {
		sampling = true;

		function addWithCallback() {
			addSample(callback);
		}

		window.setTimeout(addWithCallback, sampleRate);
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
			sum += sample.y * (maxX - minX);

			var value = (sum / i);
			values.push(value - 2.0);
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