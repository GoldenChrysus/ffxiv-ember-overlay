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

let GameJobs = {
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

let PlayerDataCustomValues = {
	"healed%"            : calculateHealed,
	"effective_heal_pct" : calculateEffectiveHealed,
	"effective_hps"      : calculateEffectiveHPS,
	"damage_taken_pct"   : calculateTankedDamagePercent,
	"max_heal_format"    : formatMaxHeal,
	"max_hit_format"     : formatMaxHit,
	"enctps"             : calculateTankPerSecond
};

let PlayerDataTitles = {
	"BlockPct"           : {
		en : {
			short : "Blk %",
			long  : "Block %"
		},
		pt : {
			short : "% Blq",
			long  : "% Bloqueio"
		},
		cn : {
			short : "格挡率",
			long  : "格挡百分比"
		},
		jp : {
			short : "ブロ率",
			long  : "ブロック発生確率"
		}
	},
	"CritDirectHitPct"   : {
		en : {
			short : "CDH %",
			long  : "Critical Direct Hit %"
		},
		pt : {
			short : "% ACCr",
			long  : "% Ataque Certeiro Crítico"
		},
		cn : {
			short : "直爆率",
			long  : "直击且暴击百分比"
		},
		jp : {
			short : "クリDH率",
			long  : "クリDH同時発生確率"
		}
	},
	"critheal%"          : {
		en : {
			short : "CH %",
			long  : "Critical Heal %"
		},
		pt : {
			short : "% CCr",
			long  : "% Cura Crítica"
		},
		cn : {
			short : "治疗暴击率",
			long  : "暴击治疗百分比"
		},
		jp : {
			short : "回復クリ率",
			long  : "回復のクリティカル発生確率"
		}
	},
	"crithit%"           : {
		en : {
			short : "CH %",
			long  : "Critical Hit %"
		},
		pt : {
			short : "% ACr",
			long  : "% Ataque Crítico"
		},
		cn : {
			short : "暴击率",
			long  : "暴击百分比"
		},
		jp : {
			short : "クリ率",
			long  : "クリティカル発生確率"
		}
	},
	"damage"             : {
		en : {
			short : "Dmg",
			long  : "Damage"
		},
		pt : {
			short : "Dano",
			long  : "Dano"
		},
		cn : {
			short : "伤害",
			long  : "伤害量"
		},
		jp : {
			short : "与ダメ",
			long  : "与ダメージ量"
		}
	},
	"damage%"            : {
		en : {
			short : "Dmg %",
			long  : "Damage %"
		},
		pt : {
			short : "% Dano",
			long  : "% Dano"
		},
		cn : {
			short : "伤害率",
			long  : "伤害百分比"
		},
		jp : {
			short : "与ダメ率",
			long  : "与ダメージ量比率"
		}
	},
	"damage_taken_pct"   : {
		en : {
			short : "Dmg %",
			long  : "Damage Taken %"
		},
		pt : {
			short : "% DR",
			long  : "% Dano Recebido"
		},
		cn : {
			short : "承伤率",
			long  : "承受伤害百分比"
		},
		jp : {
			short : "被ダメ率",
			long  : "被ダメージ量比率"
		}
	},
	"damagetaken"        : {
		en : {
			short : "Dmg",
			long  : "Damage Taken"
		},
		pt : {
			short : "DR",
			long  : "Dano Recebido"
		},
		cn : {
			short : "承伤",
			long  : "承受伤害量"
		},
		jp : {
			short : "被ダメ",
			long  : "被ダメージ量"
		}
	},
	"deaths"             : {
		en : {
			short : "Death",
			long  : "Deaths"
		},
		pt : {
			short : "Morte",
			long  : "Mortes"
		},
		cn : {
			short : "死亡数",
			long  : "死亡次数"
		},
		jp : {
			short : "死亡数",
			long  : "戦闘不能回数"
		}
	},
	"DirectHitPct"       : {
		en : {
			short : "DH %",
			long  : "Direct Hit %"
		},
		pt : {
			short : "% AC",
			long  : "% Ataque Certeiro"
		},
		cn : {
			short : "直击率",
			long  : "直击百分比"
		},
		jp : {
			short : "DH率",
			long  : "ダイレクト発生確率"
		}
	},
	"effective_heal_pct" : {
		en : {
			short : "Ef H %",
			long  : "Effective Heal %"
		},
		pt : {
			short : "% CE",
			long  : "% Cura Eficaz"
		},
		cn : {
			short : "秒疗比",
			long  : "有效治疗百分比"
		},
		jp : {
			short : "EH率",
			long  : "過剰ならない回復比率"
		}
	},
	"effective_hps"      : {
		en : {
			short : "Ef HPS",
			long  : "Effective Heal Per Second"
		},
		pt : {
			short : "CEPS",
			long  : "Cura Eficaz Por Segundo"
		},
		cn : {
			short : "秒有效疗",
			long  : "每秒有效治疗量"
		},
		jp : {
			short : "EHPS",
			long  : "毎秒過剰ならない回復量"
		}
	},
	"encdps"             : {
		en : {
			short : "DPS",
			long  : "Damage Per Second"
		},
		pt : {
			short : "DPS",
			long  : "Dano Por Segundo"
		},
		cn : {
			short : "DPS",
			long  : "每秒伤害量"
		},
		jp : {
			short : "DPS",
			long  : "毎秒与ダメージ量"
		}
	},
	"enchps"             : {
		en : {
			short : "HPS",
			long  : "Heal Per Second"
		},
		pt : {
			short : "CPS",
			long  : "Cura Por Segundo"
		},
		cn : {
			short : "HPS",
			long  : "每秒治疗量"
		},
		jp : {
			short : "HPS",
			long  : "毎秒回復量"
		}
	},
	"enctps"             : {
		en : {
			short : "DTPS",
			long  : "Damage Taken Per Second"
		},
		pt : {
			short : "DRPS",
			long  : "Dano Recebido Por Segundo"
		},
		cn : {
			short : "秒承伤",
			long  : "每秒承受伤害量"
		},
		jp : {
			short : "被DPS",
			long  : "毎秒被ダメージ量"
		}
	},
	"healed"             : {
		en : {
			short : "Heal",
			long  : "Total Heal"
		},
		pt : {
			short : "Cura",
			long  : "Cura Total"
		},
		cn : {
			short : "治疗量",
			long  : "总治疗量"
		},
		jp : {
			short : "回復量",
			long  : "総計回復量"
		}
	},
	"healed%"            : {
		en : {
			short : "Heal %",
			long  : "Heal %"
		},
		pt : {
			short : "% Cura",
			long  : "% Cura"
		},
		cn : {
			short : "治疗率",
			long  : "总治疗百分比"
		},
		jp : {
			short : "回復率",
			long  : "総計回復比率"
		}
	},
	"healstaken"         : {
		en : {
			short : "Heals",
			long  : "Heals Received"
		},
		pt : {
			short : "CR",
			long  : "Curas Recebidas"
		},
		cn : {
			short : "受疗量",
			long  : "受到治疗量"
		},
		jp : {
			short : "受回復",
			long  : "受けた回復量"
		}
	},
	"max_heal_format"    : {
		en : {
			short : "Mx Heal",
			long  : "Max Heal"
		},
		pt : {
			short : "Cura Mx",
			long  : "Cura Máxima"
		},
		cn : {
			short : "最大治疗",
			long  : "最大治疗"
		},
		jp : {
			short : "最大回復",
			long  : "最大回復"
		}
	},
	"max_hit_format"     : {
		en : {
			short : "Mx Hit",
			long  : "Max Hit"
		},
		pt : {
			short : "Atq Mx",
			long  : "Ataque Máximo"
		},
		cn : {
			short : "最强伤害",
			long  : "最强伤害"
		},
		jp : {
			short : "最大与ダメ",
			long  : "最大与ダメージ"
		}
	},
	"OverHealPct"        : {
		en : {
			short : "Ovr %",
			long  : "Overheal %"
		},
		pt : {
			short : "% Cura Ex",
			long  : "% Cura Excessiva"
		},
		cn : {
			short : "过量治疗率",
			long  : "过量治疗百分比"
		},
		jp : {
			short : "過剰回復率",
			long  : "過剰回復比率"
		}
	}
};

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
		"damage_taken_pct",
		"damagetaken",
		"deaths",
		"healstaken"
	]
};

export default {
	GameJobs,
	PlayerDataCustomValues,
	PlayerDataTitles,
	PlayerMetricTypeData
};