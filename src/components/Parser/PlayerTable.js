import React from "react";
import { connect } from "react-redux";
import { changeViewing, changeDetailPlayer } from "../../redux/actions/index";

import Player from "./PlayerTable/Player";
import Constants from "../../constants/index";
import PlayerProcessor from "../../processors/PlayerProcessor";

class PlayerTable extends React.Component {
	render() {
		let header           = [];
		let footer           = [];
		let rows             = [];
		let count            = 0;
		let rank             = 0;
		let found            = false;
		let table_type       = this.props.type;
		let collapsed        = this.props.collapsed;
		let player_processor = new PlayerProcessor();
		let sorted_players   = (this.props.players) ? player_processor.sortPlayers(this.props.players, this.props.sort_columns[table_type]) : [];

		if (table_type !== "raid") {
			for (let key of this.props.table_columns[table_type]) {
				let title = Constants.PlayerDataTitles[key].short;

				header.push(
					<div className="column" key={key}>{title}</div>
				);

				if (this.props.sum_columns[table_type].indexOf(key) !== -1) {
					footer.push(
						<div className="column" key={key}>{(+this.props.encounter[key] || 0).toLocaleString(undefined, { minimumFractionDigits : 2, maximumFractionDigits: 2 })}</div>
					);
				} else {
					footer.push(
						<div className="column" key={key}></div>
					);
				}
			}
		}

		for (let player of sorted_players) {
			if (player.Job === "" && player.name !== "Limit Break") {
				continue;
			}

			let is_current_player = false;

			if (!found) {
				rank++;
			}

			count++;

			if (player.name === "YOU") {
				found             = true;
				is_current_player = true;
			}

			if (collapsed && !is_current_player) {
				continue;
			}

			rows.push(
				<Player key={player.name} player={player} players={sorted_players} columns={this.props.table_columns[table_type]} type={this.props.type} onClick={this.changeViewing.bind(this, "player", player)}/>
			);
		}

		let header_row, footer_row, table_class;

		if (table_type !== "raid") {
			header_row = 
				<div className="row header">
					<div className="column"></div>
					<div className="column">Name</div>
					{header}
				</div>;
			footer_row =
				<div className="row footer">
					<div className="column"></div>
					<div className="column">{rank}/{count}</div>
					{footer}
				</div>;
		} else {
			table_class = "grid";
		}

		return (
			<div id="player-table" className={table_class}>
				{header_row}
				{rows}
				{footer_row}
			</div>
		);
	}

	changeViewing(type, player) {
		this.props.changeViewing(type);
		this.props.changeDetailPlayer(player);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeViewing      : (data) => {
			dispatch(changeViewing(data));
		},

		changeDetailPlayer : (data) => {
			dispatch(changeDetailPlayer(data));
		}
	}
};

const mapStateToProps = (state) => {
	return {
		table_columns : state.settings.table_columns,
		sort_columns  : state.settings.sort_columns,
		sum_columns   : state.settings.sum_columns,
		collapsed     : state.settings.intrinsic.collapsed
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerTable);