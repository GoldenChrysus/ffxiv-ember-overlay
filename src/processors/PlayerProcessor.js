import store from "../redux/store/index";

import Constants from "../constants/index";

class PlayerProcessor  {
	getDataValue(key, player, players) {
		let key_function = Constants.PlayerDataCustomValues[key];
		let value        = (key_function) ? key_function(player, players) : player[key];

		if (key === "name" && value === "YOU") {
			value = store.getState().internal.character_name;
		}

		if (!isNaN(value)) {
			value = (+value).toLocaleString(undefined, { minimumFractionDigits : 2, maximumFractionDigits: 2 });
		}

		return value;
	}

	sortPlayers(players, sort_column) {
		let sorted_players = [];
		let self           = this;

		for (let key in players) {
			sorted_players.push(players[key]);
		}

		sorted_players = sorted_players.sort(function(a, b) {
			let val_a = +a[sort_column].replace("%", "");
			let val_b = +b[sort_column].replace("%", "");

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
					return 1;
				} else {
					return -1;
				}
			}
		});

		return sorted_players;
	}
}

export default PlayerProcessor;