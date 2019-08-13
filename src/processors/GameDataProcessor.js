import Constants from "../constants/index";
import PlayerProcessor from "./PlayerProcessor";

class GameDataProcessor  {
	normalizeFieldLocale(value) {
		let foreign_number_regex = /[\d]+,[\d]{2}(%|K)?$/;
		let matches              = String(value).match(foreign_number_regex);
		let match                = (matches && matches.length) ? matches[0] : false;

		if (match === false) {
			return value;
		}

		return value.replace(match, String(match).replace(",", "."));
	}

	normalizeLocales(data) {
		if (!data.Encounter) {
			return data;
		}

		for (let key in Constants.PlayerDataTitles) {
			if (data.Encounter[key] !== undefined) {
				data.Encounter[key] = this.normalizeFieldLocale(data.Encounter[key]);
			}

			for (let player_name in data.Combatant) {
				if (data.Combatant[player_name][key] !== undefined) {
					data.Combatant[player_name][key] = this.normalizeFieldLocale(data.Combatant[player_name][key]);
				}
			}
		}

		return data;
	}

	appendHistory(data, state) {
		if (!data.Encounter) {
			return;
		}

		const interval = 15;

		let current_history = state.encounter_history;
		let recent_time     = Object.keys(current_history).slice(-1)[0];
		let current_time    = Math.round(new Date().getTime() / 1000);

		if (recent_time && (current_time - recent_time) < interval) {
			return;
		}

		let new_data = {};

		new_data["Encounter"] = {
			encdps : PlayerProcessor.getDataValue("encdps", data.Encounter, undefined, true),
			enchps : PlayerProcessor.getDataValue("enchps", data.Encounter, undefined, true)
		};

		for (let player_name in data.Combatant) {
			let player = data.Combatant[player_name];

			new_data[player_name] = {
				encdps : PlayerProcessor.getDataValue("encdps", player, undefined, true),
				enchps : PlayerProcessor.getDataValue("enchps", player, undefined, true)
			};
		}

		current_history[current_time] = new_data;

		state.internal.encounter_data_history = current_history;
	}
}

export default new GameDataProcessor();