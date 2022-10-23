import React from "react";
import ChartComponent from "react-chartjs-2";
import { Line, defaults } from "react-chartjs-2";

import LocalizationService from "../../../services/LocalizationService";

class HistoryChart extends React.Component {
	UNSAFE_componentWillMount() {
		if (this.props.theme === "ffxiv-classic") {
			defaults.global.defaultFontColor = "#d9d6dd";
		}

		ChartComponent.prototype.destroyChart = function() {
			this.saveCurrentDatasets();

			const datasets = [];

			for (const i in this.datasets) {
				datasets.push(this.datasets[i]);
			}

			this.chartInstance.config.data.datasets = datasets;

			this.chartInstance.destroy();
		};
	}

	render() {
		const metrics = [
			{
				name       : LocalizationService.getPlayerDataTitle("encdps", "short"),
				key        : "encdps",
				background : "rgba(116, 51, 51, 0.85)",
				border     : "rgba(0, 0, 0, 0.2)",
			},
			{
				name       : LocalizationService.getPlayerDataTitle("enchps", "short"),
				key        : "enchps",
				background : "rgba(60, 103, 47, 0.85)",
				border     : "rgba(0, 0, 0, 0.2)",
			},
			{
				name       : LocalizationService.getPlayerDataTitle("enctps", "short"),
				key        : "enctps",
				background : "rgba(59, 78, 171, 0.85)",
				border     : "rgba(0, 0, 0, 0.2)",
			},
		];

		const history     = this.props.history;
		const player      = this.props.player;
		const line_data   = {
			labels   : [],
			datasets : [],
		};
		const player_name = player.name;
		const base_time   = Number(Object.keys(history)[0]);
		const max_values  = {};

		for (const i in metrics) {
			max_values[i] = 0;

			line_data.datasets.push(
				{
					i,
					label           : metrics[i].name,
					backgroundColor : metrics[i].background,
					borderColor     : metrics[i].border,
					data            : [],
				},
			);
		}

		for (const time in history) {
			const item           = history[time];
			const encounter_time = Number(time) - base_time;

			if (encounter_time === 0) {
				continue;
			}

			const minutes = Math.floor(encounter_time / 60);
			let seconds   = encounter_time - (minutes * 60);

			if (seconds < 10) {
				seconds = `0${seconds}`;
			}

			line_data.labels.push(`${minutes}:${seconds}`);

			const player = item[player_name];

			for (const i in metrics) {
				const key = metrics[i].key;
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
