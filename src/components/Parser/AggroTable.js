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
			"player_name",
			"CurrentHP"
		];

		for (let key of columns) {
			let title = LocalizationService.getMonsterDataTitle(key, "short");

			header.push(
				<div className="column" key={key}>{title}</div>
			);
		}

		for (let monster of this.props.monsters) {
			monster._is_current = monster.Target.isMe;

			let blur = (player_blur && !monster._is_current);

			rows.push(
				<Monster key={monster.ID} monster={monster} columns={columns} blur={blur} short_names={short_names}/>
			);
		}

		let overlay_info = (this.props.monsters && this.props.monsters.length) ? "" : <OverlayInfo/>

		return (
			<React.Fragment>
				<div id="player-table" ref="aggro_table">
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
		player_blur    : state.settings.intrinsic.player_blur,
		table_settings : state.settings.table_settings
	};
};

export default connect(mapStateToProps)(AggroTable);