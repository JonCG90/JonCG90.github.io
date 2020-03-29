const modes = {
    LEFT: 0,
    RIGHT: 1,
    MIDPOINT: 2,
    TRAPEZOIDAL: 3
}

var minX = 0.0;
var maxX = 10.0;
var minIntegralX = 1.0;
var maxIntegralX = 9.0;
var minY = 0.0;
var maxY = 3.0;
var mode = modes.LEFT;
var numSamples = 10.0;
var integralSum = getFunctionIntegralValue(maxIntegralX) - getFunctionIntegralValue(minIntegralX);

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
	return Math.sin(sample) + 1.5
}

function getFunctionIntegralValue(sample) {
	return -Math.cos(sample) + 1.5 * sample;
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
	dx = (maxX - minX)/50.0;

	for (var sampleX = minX; sampleX <= maxX; sampleX+=dx) {
		data.push({
			x: sampleX,
			y: getFunctionValue(sampleX)
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

	var dx = (maxIntegralX - minIntegralX) / numSamples;
	var data = [];

	var sample = 0.0;

	switch(mode) {
  		case modes.LEFT:
    		sample = minIntegralX;
    		break;
  		case modes.RIGHT:
    		sample = minIntegralX + dx;
    		break;
    	case modes.MIDPOINT:
    		sample = minIntegralX + (dx / 2.0);
    		break;
    	case modes.TRAPEZOIDAL:
    	   	sample = minIntegralX;
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
		data: generateBarData(numSamples, mode, minIntegralX, maxIntegralX),
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

var convergenceChartData = {
	datasets: [{
		label: 'Line',
		borderColor: 'rgb(255, 99, 132)',
		backgroundColor: 'rgb(255, 99, 132)',
		fill: false,
		lineTension: 0,
		data: generateConvergenceData(numSamples, mode, minIntegralX, maxIntegralX, integralSum),
		type: 'line',
		pointRadius: 3,
		borderWidth: 3,
	}] 
};

document.getElementById('addSample').addEventListener('click', function() {
	numSamples++;
	lineChartData.datasets[1].data = generateBarData(numSamples, mode, minIntegralX, maxIntegralX);
	lineChartData.datasets[2].data = generatePointData(numSamples, mode);

	convergenceChartData.datasets[0].data = generateConvergenceData(numSamples, mode, minIntegralX, maxIntegralX, integralSum);
	window.riemannConvergence.options.scales.xAxes[0].ticks.max = numSamples + 1;

	window.riemannSum.update();
	window.riemannConvergence.update();
});

document.getElementById('removeSample').addEventListener('click', function() {
	if (numSamples > 1) {
		numSamples--;
		lineChartData.datasets[1].data = generateBarData(numSamples, mode, minIntegralX, maxIntegralX);
		lineChartData.datasets[2].data = generatePointData(numSamples, mode);
		
		convergenceChartData.datasets[0].data = generateConvergenceData(numSamples, mode, minIntegralX, maxIntegralX, integralSum);
		window.riemannConvergence.options.scales.xAxes[0].ticks.max = numSamples + 1;

		window.riemannSum.update();
		window.riemannConvergence.update();
	}
});

document.getElementById('changeMode').addEventListener('click', function() {
	mode = (mode + 1) % (modes.TRAPEZOIDAL + 1);
	lineChartData.datasets[1].data = generateBarData(numSamples, mode, minIntegralX, maxIntegralX);
	lineChartData.datasets[2].data = generatePointData(numSamples, mode);

	convergenceChartData.datasets[0].data = generateConvergenceData(numSamples, mode, minIntegralX, maxIntegralX, integralSum);

	window.riemannSum.options.title.text = getGraphTitle(mode);
	window.riemannSum.update();
	window.riemannConvergence.update();
});