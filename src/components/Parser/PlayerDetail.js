import React from "react";
import { connect } from "react-redux";

import PlayerProcessor from "../../processors/PlayerProcessor";
import LocalizationService from "../../services/LocalizationService";
import HistoryChart from "./PlayerDetail/HistoryChart";

class PlayerDetail extends React.Component {
	render() {
		const player      = this.props.player;
		const players     = [];
		const job         = (!player.Job && player.name !== "Limit Break") ? "PET" : player.Job.toUpperCase() || "LMB";
		const detail_data = this.props.detail_data;
		const sections    = [
			<div className='split' key='chart-split'></div>,
			<HistoryChart player={player} history={this.props.history} theme={this.props.theme} key='chart'/>,
		];

		for (const i in this.props.players) {
			players.push(this.props.players[i]);
		}

		for (const section_type in detail_data) {
			const detail  = detail_data[section_type];
			const columns = [];

			for (const key of detail) {
				const title = LocalizationService.getPlayerDataTitle(key, "long");
				const value = PlayerProcessor.getDataValue(key, player, players, this.props.encounter);

				columns.push(
					<div className='column' key={key}>
						<div className='title' key={key + "-title"}>{title}</div>
						<div className='value' key={key + "-value"}>{value}</div>
					</div>,
				);
			}

			sections.push(
				<div className='split' key={section_type + "-split"}></div>,
			);
			sections.push(
				<div className='section' key={section_type}>
					<div className='title' key={section_type + "-title"}>{LocalizationService.getOverlayText(section_type)}</div>
					<div className='data' key={section_type + "-data"}>
						{columns}
					</div>
				</div>,
			);
		}

		return (
			<div id='player-detail'>
				<div className='header'>
					<div className='job'>
						<img src={"img/icons/jobs/" + job + ".png"} alt={job + " icon"}></img>
					</div>
					<div className='name'>
						{PlayerProcessor.getDataValue("name", player)}
					</div>
				</div>
				{sections}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	detail_data : state.settings.detail_data,
	history     : state.internal.data_history,
	theme       : state.settings.interface.theme,
});

export default connect(mapStateToProps)(PlayerDetail);
