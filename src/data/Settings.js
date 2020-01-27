import store from "../redux/store/index";
import { updateState } from "../redux/actions/index";
import localForage from "localforage";
import mergeWith from "lodash.mergewith";

import ObjectService from "../services/ObjectService";

const default_settings = {
	intrinsic : {
		table_type      : "dps",
		collapsed       : false,
		current_version : null,
		last_version    : null,
		player_blur     : false
	},
	interface : {
		player_name           : "YOU",
		opacity               : 100,
		zoom                  : 100,
		top_right_rank        : false,
		blur_job_icons        : false,
		collapse_down         : false,
		light_theme           : false,
		footer_when_collapsed : false,
		footer_dps            : false,
		decimal_accuracy      : 2,
		shorten_thousands     : false,
		language              : "en",
		auto_hide             : false,
		auto_hide_delay       : 0
	},
	custom : {
		css          : "",
		metric_names : {}
	},
	table_settings : {
		general : {
			table : {
				short_names   : "no_short",
				footer_at_top : false,
				percent_bars  : false
			},
			raid  : {
				short_names  : "no_short",
				percent_bars : false
			}
		},
		dps     : {
			show_footer : true
		},
		heal    : {
			show_footer : true
		},
		tank    : {
			show_footer : true
		}
	},
	table_columns : {
		dps : [
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
			"enctps",
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
	sort_columns : {
		dps  : "damage",
		heal : "healed",
		tank : "damagetaken",
		raid : "damage"
	},
	detail_data : {
		dps : [
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
			"enctps",
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
					this.mergeSettings(data);
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

	saveSettings(force) {
		return new Promise((resolve, reject) => {
			if (!window.parser && !force) {
				resolve();
				return;
			}

			localForage.setItem("settings_cache", JSON.stringify(this.settings || default_settings))
				.then(() => {
					resolve();
				})
				.catch((e) => {
					reject();
				});
		});
	}

	mergeSettings(data) {
		let json                 = false;
		let tmp_default_settings = Object.assign({}, JSON.parse(JSON.stringify(default_settings)));

		try {
			json = JSON.parse(data);
		} catch (e) {}

		if (!json) {
			json = tmp_default_settings;
		} else {
			json = mergeWith(tmp_default_settings, json, function(obj_val, src_val) {
				if (Array.isArray(obj_val)) {
					return (src_val) ? src_val : obj_val;
				}
			});
		}

		this.settings = json;
	}

	importSettings(settings_key) {
		let data = atob(settings_key);

		this.mergeSettings(data);
		this.saveSettings(true)
			.then(() => {
				store.dispatch(
					updateState({
						key   : "settings",
						value : this.settings
					})
				);
			});
	}

	getSetting(key) {
		return (key.indexOf(".") !== -1) ? ObjectService.getByKeyPath(this.settings, key) : this.settings[key] || default_settings[key];
	}

	setSetting(key_path, value, skip_save) {
		ObjectService.setByKeyPath(this.settings, key_path, value);

		if (!skip_save) {
			this.saveSettings();
		}
	}
}

export default new Settings();