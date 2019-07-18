import React from "react";
import { connect } from "react-redux";
import { changeViewing, changeDetailPlayer } from "../redux/actions/index";

import Player from "./PlayerTable/Player";
import Constants from "../constants/index";

class PlayerTable extends React.Component {
	render() {
		let header     = [];
		let footer     = [];
		let rows       = [];
		let count      = 0;
		let rank       = 0;
		let found      = false;
		let table_type = this.props.type;
		let collapsed  = this.props.collapsed;

		for (let key of this.props.table_columns[table_type]) {
			let title = Constants.PlayerDataTitles[key].short;

			header.push(
				<div className="column">{title}</div>
			);

			if (this.props.sum_columns[table_type].indexOf(key) !== -1) {
				footer.push(
					<div className="column">{(+this.props.encounter[key] || 0).toLocaleString()}</div>
				);
			} else {
				footer.push(
					<div className="column"></div>
				);
			}
		}

		if (this.props.players) {
			let sorted_players = [];

			for (let key in this.props.players) {
				sorted_players.push(this.props.players[key]);
			}

			let sort_column = this.props.sort_columns[table_type];

			sorted_players = sorted_players.sort(function(a, b) {
				let val_a = +a[sort_column].replace("%", "");
				let val_b = +b[sort_column].replace("%", "");

				if (val_a > val_b) {
					return -1
				} else if (val_b > val_a) {
					return 1;
				} else {
					if (a.Job && b.Job) {
						return (a.name > b.name) ? 1 : -1;
					} else if (!a.job) {
						return 1;
					} else {
						return -1;
					}
				}
			});

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
					<Player player={player} players={sorted_players} columns={this.props.table_columns[table_type]} onClick={this.changeViewing.bind(this, "player", player)}/>
				);
			}
		}

		return (
			<div id="player-table">
				<div className="row header">
					<div className="column"></div>
					<div className="column">Name</div>
					{header}
				</div>
				{rows}
				<div className="row footer">
					<div className="column"></div>
					<div className="column">{rank}/{count}</div>
					{footer}
				</div>
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
		table_columns : state.settings.getSetting("table_columns"),
		sort_columns  : state.settings.getSetting("sort_columns"),
		sum_columns   : state.settings.getSetting("sum_columns"),
		collapsed     : state.collapsed
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerTable);