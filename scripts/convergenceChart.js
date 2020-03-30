var errorChartModule = (function() {

	var dataSource;
	var value = 0.0;

	var chartData = {
		datasets: [{
			label: 'Line',
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgb(255, 99, 132)',
			fill: false,
			lineTension: 0,
			data: [],
			type: 'line',
			pointRadius: 0,
			borderWidth: 4,
		}]
	};

	function getChartData(dataSource) {

		var data = [];
		var sums = dataSource.getSumValues();

		for (var i = 0; i < sums.length; i++) {

			var sum = sums[i];
			data.push({
				x: i,
				y: sum
			});
		}

		return data;
	}

	function setup(chartName, dataSource) {

		update(dataSource);

		var ctx = document.getElementById(chartName).getContext('2d');
		var chart = Chart.Scatter(ctx, {
			data: chartData,
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
					display: false,
				},
				// scales: {
				// 	xAxes: [{
				// 		ticks: {
				// 			min: 0,
		  //               	max: 10,
		  //           	}
				// 	}],
				// 	yAxes: [{
				// 		ticks: {
		  //               	min: 0,
		  //               	max: 10,
		  //           	}
				// 	}],
				// }
			}
		});

		return chart;
	}

	function update(dataSource) {

		chartData.datasets[0].data = getChartData(dataSource);
	}

	return {
	    setup: setup,
	    update: update,
	 };

})();
