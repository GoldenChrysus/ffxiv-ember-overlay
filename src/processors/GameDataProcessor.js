import store from "../redux/store/index";

import Constants from "../constants/index";
import PlayerProcessor from "./PlayerProcessor";

import LocalizationService from "../services/LocalizationService";

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

	normalizeLocales(data, language, current_state) {
		if (data.Encounter) {
			return this.normalizeGameData(data, language, current_state);
		}

		if (data.AggroList) {
			return this.normalizeAggroList(data);
		}

		return data;
	}

	normalizeGameData(data, language, current_state) {
		data.Encounter.name             = LocalizationService.getOverlayText("encounter", language);
		data.Encounter.Job              = "ENC";
		data.Encounter.OverHealPct      = "0%";
		data.Encounter.BlockPct         = "0%";
		data.Encounter.DirectHitPct     = "0%";
		data.Encounter.CritDirectHitPct = "0%";
		data.Encounter["damage%"]       = "100%";
		data.Encounter["healed%"]       = "100%";

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

		let can_calculate_max = (data.Encounter.DURATION >= 30);

		for (let player_name in data.Combatant) {
			data.Combatant[player_name].max_enc_dps = 0;

			if (can_calculate_max && (!current_state || !current_state.internal.game.Combatant || !current_state.internal.game.Combatant[player_name] || data.Combatant[player_name].encdps > current_state.internal.game.Combatant[player_name].max_enc_dps)) {
				data.Combatant[player_name].max_enc_dps = data.Combatant[player_name].encdps;
			} else if (current_state && current_state.internal.game.Combatant && current_state.internal.game.Combatant[player_name]) {
				data.Combatant[player_name].max_enc_dps = current_state.internal.game.Combatant[player_name].max_enc_dps;
			}
		}

		return data;
	}

	normalizeAggroList(data) {
		for (let key of ["CurrentHP", "MaxHP"]) {
			for (let i in data.AggroList) {
				if (data.AggroList[i][key] !== undefined) {
					data.AggroList[i][key] = this.normalizeFieldLocale(data.AggroList[i][key]);
				}
			}
		}

		return data.AggroList;
	}

	appendHistory(data, state) {
		if (!data.Encounter) {
			return;
		}

		const interval = 15;

		let current_history = state.internal.encounter_history[0].data_history;
		let recent_time     = Object.keys(current_history).slice(-1)[0];
		let current_time    = Math.round(new Date().getTime() / 1000);

		if (recent_time && (current_time - recent_time) < interval) {
			return;
		}

		let new_data  = {};
		let encounter = JSON.parse(JSON.stringify(data.Encounter));

		new_data["Encounter"] = {
			encdps : PlayerProcessor.getDataValue("encdps", encounter, undefined, undefined, true),
			enchps : PlayerProcessor.getDataValue("enchps", encounter, undefined, undefined, true),
			enctps : PlayerProcessor.getDataValue("enctps", encounter, undefined, encounter, true)
		};

		for (let player_name in data.Combatant) {
			let player = JSON.parse(JSON.stringify(data.Combatant[player_name]));

			new_data[player_name] = {
				encdps : PlayerProcessor.getDataValue("encdps", player, undefined, undefined, true),
				enchps : PlayerProcessor.getDataValue("enchps", player, undefined, undefined, true),
				enctps : PlayerProcessor.getDataValue("enctps", player, undefined, encounter, true)
			};
		}

		current_history[current_time] = new_data;

		state.internal.encounter_history[0].data_history = current_history;
	}

	processEnmity(data) {
		for (let i in data.Entries) {
			data.Entries[i].name = data.Entries[i].Name;
		}

		let sorted_players = PlayerProcessor.sortPlayers(data.Entries, undefined, "Enmity");
		let max_value      = 0;
		let players        = {};

		for (let player of sorted_players) {
			if (!max_value) {
				max_value = player.Enmity || 100;
			}

			let percent = ((player.Enmity / max_value) * 100).toFixed(2);

			players[player.Name] = percent;
		}

		return players;
	}

	injectEnmity(data, state) {
		for (let player_name in data.Combatant) {
			let real_player_name = player_name;

			if (player_name === "YOU") {
				player_name = PlayerProcessor.getDataValue("name", data.Combatant[player_name], undefined, undefined, undefined, state);
			}

			data.Combatant[real_player_name].enmity_percent = state.internal.enmity[player_name] || 0;
		}

		return data;
	}

	convertToLocaleFormat(key, value) {
		const state = store.getState();

		let accuracy          = state.settings.interface.decimal_accuracy;
		let shorten_thousands = state.settings.interface.shorten_thousands;
		let over_thousand     = false;
		let fraction_rules    = Constants.PlayerMetricFractionRules[key];
		let minimum_fraction  = (fraction_rules && fraction_rules.hasOwnProperty("min")) ? fraction_rules.min : accuracy;
		let maximum_fraction  = (fraction_rules && fraction_rules.hasOwnProperty("max")) ? fraction_rules.max : accuracy;
		
		value = +value;

		if (shorten_thousands && value >= 1000) {
			value         = +(value / 1000).toFixed(2);
			over_thousand = true;
		}

		value = value.toLocaleString(undefined, { minimumFractionDigits : minimum_fraction, maximumFractionDigits: maximum_fraction });

		if (over_thousand) {
			value += "K";
		}

		return value;
	}
}

export default new GameDataProcessor();