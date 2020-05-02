import React from "react";
import { connect } from "react-redux";
import $ from "jquery";
import { changeViewing, changeDetailPlayer, updateState } from "../../redux/actions/index";

import GameDataProcessor from "../../processors/GameDataProcessor";
import PlayerProcessor from "../../processors/PlayerProcessor";
import LocalizationService from "../../services/LocalizationService";
import Constants from "../../constants/index";

import Player from "./PlayerTable/Player";
import OverlayInfo from "./PlayerTable/OverlayInfo";

class AggroTable extends React.Component {
	render() {
		let header         = [];
		let rows           = [];
		let player_blur    = (this.props.player_blur);
		let sort_column    = this.props.sort_columns[table_type];
		let sorted_players = (this.props.players) ? PlayerProcessor.sortPlayers(this.props.players, this.props.encounter, sort_column) : [];
		let short_names    = this.props.table_settings.general.table.short_names;
		let percent_bars   = this.props.table_settings.general.table.percent_bars;

		for (let key of this.props.table_columns[table_type]) {
			let title = LocalizationService.getPlayerDataTitle(key, "short");

			header.push(
				<div className="column" key={key}>{title}</div>
			);
		}

		for (let player of sorted_players) {
			let is_current_player = false;

			if (player.name === "YOU" || player.name === this.props.player_name) {
				found             = true;
				is_current_player = true;

				player._is_current = true;
			} else if (player._is_current) {
				player._is_current = false;
			}

			let blur = (player_blur && !is_current_player);

			rows.push(
				<Player key={player.name} percent={percent} percent_bars={percent_bars} player={player} players={sorted_players} encounter={this.props.encounter} columns={this.props.table_columns[table_type]} type={this.props.type} blur={blur} icon_blur={this.props.icon_blur} short_names={short_names} onClick={this.changeViewing.bind(this, "player", player)}/>
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

const mapDispatchToProps = (dispatch) => {
	return {
		updateState        : (data) => {
			dispatch(updateState(data));
		}
	}
};

const mapStateToProps = (state) => {
	return {
		player_name    : state.settings.interface.player_name,
		icon_blur      : state.settings.interface.blur_job_icons,
		table_columns  : state.settings.table_columns,
		sort_columns   : state.settings.sort_columns,
		collapsed      : state.settings.intrinsic.collapsed,
		player_blur    : state.settings.intrinsic.player_blur,
		table_settings : state.settings.table_settings,
		rank           : state.internal.rank
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AggroTable);