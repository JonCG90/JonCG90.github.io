var monteCarloModule = (function() {

	var sampling = false;

	var samples = [];
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
			label: 'Line',
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgb(255, 99, 132)',
			fill: false,
			lineTension: 0,
			data: generateLineData(0, 10),
			type: 'line',
			pointRadius: 0,
			borderWidth: 3,
			order: 1,
		}, {
			label: 'Sample Points',
			borderColor: 'rgb(150, 150, 150)',
			fill: false,
			lineTension: 0,
			data: samples,
			type: 'scatter',
			pointRadius: 5,
			borderWidth: 2,
			order: 0,
		}] 
	};

	function addSample() {

		if (sampling) {

			var sample = minX + (maxX - minX) * Math.random();
			var value = getFunctionValue(sample);

			samples.push({
				x: sample,
				y: value
			});

			monteCarloChartData.datasets[1].data = samples;

			window.monteCarlo.update();
			window.setTimeout(addSample, 100);
		}
	}

	function startSampling() {
		sampling = true;
		window.setTimeout(addSample, 100);
	}

	function stopSampling() {
		sampling = false;
	}

	function reset() {
		sampling = false;
		samples = [];
		monteCarloChartData.datasets[1].data = samples;
		window.monteCarlo.update();
	}

	return {
	    setup: setup,
	    startSampling: startSampling,
	    stopSampling: stopSampling,
	    reset: reset
	 };

})();