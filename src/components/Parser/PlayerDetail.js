import React from "react";
import { connect } from "react-redux";

import PlayerProcessor from "../../processors/PlayerProcessor";
import LocalizationService from "../../services/LocalizationService";
import HistoryChart from "./PlayerDetail/HistoryChart";

class PlayerDetail extends React.Component {
	render() {
		let player      = this.props.player;
		let players     = [];
		let job         = player.Job.toUpperCase() || "LMB";
		let detail_data = this.props.detail_data;
		let sections    = [
			<div className="split" key="chart-split"></div>,
			<HistoryChart player={player} history={this.props.history} light_theme={this.props.light_theme} key="chart"/>
		];

		for (let i in this.props.players) {
			players.push(this.props.players[i]);
		}

		for (let section_type in detail_data) {
			let detail  = detail_data[section_type];
			let columns = [];

			for (let key of detail) {
				let title = LocalizationService.getPlayerDataTitle(key, "long");
				let value = PlayerProcessor.getDataValue(key, player, players, this.props.encounter);

				columns.push(
					<div className="column" key={key}>
						<div className="title" key={key + "-title"}>{title}</div>
						<div className="value" key={key + "-value"}>{value}</div>
					</div>
				);
			}

			sections.push(
				<div className="split" key={section_type + "-split"}></div>
			);
			sections.push(
				<div className="section" key={section_type}>
					<div className="title" key={section_type + "-title"}>{LocalizationService.getOverlayText(section_type)}</div>
					<div className="data" key={section_type + "-data"}>
						{columns}
					</div>
				</div>
			);
		}

		return (
			<div id="player-detail">
				<div className="header">
					<div className="job">
						<img src={"img/icons/jobs/" + job + ".png"} alt={job + " icon"}></img>
					</div>
					<div className="name">
						{PlayerProcessor.getDataValue("name", player)}
					</div>
				</div>
				{sections}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		detail_data : state.settings.detail_data,
		history     : state.internal.encounter_data_history,
		light_theme : state.settings.interface.light_theme
	};
};

export default connect(mapStateToProps)(PlayerDetail);