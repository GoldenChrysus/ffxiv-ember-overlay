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

	normalizeLocales(data, language) {
		if (!data.Encounter) {
			return data;
		}

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

		return data;
	}

	appendHistory(data, state) {
		if (!data.Encounter) {
			return;
		}

		const interval = 15;

		let current_history = state.internal.encounter_data_history;
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

		state.internal.encounter_data_history = current_history;
	}

	convertToLocaleFormat(key, value) {
		let fraction_rules   = Constants.PlayerMetricFractionRules[key];
		let minimum_fraction = (fraction_rules && fraction_rules.hasOwnProperty("min")) ? fraction_rules.min : 2;
		let maximum_fraction = (fraction_rules && fraction_rules.hasOwnProperty("max")) ? fraction_rules.max : 2;

		return (+value).toLocaleString(undefined, { minimumFractionDigits : minimum_fraction, maximumFractionDigits: maximum_fraction });
	}
}

export default new GameDataProcessor();