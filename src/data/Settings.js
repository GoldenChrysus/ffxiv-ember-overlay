const default_settings = {
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
	constructor(settings) {
		this.settings = settings || default_settings;
	}

	getSetting(key) {
		return this.settings[key] || default_settings[key];
	}

	setSetting(key, value) {
		this.settings[key] = value;
	}
}

export default Settings;