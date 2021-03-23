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

class PlayerTable extends React.Component {
	componentDidMount() {
		this.updateBackgrounds();
	}

	componentDidUpdate() {
		this.updateBackgrounds();
	}

	render() {
		let header         = [];
		let footer         = [];
		let rows           = [];
		let pet_rows       = [];
		let count          = 0;
		let rank           = 0;
		let found          = false;
		let table_type     = this.props.type;
		let is_raid        = (table_type === "raid");
		let player_blur    = (this.props.player_blur);
		let collapsed      = this.props.collapsed;
		let sort_column    = this.props.sort_columns[table_type];
		let sorted_players = (this.props.players) ? PlayerProcessor.sortPlayers(this.props.players, this.props.encounter, sort_column) : [];
		let short_names    = (is_raid) ? this.props.table_settings.general.raid.short_names : this.props.table_settings.general.table.short_names;
		let footer_at_top  = this.props.table_settings.general.table.footer_at_top;
		let percent_bars   = (is_raid) ? this.props.table_settings.general.raid.percent_bars : this.props.table_settings.general.table.percent_bars;
		let prioritize_pt  = (is_raid) ? this.props.table_settings.general.raid.prioritize_party : this.props.table_settings.general.table.prioritize_party;

		if (!is_raid) {
			for (let key of this.props.table_columns[table_type]) {
				let title = LocalizationService.getPlayerDataTitle(key, "short");

				header.push(
					<div className="column" key={key}>{title}</div>
				);

				if (Constants.PlayerMetricsSummable.indexOf(key) !== -1) {
					footer.push(
						<div className="column" key={key}>{GameDataProcessor.convertToLocaleFormat(key, +this.props.encounter[key] || 0)}</div>
					);
				} else {
					footer.push(
						<div className="column" key={key}></div>
					);
				}
			}
		}

		let max_value          = 0;
		let valid_player_names = PlayerProcessor.getValidPlayerNames();

		for (let player of sorted_players) {
			let pet_owner = null;

			player._name = player.name;
			player._skip = false;

			if (player.Job === "" && player.name !== "Limit Break") {
				let name    = player.name;
				let matches = name.match(/[^()]+\(([^()]+)\)/i);

				if (!matches || !matches.length || !matches[1]) {
					continue;
				}

				pet_owner = matches[1];

				player._is_pet = true;
				player._name   = pet_owner;
			}

			player._is_current = valid_player_names.includes(player._name);

			if (player._is_pet && !player._is_current && !this.props.players[player._name]) {
				player._skip = true;

				continue;
			}

			if (!found) {
				rank++;
			}

			if (player._is_current && !player._is_pet) {
				found = true;
			}

			count++;

			let sort_value = PlayerProcessor.getDataValue(sort_column, player, sorted_players, this.props.encounter, true);

			if (!max_value) {
				max_value = sort_value || 1;
			}

			let percent = ((sort_value / max_value) * 100).toFixed(2);

			player._percent = percent;

			if (collapsed && !player._is_current) {
				player._skip = true;
			}
		}

		let resorted_players = Array.from(sorted_players);

		if (prioritize_pt && this.props.party.length > 1) {
			resorted_players.sort((a, b) => {
				let party_has_a = (a._is_current || this.props.party.indexOf(a._name) !== -1);
				let party_has_b = (b._is_current || this.props.party.indexOf(b._name) !== -1);

				a._party = party_has_a;
				b._party = party_has_b;

				if (party_has_a && !party_has_b) {
					return -1;
				}

				if (party_has_b && !party_has_a) {
					return 1;
				}

				return 0;
			});
		}

		for (let player of resorted_players) {
			if (player._skip) {
				continue;
			}

			let blur       = (player_blur && !player._is_current);
			let player_obj = <Player key={player.name} percent={player._percent} percent_bars={percent_bars} player={player} players={sorted_players} encounter={this.props.encounter} columns={this.props.table_columns[table_type]} type={this.props.type} blur={blur} icon_blur={this.props.icon_blur} short_names={short_names} onClick={this.changeViewing.bind(this, "player", player)}/>

			if (player._is_pet) {
				pet_rows.push(player_obj);
			} else {
				rows.push(player_obj);
			}
		}

		let header_row, footer_row, table_class;

		let rank_text = (rank === 0) ? LocalizationService.getOverlayText("not_applicable") : `${rank}/${count}`;

		if (rank_text !== this.props.rank) {
			let rank_data = {
				key   : "internal.rank",
				value : rank_text
			};

			this.props.updateState(rank_data);
		}

		if (!is_raid) {
			header_row = 
				<div className="row header">
					<div className="column"></div>
					<div className="column">{LocalizationService.getOverlayText("player_name")}</div>
					{header}
				</div>;

			if (this.props.table_settings[table_type].show_footer) {
				footer_row =
					<div className="row footer">
						<div className="column"></div>
						<div className="column">{rank_text}</div>
						{footer}
					</div>;
			}
		} else {
			table_class = "grid";
		}

		let getFooterRow = (location) => {
			return ((footer_at_top && location === "top") || (!footer_at_top && location === "bottom")) ? footer_row : "";
		}
		let petRows      = () => {
			return (pet_rows.length)
				? <React.Fragment>
					<br></br>
					{pet_rows}
				</React.Fragment>
				: null;
		}

		let overlay_info = (collapsed || (this.props.encounter && Object.keys(this.props.encounter).length)) ? "" : <OverlayInfo/>

		return (
			<React.Fragment>
				<div id="player-table" className={table_class} ref="player_table">
					{header_row}
					{getFooterRow("top")}
					{rows}
					{getFooterRow("bottom")}
					{petRows()}
				</div>
				{overlay_info}
			</React.Fragment>
		);
	}

	changeViewing(type, player) {
		this.props.changeViewing(type);
		this.props.changeDetailPlayer(player);
	}

	updateBackgrounds() {
		let $table  = $(this.refs.player_table);
		let is_grid = $table.hasClass("grid");

		$table.find(".row").each(function() {
			let $row = $(this);
			let $bar = $row.find(".percent-bar");

			if (!$bar.length) {
				if ($row.hasClass("active-with-bar")) {
					$row.removeClass("active-with-bar");
				}

				return;
			}

			let height   = $row.outerHeight();
			let width    = $row.outerWidth();
			let position = $row.position();

			if (is_grid) {
				height--;
			}

			if ($row.hasClass("active")) {
				$row.addClass("active-with-bar");
			}

			$bar
				.css("top", position.top + "px")
				.css("left", position.left + "px")
				.css("width", "100%")
				.css("height", height + "px")
				.css("width", width + "px")
				.css("backgroundSize", $row.attr("data-percent") + "% 100%");
		});
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeViewing      : (data) => {
			dispatch(changeViewing(data));
		},

		changeDetailPlayer : (data) => {
			dispatch(changeDetailPlayer(data));
		},

		updateState        : (data) => {
			dispatch(updateState(data));
		}
	}
};

const mapStateToProps = (state) => {
	return {
		internal_name  : state.internal.character_name,
		language       : state.settings.interface.language,
		player_name    : state.settings.interface.player_name,
		icon_blur      : state.settings.interface.blur_job_icons,
		table_columns  : state.settings.table_columns,
		sort_columns   : state.settings.sort_columns,
		collapsed      : state.settings.intrinsic.collapsed,
		player_blur    : state.settings.intrinsic.player_blur,
		table_settings : state.settings.table_settings,
		rank           : state.internal.rank,
		party          : state.internal.party
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerTable);