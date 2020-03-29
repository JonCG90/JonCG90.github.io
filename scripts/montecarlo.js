sampling = false;

function generateMonteCarloData(numSamples, minX, maxX) {

	var data = [];

	for (var i = 1; i <= numSamples; i++) {
		data.push({
			x: i,
			y: i
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
		data: generateMonteCarloData(numSamples, 0, 10),
		type: 'line',
		pointRadius: 3,
		borderWidth: 3,
	}] 
};

function addSample() {

	if (sampling) {
		numSamples++;

		monteCarloChartData.datasets[0].data = generateMonteCarloData(numSamples, 0, 10);
		window.monteCarlo.update();
		window.setTimeout(addSample, 100);
	}
}

document.getElementById('startSampling').addEventListener('click', function() {
	sampling = true;
	window.setTimeout(addSample, 100);
});

document.getElementById('stopSampling').addEventListener('click', function() {
	sampling = false;
});