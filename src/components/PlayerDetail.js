import React from "react";
import { connect } from "react-redux";

import Constants from "../constants/index";
import PlayerProcessor from "../processors/PlayerProcessor";

class PlayerDetail extends React.Component {
	render() {
		let processor   = new PlayerProcessor();
		let player      = this.props.player;
		let players     = [];
		let job         = player.Job.toUpperCase() || "LMB";
		let detail_data = this.props.detail_data;
		let sections    = [];

		for (let i in this.props.players) {
			players.push(this.props.players[i]);
		}

		for (let section_type in detail_data) {
			let detail  = detail_data[section_type];
			let columns = [];

			for (let key of detail) {
				let title = Constants.PlayerDataTitles[key].long;
				let value = processor.getDataValue(key, player, players);

				columns.push(
					<div className="column">
						<div className="title">{title}</div>
						<div className="value">{value}</div>
					</div>
				);
			}

			sections.push(
				<div className="split"></div>
			);
			sections.push(
				<div className="section">
					<div className="title">{section_type}</div>
					<div className="data">
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
						{player.name}
					</div>
				</div>
				{sections}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		detail_data : state.settings.getSetting("detail_data")
	};
};

export default connect(mapStateToProps)(PlayerDetail);