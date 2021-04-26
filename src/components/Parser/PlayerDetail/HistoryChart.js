import React from "react";
import ChartComponent from "react-chartjs-2";
import { Line, defaults } from "react-chartjs-2";

import LocalizationService from "../../../services/LocalizationService";

class HistoryChart extends React.Component {
	componentWillMount() {
		if (this.props.theme === "ffxiv-classic") {
			defaults.global.defaultFontColor = "#d9d6dd";
		}

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
		const metrics = [
			{
				name       : LocalizationService.getPlayerDataTitle("encdps", "short"),
				key        : "encdps",
				background : "rgba(116, 51, 51, 0.85)",
				border     : "rgba(0, 0, 0, 0.2)"
			},
			{
				name       : LocalizationService.getPlayerDataTitle("enchps", "short"),
				key        : "enchps",
				background : "rgba(60, 103, 47, 0.85)",
				border     : "rgba(0, 0, 0, 0.2)"
			},
			{
				name       : LocalizationService.getPlayerDataTitle("enctps", "short"),
				key        : "enctps",
				background : "rgba(59, 78, 171, 0.85)",
				border     : "rgba(0, 0, 0, 0.2)"
			}
		];

		let history        = this.props.history;
		let player         = this.props.player;
		let line_data      = {
			labels   : [],
			datasets : []
		};
		let player_name    = player.name;
		let base_time      = +Object.keys(history)[0];
		let max_values     = {};

		for (let i in metrics) {
			max_values[i] = 0;

			line_data.datasets.push(
				{
					i               : i,
					label           : metrics[i].name,
					backgroundColor : metrics[i].background,
					borderColor     : metrics[i].border,
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

				if (value > max_values[i]) {
					max_values[i] = value;
				}

				line_data.datasets[i].data.push(value);
			}
		}

		line_data.datasets.sort((a, b) => {
			if (max_values[a.i] === max_values[b.i]) {
				return 0;
			}

			return (max_values[a.i] < max_values[b.i]) ? -1 : 1;
		});

		return (
			<div>
				<Line data={line_data} height={125}/>
			</div>
		);
	}
}

export default HistoryChart;