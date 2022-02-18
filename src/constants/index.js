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

let formatMaxHit = function(player, players, encounter, only_number) {
	if (!player["maxhit"]) {
		return "N/A";
	}

	let parts = player["maxhit"].split("-");
	let index = (parts[2]) ? 2 : 1;

	parts[index] = (!isNaN(parts[index])) ? (+parts[index]).toLocaleString() : parts[index];

	if (only_number) {
		return parts[index];
	}

	parts.unshift(parts.pop());
	
	let value = parts.join(" - ");

	return value;
}

let formatNumericMaxHit = function(player) {
	return formatMaxHit(player, undefined, undefined, true);
}

let formatMaxHeal = function(player) {
	if (!player["maxheal"]) {
		return "N/A";
	}

	let parts = player["maxheal"].split("-");
	let index = (parts[2]) ? 2 : 1;

	parts[index] = (!isNaN(parts[index])) ? (+parts[index]).toLocaleString() : parts[index];

	parts.unshift(parts.pop());
	
	let value = parts.join(" - ");

	return value;
}

let calculateHealthPercent = function(unit) {
	return ((unit.CurrentHP / unit.MaxHP) * 100).toFixed(2);
}

let calculateShieldPerSecond = function(player, players, encounter) {
	let duration = +encounter.DURATION || 1;

	return (+player.damageShield / duration).toFixed(2);
}

const GameJobs = {
	ARC : {
		role    : "dps",
		Name_de : "Waldläufer",
		Name_en : "Archer",
		Name_fr : "Archer",
		Name_jp : "弓術士",
	},
	GLA : {
		role    : "tank",
		Name_de : "Gladiator",
		Name_en : "Gladiator",
		Name_fr : "Gladiateur",
		Name_jp : "剣術士",
	},
	LNC : {
		role    : "dps",
		Name_de : "Pikenier",
		Name_en : "Lancer",
		Name_fr : "Maître d'hast",
		Name_jp : "槍術士",
	},
	MRD : {
		role    : "tank",
		Name_de : "Marodeur",
		Name_en : "Marauder",
		Name_fr : "Maraudeur",
		Name_jp : "斧術士",
	},
	PGL : {
		role    : "dps",
		Name_de : "Faustkämpfer",
		Name_en : "Pugilist",
		Name_fr : "Pugiliste",
		Name_jp : "格闘士",
	},
	ACN : {
		role    : "dps",
		Name_de : "Hermetiker",
		Name_en : "Arcanist",
		Name_fr : "Arcaniste",
		Name_jp : "巴術士",
	},
	CNJ : {
		role    : "heal",
		Name_de : "Druide",
		Name_en : "Conjurer",
		Name_fr : "Élémentaliste",
		Name_jp : "幻術士",
	},
	THM : {
		role    : "dps",
		Name_de : "Thaumaturg",
		Name_en : "Thaumaturge",
		Name_fr : "Occultiste",
		Name_jp : "呪術士",
	},
	ROG : {
		role    : "dps",
		Name_de : "Schurke",
		Name_en : "Rogue",
		Name_fr : "Surineur",
		Name_jp : "双剣士",
	},
	BRD : {
		role    : "dps",
		Name_de : "Barde",
		Name_en : "Bard",
		Name_fr : "Barde",
		Name_jp : "吟遊詩人",
	},
	DRG : {
		role    : "dps",
		Name_de : "Dragoon",
		Name_en : "Dragoon",
		Name_fr : "Chevalier Dragon",
		Name_jp : "竜騎士",
	},
	MNK : {
		role    : "dps",
		Name_de : "Mönch",
		Name_en : "Monk",
		Name_fr : "Moine",
		Name_jp : "モンク",
	},
	PLD : {
		role    : "tank",
		Name_de : "Paladin",
		Name_en : "Paladin",
		Name_fr : "Paladin",
		Name_jp : "ナイト",
	},
	WAR : {
		role    : "tank",
		Name_de : "Krieger",
		Name_en : "Warrior",
		Name_fr : "Guerrier",
		Name_jp : "戦士",
	},
	BLM : {
		role    : "dps",
		Name_de : "Schwarzmagier",
		Name_en : "Black Mage",
		Name_fr : "Mage Noir",
		Name_jp : "黒魔道士",
	},
	WHM : {
		role    : "heal",
		Name_de : "Weißmagier",
		Name_en : "White Mage",
		Name_fr : "Mage Blanc",
		Name_jp : "白魔道士",
	},
	SCH : {
		role    : "heal",
		Name_de : "Gelehrter",
		Name_en : "Scholar",
		Name_fr : "Érudit",
		Name_jp : "学者",
	},
	SMN : {
		role    : "dps",
		Name_de : "Beschwörer",
		Name_en : "Summoner",
		Name_fr : "Invocateur",
		Name_jp : "召喚士",
	},
	NIN : {
		role    : "dps",
		Name_de : "Ninja",
		Name_en : "Ninja",
		Name_fr : "Ninja",
		Name_jp : "忍者",
	},
	AST : {
		role : "heal",
		Name_de : "Astrologe",
		Name_en : "Astrologian",
		Name_fr : "Astromancien",
		Name_jp : "占星術師",
	},
	DRK : {
		role    : "tank",
		Name_de : "Dunkelritter",
		Name_en : "Dark Knight",
		Name_fr : "Chevalier Noir",
		Name_jp : "暗黒騎士",
	},
	MCH : {
		role    : "dps",
		Name_de : "Maschinist",
		Name_en : "Machinist",
		Name_fr : "Machiniste",
		Name_jp : "機工士",
	},
	RDM : {
		role    : "dps",
		Name_de : "Rotmagier",
		Name_en : "Red Mage",
		Name_fr : "Mage Rouge",
		Name_jp : "赤魔道士",
	},
	SAM : {
		role    : "dps",
		Name_de : "Samurai",
		Name_en : "Samurai",
		Name_fr : "Samouraï",
		Name_jp : "侍",
	},
	BLU : {
		role    : "dps",
		Name_de : "Blaumagier",
		Name_en : "Blue Mage",
		Name_fr : "Mage Bleu",
		Name_jp : "青魔道士",
	},
	GNB : {
		role    : "tank",
		Name_de : "Revolverklinge",
		Name_en : "Gunbreaker",
		Name_fr : "Pistosabreur",
		Name_jp : "ガンブレイカー",
	},
	DNC : {
		role    : "dps",
		Name_de : "Tänzer",
		Name_en : "Dancer",
		Name_fr : "Danseur",
		Name_jp : "踊り子",
	},
	RPR : {
		role    : "dps",
		Name_de : "Reaper",
		Name_en : "Reaper",
		Name_fr : "Reaper",
		Name_jp : "リーパー",
	},
	SGE : {
		role    : "heal",
		Name_de : "Sage",
		Name_en : "Sage",
		Name_fr : "Sage",
		Name_jp : "賢者",
	},
};

