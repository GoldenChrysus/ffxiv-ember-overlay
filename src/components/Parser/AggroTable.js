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
		let header      = [];
		let rows        = [];
		let player_blur = (this.props.player_blur);
		let short_names = this.props.table_settings.general.table.short_names;

		for (let key of this.props.table_columns[table_type]) {
			let title = LocalizationService.getPlayerDataTitle(key, "short");

			header.push(
				<div className="column" key={key}>{title}</div>
			);
		}

		for (let monster of this.props.monsters) {
			let is_current_player = false;

			if (monster.Target.Name === "YOU" || monster.Target.Name === this.props.player_name) {
				is_current_player = true;

				monster._is_current = true;
			} else if (monster._is_current) {
				monster._is_current = false;
			}

			let blur = (player_blur && !is_current_player);

			rows.push(
				<Monster key={monster.ID} monster={monster} columns={this.props.table_columns[table_type]} blur={blur} short_names={short_names}/>
			);
		}

		let header_row, table_class;

		header_row = 
			<div className="row header">
				<div className="column">{LocalizationService.getOverlayText("player_name")}</div>
				{header}
			</div>;

		let overlay_info = (collapsed || (this.props.encounter && Object.keys(this.props.encounter).length)) ? "" : <OverlayInfo/>

		return (
			<React.Fragment>
				<div id="aggro-table" className={table_class} ref="aggro_table">
					{header_row}
					{rows}
				</div>
				{overlay_info}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		player_name    : state.settings.interface.player_name,
		table_columns  : state.settings.table_columns,
		sort_columns   : state.settings.sort_columns,
		collapsed      : state.settings.intrinsic.collapsed,
		player_blur    : state.settings.intrinsic.player_blur,
		table_settings : state.settings.table_settings,
		rank           : state.internal.rank
	};
};

export default connect(mapStateToProps)(AggroTable);