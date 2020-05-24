import React from "react";
import { connect } from "react-redux";
import $ from "jquery";

import GameDataProcessor from "../../processors/GameDataProcessor";
import PlayerProcessor from "../../processors/PlayerProcessor";
import LocalizationService from "../../services/LocalizationService";
import Constants from "../../constants/index";

import Monster from "./AggroTable/Monster";
import OverlayInfo from "./PlayerTable/OverlayInfo";

class AggroTable extends React.Component {
	render() {
		let header      = [
			<div className="column" key="icon"></div>
		];
		let rows        = [];
		let player_blur = (this.props.player_blur);
		let short_names = this.props.table_settings.general.table.short_names;
		let columns     = [
			"Name",
			"health_percent",
			"CurrentHP",
			"player_Name"
		];
		let monsters    = (!this.props.encounter.Combatant) ? [] : this.props.monsters;

		for (let key of columns) {
			let title = LocalizationService.getMonsterDataTitle(key, "short");

			if (key === "player_Name") {
				header.push(
					<div className="column icon" key="job-icon"></div>
				);
			}

			header.push(
				<div className="column" key={key}>{title}</div>
			);
		}

		for (let monster of monsters) {
			monster._is_current = monster.Target.isMe;

			let blur = (player_blur && !monster._is_current);

			rows.push(
				<Monster key={monster.ID} monster={monster} columns={columns} blur={blur} icon_blur={this.props.icon_blur} short_names={short_names} encounter={this.props.encounter}/>
			);
		}

		let overlay_info = (this.props.monsters && this.props.monsters.length) ? "" : <OverlayInfo/>

		return (
			<React.Fragment>
				<div id="player-table" className="monster-table" ref="aggro_table">
					<div className="row header">
						{header}
					</div>
					{rows}
				</div>
				{overlay_info}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		encounter      : state.internal.game,
		player_blur    : state.settings.intrinsic.player_blur,
		icon_blur      : state.settings.interface.blur_job_icons,
		table_settings : state.settings.table_settings
	};
};

export default connect(mapStateToProps)(AggroTable);