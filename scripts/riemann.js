var minX = 0.0;
var maxX = 10.0;
var minIntegralX = 1.0;
var maxIntegralX = 9.0;
var minY = 0.0;
var maxY = 3.0;
var mode = 0;
var numSamples = 10.0;

function getValue(sample) {
	return Math.sin(sample) + 1.5
}

function generateLineData() {
	var data = [];
	dx = (maxX - minX)/50.0;

	for (var sampleX = minX; sampleX <= maxX; sampleX+=dx) {
		data.push({
			x: sampleX,
			y: getValue(sampleX)
		});
	}
	return data;
}

function generateBarData(numSamples, mode) {

	var dx = (maxIntegralX - minIntegralX) / numSamples;
	var data = [];

	data.push({
		x: minIntegralX,
		y: minY
	});

	for (var i = 0; i < numSamples; i++) {

		prevSample = data[data.length - 1]
		prevX = prevSample.x

		sampleX = 0.0;
		switch(mode) {
  			case 0:
    			sampleX = prevX;
    			break;
    		case 1:
    			sampleX = prevX + dx;
    			break;
    		case 2:
    			sampleX = prevX + (dx / 2.0);
    			break;
		}

		var value = getValue(sampleX);

		data.push({
			x: prevX,
			y: value
		});
		data.push({
			x: prevX + dx,
			y: value
		});
		data.push({
			x: prevX + dx,
			y: minY
		});
	}

	data.push({
		x: maxIntegralX,
		y: minY
	});

	return data;
}

function generatePointData(numSamples, mode) {

	var dx = (maxIntegralX - minIntegralX) / numSamples;
	var data = [];

	var sample = 0.0;

	switch(mode) {
  		case 0:
    		sample = minIntegralX;
    		break;
    	case 1:
    		sample = minIntegralX + dx;
    		break;
    	case 2:
    		sample = minIntegralX + (dx / 2.0);
    		break;
	}

	for (var i = 0; i < numSamples; i++) {

		var value = getValue(sample);

		data.push({
			x: sample,
			y: value
		});

		sample += dx;
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
		order: 2,
	}, {
		label: 'Bar',
		borderColor: 'rgb(77,173,237)',
		backgroundColor: 'rgba(54, 162, 235, 0.5)',
		fill: true,
		lineTension: 0,
		data: generateBarData(numSamples, mode),
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
		pointRadius: 0,
		borderWidth: 3,
		order: 1,
	}]
};

window.onload = function() {
	var ctx = document.getElementById('riemannSumChart').getContext('2d');
	window.myLine = Chart.Scatter(ctx, {
		data: lineChartData,
		options: {
			animation: {
            	duration: 250,
        	},
			responsive: true,
			hoverMode: 'index',
			stacked: false,
			title: {
				display: true,
				text: 'Chart.js Line Chart - Multi Axis'
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
};

document.getElementById('addSample').addEventListener('click', function() {
	numSamples++;
	lineChartData.datasets[1].data = generateBarData(numSamples, mode);
	lineChartData.datasets[2].data = generatePointData(numSamples, mode);

	window.myLine.update();
});

document.getElementById('removeSample').addEventListener('click', function() {
	if (numSamples > 1) {
		numSamples--;
		lineChartData.datasets[1].data = generateBarData(numSamples, mode);
		lineChartData.datasets[2].data = generatePointData(numSamples, mode);

		window.myLine.update();
	}
});

document.getElementById('changeMode').addEventListener('click', function() {
	mode = (mode + 1) % 3;
	lineChartData.datasets[1].data = generateBarData(numSamples, mode);
	lineChartData.datasets[2].data = generatePointData(numSamples, mode);

	window.myLine.update();
});