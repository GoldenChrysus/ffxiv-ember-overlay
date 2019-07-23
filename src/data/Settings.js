import store from "../redux/store/index";
import { updateState } from "../redux/actions/index";
import localForage from "localforage";
import assign from "lodash.assign";

import ObjectService from "../services/ObjectService";

const default_settings = {
	intrinsic     : {
		viewing    : "tables",
		table_type : "dps",
		collapsed  : false,
	},
	custom        : {
		css : ""
	},
	table_settings : {
		dps  : {
			show_footer : true
		},
		heal : {
			show_footer : true
		},
		tank : {
			show_footer : true
		}
	},
	table_columns : {
		dps  : [
			"damage%",
			"encdps",
			"crithit%",
			"DirectHitPct",
			"CritDirectHitPct"
		],
		heal : [
			"healed%",
			"effective_heal_pct",
			"enchps",
			"effective_hps",
			"OverHealPct",
			"critheal%"
		],
		tank : [
			"damage_taken_pct",
			"damagetaken",
			"healstaken",
			"BlockPct",
			"deaths"
		],
		raid : {
			dps  : [
				"encdps",
				"enchps"
			],
			heal : [
				"enchps",
				"encdps"
			],
			tank : [
				"encdps",
				"enchps"
			]
		}
	},
	sum_columns     : {
		dps  : [
			"encdps"
		],
		heal : [
			"enchps"
		],
		tank : [
			"damagetaken",
			"healstaken",
			"deaths"
		]
	},
	sort_columns    : {
		dps  : "damage",
		heal : "healed",
		tank : "damagetaken",
		raid : "damage"
	},
	detail_data : {
		dps  : [
			"damage%",
			"encdps",
			"damage",
			"crithit%",
			"DirectHitPct",
			"CritDirectHitPct",
			"max_hit_format"
		],
		heal : [
			"healed%",
			"effective_heal_pct",
			"enchps",
			"effective_hps",
			"healed",
			"OverHealPct",
			"critheal%",
			"max_heal_format"
		],
		tank : [
			"damage_taken_pct",
			"damagetaken",
			"healstaken",
			"BlockPct",
			"deaths"
		]
	}
};

class Settings {
	loadSettings() {
		return new Promise((resolve, reject) => {
			localForage.getItem("settings_cache")
				.then((data) => {
					let json                 = false;
					let tmp_default_settings = Object.assign({}, default_settings);

					try {
						json = JSON.parse(data);
					} catch (e) {}

					if (!json) {
						json = tmp_default_settings;
					} else {
						json = assign(tmp_default_settings, json);
					}

					this.settings = json;

					store.dispatch(
						updateState({
							key   : "settings",
							value : this.settings
						})
					);

					resolve();
				})
				.catch((e) => {
					reject();
				});
		});
	}

	saveSettings() {
		return new Promise((resolve, reject) => {
			localForage.setItem("settings_cache", JSON.stringify(this.settings || default_settings))
				.then(() => {
					resolve();
				})
				.catch((e) => {
					reject();
				});
		});
	}

	getSetting(key) {
		return this.settings[key] || default_settings[key];
	}

	setSetting(key_path, value) {
		ObjectService.setByKeyPath(this.settings, key_path, value);
		this.saveSettings();
	}
}

export default new Settings();