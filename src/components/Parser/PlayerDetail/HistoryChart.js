import React from "react";
import ChartComponent from "react-chartjs-2";
import { Line } from "react-chartjs-2";

class HistoryChart extends React.Component {
	componentWillMount() {
		ChartComponent.prototype.destroyChart = function() {
			this.saveCurrentDatasets();

			let datasets = [];

			for (let i in this.datasets) {
				datasets.push(this.datasets[i]);
			}

			this.chartInstance.config.data.datasets = datasets;

			this.chartInstance.destroy();
		}
	}

	render() {
		const metrics               = [
			{
				name : "DPS",
				key  : "encdps"
			},
			{
				name : "HPS",
				key  : "enchps"
			},
			{
				name : "TPS",
				key  : "enctps"
			}
		];
		const background_difference = 0.03;

		let history        = this.props.history;
		let player         = this.props.player;
		let is_light_theme = (this.props.light_theme);
		let first_alpha    = (is_light_theme) ? 0.09 : 0.05;
		let alpha_color    = (is_light_theme) ? 0 : 255;
		let line_data      = {
			labels   : [],
			datasets : []
		};
		let player_name    = player.name;
		let base_time      = +Object.keys(history)[0];

		for (let i in metrics) {
			let alpha = first_alpha + (background_difference * i);

			line_data.datasets.push(
				{
					label           : metrics[i].name,
					backgroundColor : `rgba(${alpha_color}, ${alpha_color}, ${alpha_color}, ${alpha})`,
					borderColor     : `rgba(${alpha_color}, ${alpha_color}, ${alpha_color}, ` + (alpha - 0.03) + `)`,
					data            : []
				}
			);
		}

		for (let time in history) {
			let item           = history[time];
			let encounter_time = +time - base_time;

			if (encounter_time === 0) {
				continue;
			}

			let minutes = Math.floor(encounter_time / 60);
			let seconds = encounter_time - (minutes * 60);

			if (seconds < 10) {
				seconds = `0${seconds}`;
			}

			line_data.labels.push(`${minutes}:${seconds}`);

			let player = item[player_name];

			for (let i in metrics) {
				let key   = metrics[i].key;
				let value = 0;

				if (player) {
					value = player[key];
				}

				line_data.datasets[i].data.push(value);
			}
		}

		return (
			<div>
				<Line data={line_data} height={125}/>
			</div>
		);
	}
}

export default HistoryChart;