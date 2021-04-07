import store from "../redux/store/index";
import { updateState } from "../redux/actions/index";
import localForage from "localforage";
import mergeWith from "lodash.mergewith";

import ObjectService from "../services/ObjectService";
import StringHelper from "../helpers/StringHelper";

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
		theme                 : "dark",
		minimal_theme         : false,
		footer_when_collapsed : false,
		footer_dps            : false,
		hide_top_bar          : false,
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
	tts : {
		language : "en",
		rules    : {
			critical  : {
				tank : 0,
				heal : 0,
				dps  : 0,
				all  : 0
			},
			top       : {
				dps : false,
				hps : false,
				tps : false
			},
			aggro     : false,
			encounter : {
				start : false,
				end   : false
			}
		}
	},
	table_settings : {
		general : {
			table : {
				short_names      : "no_short",
				footer_at_top    : false,
				percent_bars     : true,
				prioritize_party : false
			},
			raid  : {
				short_names      : "no_short",
				percent_bars     : true,
				prioritize_party : false
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
			"ParryPct",
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
	},
	spells_mode : {
		spells            : [],
		effects           : [],
		reverse_effect    : false,
		reverse_skill     : false,
		warning_threshold : 0,
		spells_per_row    : 1,
		show_icon         : true,
		use_tts           : false,
		minimal_layout    : false,
		invert            : false
	}
};

class Settings {
	loadSettings() {
		return new Promise((resolve, reject) => {
			localForage.getItem("settings_cache")
				.then((data) => {
					let result = this.mergeSettings(data);

					store.dispatch(
						updateState({
							key   : "settings",
							value : this.settings
						})
					);
					resolve(result);
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
					this.saveToOverlayPlugin();
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
		let result               = {
			used_default : false
		};

		try {
			json = JSON.parse(data);
		} catch (e) {}

		if (!json) {
			json = tmp_default_settings;

			result.used_default = true;
		} else {
			json = mergeWith(tmp_default_settings, json, function(obj_val, src_val) {
				if (Array.isArray(obj_val)) {
					return (src_val) ? src_val : obj_val;
				}
			});
		}

		this.settings = json;

		return result;
	}

	importSettings(settings_key) {
		return new Promise((resolve, reject) => {
			let data = StringHelper.fromBinary(atob(settings_key));

			this.mergeSettings(data);
			this.saveSettings(true)
				.then(() => {
					store.dispatch(
						updateState({
							key   : "settings",
							value : this.settings
						})
					);
					resolve();
				});
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

	getExportKey() {
		return btoa(StringHelper.toBinary(JSON.stringify(this.settings)));
	}

	getOverlayPluginKey() {
		return `ember-settings-${process.env.REACT_APP_ENV}`;
	}

	saveToOverlayPlugin() {
		let service = store.getState().plugin_service;

		if (!service.plugin_service.isNgld() || service.is_websocket) {
			return false;
		}

		let key     = this.getOverlayPluginKey();
		let message = service.plugin_service.createMessage("saveData", key, this.getExportKey());

		service.callHandler(message);
	}

	restoreFromOverlayPlugin() {
		return new Promise((resolve, reject) => {
			let service = store.getState().plugin_service;

			if (!service.plugin_service.isNgld()) {
				resolve();
				return;
			}

			let key      = this.getOverlayPluginKey();
			let message  = service.plugin_service.createMessage("loadData", key);
			let callback = (data) => {
				if (data === null || (typeof data === "object" && !data.data)) {
					service.plugin_service.resetCallback();
					resolve();
					return;
				}

				data = JSON.parse((typeof data === "object") ? data.data || "{}" : data);

				if (data["$isNull"]) {
					service.plugin_service.resetCallback();
					reject();
					return;
				}

				if (!data.key || data.key !== key) {
					service.plugin_service.resetCallback();
					resolve();
					return;
				}

				if (!data.data) {
					service.plugin_service.resetCallback();
					reject();
					return;
				}

				this
					.importSettings(data.data)
					.then(() => {
						service.plugin_service.resetCallback();
						resolve();
					})
					.catch(() => {
						service.plugin_service.resetCallback();
						reject();
					});
			};

			service
				.plugin_service
				.callHandler(message, callback);
		});
	}

	restoreFromOverlayPluginIfNecessary(necessary) {
		return new Promise((resolve, reject) => {
			if (!necessary) {
				resolve();
				return;
			}

			this
				.restoreFromOverlayPlugin()
				.then(() => {
					resolve();
				});
		});
	}
}

export default new Settings();