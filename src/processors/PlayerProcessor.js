import store from "../redux/store/index";

import Constants from "../constants/index";

class PlayerProcessor  {
	getShortName(name) {
		name = name.split(" ");

		if (name.length === 1) {
			return name;
		}

		let first_initial = name[0].slice(0, 1);
		let last_name     = name.pop();

		return `${first_initial} ${last_name}`;
	}

	getDataValue(key, player, players, encounter, return_sortable_value) {
		console.log(encounter);
		let key_function = Constants.PlayerDataCustomValues[key];
		let value        = (key_function) ? key_function(player, players, encounter) : player[key];

		if (key === "name" && value === "YOU") {
			value = store.getState().internal.character_name;
		}

		if (!return_sortable_value && !isNaN(value)) {
			value = (+value).toLocaleString(undefined, { minimumFractionDigits : 2, maximumFractionDigits: 2 });
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