const GameJobsID = require("../data/game/jobs.json");

const PlayerDataCustomValues = {
	"healed%"            : calculateHealed,
	"effective_heal_pct" : calculateEffectiveHealed,
	"effective_hps"      : calculateEffectiveHPS,
	"damage_taken_pct"   : calculateTankedDamagePercent,
	"max_heal_format"    : formatMaxHeal,
	"max_hit_format"     : formatMaxHit,
	"max_hit_numeric"    : formatNumericMaxHit,
	"enctps"             : calculateTankPerSecond,
	"shield_per_second"  : calculateShieldPerSecond
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
		"max_hit_format",
		"max_hit_numeric"
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
	"heals"
];

const TTSRules = [
	"critical_hp.tank",
	"critical_hp.dps",
	"critical_hp.heal",
	"critical_hp.all",
	"critical_mp.tank",
	"critical_mp.dps",
	"critical_mp.heal",
	"critical_mp.all",
	"aggro",
	"top.dps",
	"top.hps",
	"top.tps",
	"encounter.start",
	"encounter.end"
];

export default {
	GameJobs,
	GameJobsID,
	PlayerDataCustomValues,
	PlayerDataTitles,
	PlayerMetricTypeData,
	PlayerMetricFractionRules,
	PlayerMetricsSummable,
	MonsterDataCustomDataValues,
	MonsterDataTitles,
	TTSRules
};