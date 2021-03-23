import store from "../redux/store/index";

import Constants from "../constants/index";

import GameDataProcessor from "./GameDataProcessor";

class PlayerProcessor  {
	getValidPlayerNames() {
		let state = store.getState();

		let valid_player_names = [
			"YOU",
			state.settings.interface.player_name
		];

		if (state.settings.interface.player_name === "YOU") {
			valid_player_names.push(state.internal.character_name);
		}

		return valid_player_names;
	}

	getShortName(name, type) {
		name = (name || "").split(" ");

		let first_name = (["short_first", "short_both"].indexOf(type) !== -1) ? name[0].slice(0, 1) + "." : name[0];

		if (name.length === 1) {
			return first_name;
		}

		let last_name = name.pop();

		if ((["short_last", "short_both"].indexOf(type) !== -1)) {
			last_name = last_name.slice(0, 1) + ".";
		}

		return `${first_name} ${last_name}`;
	}

	getDataValue(key, player, players, encounter, return_sortable_value, state) {
		let key_function = Constants.PlayerDataCustomValues[key];
		let value        = (key_function) ? key_function(player, players, encounter) : player[key];

		if (key === "name" && value === "YOU") {
			state = state || store.getState();

			let setting_name = state.settings.interface.player_name;

			value = (setting_name && setting_name === "YOU") ? state.internal.character_name : setting_name;
		}

		if (!return_sortable_value && !isNaN(value)) {
			value = GameDataProcessor.convertToLocaleFormat(key, value);
		} else if (return_sortable_value) {
			let number_regex = /((([\d]{1,3},)?(([\d]{3},)+)?[\d]{3})|[\d]+)(\.[\d]+)?(%|K)?$/;
			let matches      = String(value).match(number_regex);
			let match        = (matches && matches.length) ? matches[0] : 0;

			value = String(match).replace(/[%,]/g, "");

			if (value.indexOf("K") !== -1) {
				value = +value.replace("K", "") * 1000;
			}

			value = +value;
		}

		return value;
	}

	sortPlayers(players, encounter, sort_column) {
		let sorted_players = [];
		let self           = this;

		for (let key in players) {
			sorted_players.push(players[key]);
		}

		let players_copy = JSON.parse(JSON.stringify(sorted_players));

		sorted_players = sorted_players.sort(function(a, b) {
			let val_a = self.getDataValue(sort_column, a, players_copy, encounter, true)
			let val_b = self.getDataValue(sort_column, b, players_copy, encounter, true);

			if (val_a > val_b) {
				return -1
			} else if (val_b > val_a) {
				return 1;
			} else {
				if (a.Job && b.Job) {
					return self
						.getDataValue("name", a)
						.localeCompare(self.getDataValue("name", b));
				} else if (!a.job) {
					return -1;
				} else {
					return 1;
				}
			}
		});

		return sorted_players;
	}
}

export default new PlayerProcessor();