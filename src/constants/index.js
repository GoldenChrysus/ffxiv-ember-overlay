let calculateHealed = function(player) {
	let value = player["healed%"];

	if (value === "--") {
		value = "0%";
	}

	return value;
}

let calculateEffectiveHealed = function(player, players) {
	let total_effective_heals  = 0;
	let player_effective_heals = 0;

	for (let tmp_player of players) {
		let ratio           = 1 - (+String(tmp_player.OverHealPct || 0).replace("%", "") / 100);
		let effective_heals = +tmp_player.healed * ratio;

		total_effective_heals += effective_heals;

		if (tmp_player.name === player.name) {
			player_effective_heals = effective_heals;
		}
	}

	let effective_ratio = (((total_effective_heals) ? (player_effective_heals / total_effective_heals) : 0) * 100).toFixed(0) + "%";

	return effective_ratio;
};

let calculateEffectiveHPS = function(player) {
	let ratio = 1 - (+String(player.OverHealPct || 0).replace("%", "") / 100);
	let hps   = +player.enchps * ratio;

	return hps;
};

let calculateTankedDamagePercent = function(player, players) {
	let total_damage_taken  = 0;
	let player_damage_taken = 0;

	for (let tmp_player of players) {
		total_damage_taken += +tmp_player.damagetaken;

		if (tmp_player.name === player.name) {
			player_damage_taken = +tmp_player.damagetaken;
		}
	}

	let effective_ratio = (((total_damage_taken) ? (player_damage_taken / total_damage_taken) : 0) * 100).toFixed(0) + "%";

	return effective_ratio;
};

let calculateTankPerSecond = function(player, players, encounter) {
	let duration = +encounter.DURATION || 1;

	return (+player.damagetaken / duration).toFixed(2);
}

let formatMaxHit = function(player) {
	if (!player["maxhit"]) {
		return "N/A";
	}

	let parts = player["maxhit"].split("-");
	let index = (parts[2]) ? 2 : 1;

	parts[index] = (!isNaN(parts[index])) ? (+parts[index]).toLocaleString() : parts[index];

	let value = parts.join(" - ");

	return value;
}

let formatMaxHeal = function(player) {
	if (!player["maxheal"]) {
		return "N/A";
	}

	let parts = player["maxheal"].split("-");
	let index = (parts[2]) ? 2 : 1;

	parts[index] = (!isNaN(parts[index])) ? (+parts[index]).toLocaleString() : parts[index];

	let value = parts.join(" - ");

	return value;
}

let calculateHealthPercent = function(unit) {
	return ((unit.CurrentHP / unit.MaxHP) * 100).toFixed(2);
}

const GameJobs = {
	ARC : {
		role : "dps"
	},
	GLA : {
		role : "tank"
	},
	LNC : {
		role : "dps"
	},
	MRD : {
		role : "tank"
	},
	PGL : {
		role : "dps"
	},
	ACN : {
		role : "dps"
	},
	CNJ : {
		role : "heal"
	},
	THM : {
		role : "dps"
	},
	ROG : {
		role : "dps"
	},
	BRD : {
		role : "dps"
	},
	DRG : {
		role : "dps"
	},
	MNK : {
		role : "dps"
	},
	PLD : {
		role : "tank"
	},
	WAR : {
		role : "tank"
	},
	BLM : {
		role : "dps"
	},
	WHM : {
		role : "heal"
	},
	SCH : {
		role : "heal"
	},
	SMN : {
		role : "dps"
	},
	NIN : {
		role : "dps"
	},
	AST : {
		role : "heal"
	},
	DRK : {
		role : "tank"
	},
	MCH : {
		role : "dps"
	},
	RDM : {
		role : "dps"
	},
	SAM : {
		role : "dps"
	},
	BLU : {
		role : "dps"
	},
	GNB : {
		role : "tank"
	},
	DNC : {
		role : "dps"
	},
};

const PlayerDataCustomValues = {
	"healed%"            : calculateHealed,
	"effective_heal_pct" : calculateEffectiveHealed,
	"effective_hps"      : calculateEffectiveHPS,
	"damage_taken_pct"   : calculateTankedDamagePercent,
	"max_heal_format"    : formatMaxHeal,
	"max_hit_format"     : formatMaxHit,
	"enctps"             : calculateTankPerSecond
};

const MonsterDataCustomDataValues = {
	"health_percent" : calculateHealthPercent
};

const PlayerDataTitles  = require("../data/locales/player-metrics.json");
const MonsterDataTitles = require("../data/locales/monster-metrics.json");

const PlayerMetricTypeData = {
	dps  : [
		"CritDirectHitPct",
		"crithit%",
		"damage",
		"damage%",
		"DirectHitPct",
		"encdps",
		"max_hit_format"
	],
	heal : [
		"critheal%",
		"effective_heal_pct",
		"effective_hps",
		"enchps",
		"healed",
		"healed%",
		"max_heal_format",
		"OverHealPct"
	],
	tank : [
		"BlockPct",
		"ParryPct",
		"damage_taken_pct",
		"damagetaken",
		"deaths",
		"healstaken"
	]
};

const PlayerMetricFractionRules = {
	deaths : {
		min : 0,
		max : 0
	}
}

const PlayerMetricsSummable = [
	"encdps",
	"enchps",
	"damagetaken",
	"healstaken",
	"deaths",
	"heals",
	"max_enc_dps"
];

export default {
	GameJobs,
	PlayerDataCustomValues,
	PlayerDataTitles,
	PlayerMetricTypeData,
	PlayerMetricFractionRules,
	PlayerMetricsSummable,
	MonsterDataCustomDataValues,
	MonsterDataTitles
};