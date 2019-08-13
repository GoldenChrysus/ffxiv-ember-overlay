import React from "react";
import { Line } from "react-chartjs-2";

class HistoryChart extends React.Component {
	render() {
		let history     = this.props.history;
		let player      = this.props.player;
		let line_data   = {
			labels   : [],
			datasets : [
				{
					label : "DPS",
					data  : []
				},
				{
					label : "HPS",
					data  : []
				}
			]
		};
		let player_name = player.name;
		let base_time   = +Object.keys(history)[0];

		for (let time in history) {
			let item = history[time];
			let data = {
				dps : 0,
				hps : 0
			}

			let encounter_time = +time - base_time;

			if (encounter_time === 0) {
				continue;
			}

			let minutes = Math.floor(encounter_time / 60);
			let seconds = encounter_time - (minutes * 60);

			if (seconds < 10) {
				seconds = `0${seconds}`;
			}

			if (item[player_name]) {
				data.dps = item[player_name].encdps;
				data.hps = item[player_name].enchps;
			}

			line_data.labels.push(`${minutes}:${seconds}`);
			line_data.datasets[0].data.push(data.dps);
			line_data.datasets[1].data.push(data.hps);
		}

		return (
			<div>
				<Line data={line_data} height={125}/>
			</div>
		);
	}
}

export default HistoryChart;