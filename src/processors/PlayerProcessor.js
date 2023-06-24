import store from "../redux/store/index";

import Constants from "../constants/index";

import GameDataProcessor from "./GameDataProcessor";

class PlayerProcessor {
	getValidPlayerNames(current_state) {
		const state = current_state || store.getState();

		const valid_player_names = [
			"YOU",
			state.settings.interface.player_name,
		];

		if (state.settings.interface.player_name === "YOU") {
			valid_player_names.push(state.internal.character_name);
		}

		return valid_player_names;
	}

	getShortName(name, type) {
		name = (name || "").split(" ");

		const first_name = (["short_first", "short_both"].indexOf(type) !== -1) ? name[0].slice(0, 1) + "." : name[0];

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
		const key_function = Constants.PlayerDataCustomValues[key];
		let lang           = null;

		if (key_function) {
			state = state || store.getState();
			lang  = state.settings.interface.language;
		}

		let value = (key_function) ? key_function(player, players, encounter, lang) : player[key];

		if (key === "name") {
			state = state || store.getState();
			lang  = state.settings.interface.language;

			if (state.settings.interface.display_job_names) {
				const job = player.Job.toUpperCase();

				value = (Constants.GameJobs[job])
					? Constants.GameJobs[job]["Name_" + lang] || Constants.GameJobs[job].Name_en
					: "N/A";
			} else if (value === "YOU") {
				const setting_name = state.settings.interface.player_name;

				value = (setting_name && setting_name === "YOU") ? state.internal.character_name : setting_name;
			}
		}

		if (!return_sortable_value && !isNaN(value)) {
			value = GameDataProcessor.convertToLocaleFormat(key, value, state);
		} else if (return_sortable_value) {
			const number_regex = /((([\d]{1,3},)?(([\d]{3},)+)?[\d]{3})|[\d]+)(\.[\d]+)?(%|K)?$/;
			const matches      = String(value).match(number_regex);
			const match        = (matches && matches.length) ? matches[0] : 0;

			value = String(match).replace(/[%,]/g, "");

			if (value.indexOf("K") !== -1) {
				value = Number(value.replace("K", "")) * 1000;
			}

			value = Number(value);
		}

		return value;
	}

	sortPlayers(players, encounter, sort_column, current_state) {
		let sorted_players = [];
		const self         = this;

		for (const key in players) {
			sorted_players.push(players[key]);
		}

		const players_copy = JSON.parse(JSON.stringify(sorted_players));

		sorted_players = sorted_players.sort((a, b) => {
			const val_a = self.getDataValue(sort_column, a, players_copy, encounter, true, current_state);
			const val_b = self.getDataValue(sort_column, b, players_copy, encounter, true, current_state);

			if (val_a > val_b) {
				return -1;
			}

			if (val_b > val_a) {
				return 1;
			}

			if (a.Job && b.Job) {
				return self
					.getDataValue("name", a, undefined, undefined, undefined, current_state)
					.localeCompare(self.getDataValue("name", b, undefined, undefined, undefined, current_state));
			}

			if (!a.job) {
				return -1;
			}

			return 1;
		});

		return sorted_players;
	}
}

export default new PlayerProcessor();
