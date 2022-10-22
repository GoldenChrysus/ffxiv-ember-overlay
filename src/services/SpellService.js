import clone from "lodash.clonedeep";
import store from "../redux/store";

import Constants from "../constants";
import SkillData from "../constants/SkillData";
import PVPZoneData from "../constants/PVPZoneData";

import LocalizationService from "./LocalizationService";
import TTSService from "./TTSService";

class SpellService {
	valid_names = {};
	spells = {};
	tts_log = {};
	settings = {};

	stop() {
		this.spells = {};
	}

	setSettings(use_tts, party_use_tts, tts_trigger, warning_threshold, tts_on_effect, party_tts_on_effect, party_tts_on_skill) {
		this.settings.use_tts = use_tts;
		this.settings.party_use_tts = party_use_tts;
		this.settings.tts_trigger = tts_trigger;
		this.settings.warning_threshold = warning_threshold;
		this.settings.tts_on_effect = tts_on_effect;
		this.settings.party_tts_on_effect = party_tts_on_effect;
		this.settings.party_tts_on_skill = party_tts_on_skill;
	}

	getSkillRecast(id, level) {
		const skill = SkillData.oGCDSkills[id];

		if (level && skill.level_recasts) {
			for (const level_data of skill.level_recasts) {
				if (level >= level_data.level) {
					return level_data.recast;
				}
			}
		}

		return skill.recast;
	}

	getSkillCharges(id, level) {
		const skill = SkillData.oGCDSkills[id];

		if (level && skill.level_charges) {
			for (const level_data of skill.level_charges) {
				if (level >= level_data.level) {
					return level_data.charges;
				}
			}
		}

		return skill.charges;
	}

	processSpells(used, lost, changed_default) {
		const current_level = store.getState().internal.character_level;

		for (const i in used) {
			const date        = used[i].time;
			const new_date    = new Date(date);
			let recast      = 0;
			let max_charges = 0;
			const type        = used[i].type;
			const defaulted   = (new_date.getFullYear() === 1970);

			if (!defaulted) {
				switch (type) {
					case "skill":
						recast = this.getSkillRecast(used[i].id, (used[i].party) ? 0 : current_level);
						max_charges = this.getSkillCharges(used[i].id, (used[i].party) ? 0 : current_level);

						break;

					case "effect":
						recast = used[i].duration;

						break;

					default:
						break;
				}

				new_date.setSeconds(date.getSeconds() + recast);
			}

			if (max_charges) {
				if (this.spells[i] && !this.spells[i].recharging && this.spells[i].charges && this.spells[i].charges < max_charges) {
					this.spells[i].charges -= 1;

					continue;
				}
			}

			this.spells[i] = {
				type          : used[i].type,
				subtype       : used[i].subtype,
				log_type      : used[i].log_type,
				id            : used[i].id,
				time          : new_date,
				name          : used[i].name,
				recast,
				charges       : (defaulted) ? used[i].max_charges : max_charges - 1,
				max_charges   : (defaulted) ? used[i].max_charges : max_charges,
				recharging    : false,
				remaining     : recast,
				cooldown      : Math.max(0, recast),
				dot           : (used[i].subtype === "dot"),
				debuff        : (used[i].subtype === "debuff"),
				party         : used[i].party,
				defaulted     : used[i].defaulted,
				type_position : used[i].type_position,
				tts           : false,
			};

			if (!defaulted && ["effect", "skill"].indexOf(this.spells[i].type) !== -1) {
				this.processProcTTS(i);
			}
		}

		for (const i in lost) {
			if (!this.spells[i]) {
				continue;
			}

			this.spells[i].remaining = 0;
			this.spells[i].cooldown = 0;

			this.processTTS(i);
		}

		for (const i in changed_default) {
			if (!this.spells[i]) {
				continue;
			}

			this.spells[i].defaulted = changed_default[i].defaulted;
			this.spells[i].type_position = changed_default[i].position;
		}
	}

	resetAllSpells() {
		this.spells = {};
	}

	resetSpell(i) {
		delete this.spells[i];
	}

	hasDefaultedSpell(key, spell) {
		if (!spell.defaulted) {
			return true;
		}

		return Boolean(this.spells[key]);
	}

	updateCooldowns() {
		const now       = new Date();
		let changed   = false;
		const threshold = (this.settings.tts_trigger === "zero") ? 0 : this.settings.warning_threshold;

		for (const i in this.spells) {
			if (this.spells[i].cooldown === 0) {
				continue;
			}

			changed = true;

			this.spells[i].remaining = (this.spells[i].time - now) / 1000;
			this.spells[i].cooldown = Math.max(0, this.spells[i].remaining);

			const tts_key = (this.spells[i].party) ? "party_use_tts" : "use_tts";

			if (this.settings[tts_key] && this.spells[i].remaining > -10000000 && (this.spells[i].remaining <= threshold || this.spells[i].debuff)) {
				this.processTTS(i, threshold);
			}

			if (this.spells[i].cooldown === 0 && this.spells[i].max_charges) {
				if (this.spells[i].charges < this.spells[i].max_charges) {
					this.spells[i].charges += 1;
				}

				if (this.spells[i].charges < this.spells[i].max_charges) {
					this.spells[i].time = now;
					this.spells[i].remaining = this.spells[i].recast;
					this.spells[i].cooldown = this.spells[i].remaining;
					this.spells[i].recharging = true;

					const tmp_used = {};

					tmp_used[i] = this.spells[i];

					this.processSpells(tmp_used);
				}
			}
		}

		return changed;
	}

	processTTS(key, threshold) {
		const tts_key = (this.spells[key].party) ? "party_use_tts" : "use_tts";

		if (!this.settings[tts_key] || this.spells[key].tts) {
			return;
		}

		if (this.spells[key].debuff) {
			if (this.spells[key].party && this.spells[key].remaining <= threshold) {
				return;
			}

			if (!this.spells[key].party && this.spells[key].remaining > threshold) {
				return;
			}
		}

		const log_key = `${this.spells[key].subtype}-${this.spells[key].id}`;
		const time    = (new Date()).getTime();

		if ((time - (this.tts_log[log_key] || 0)) <= 500) {
			this.tts_log[log_key] = time;

			return false;
		}

		this.spells[key].tts = true;

		this.tts_log[log_key] = time;

		TTSService.saySpell(key, this.spells[key].id, this.spells[key].type, this.spells[key].name);
	}

	processProcTTS(key) {
		if (["dot", "debuff"].indexOf(this.spells[key].subtype) !== -1) {
			return;
		}

		const tts_key = (this.spells[key].party) ? `party_tts_on_${this.spells[key].type}` : `tts_on_${this.spells[key].type}`;

		if (!this.settings[tts_key]) {
			return;
		}

		const extra = (this.spells[key].type === "skill") ? " used" : " received";

		TTSService.saySpell(key, this.spells[key].id, this.spells[key].type, this.spells[key].name, extra);
	}

	filterSpells(section, settings, builder) {
		const spells = clone(this.spells);

		for (const i in spells) {
			if (builder && section.types.indexOf(spells[i].log_type) === -1) {
				delete spells[i];

				continue;
			}

			if (spells[i].cooldown <= 0 && (!spells[i].defaulted || !settings[`always_${spells[i].subtype}`])) {
				delete spells[i];

				continue;
			}
		}

		return spells;
	}

	updateValidNames(state) {
		this.valid_names = {
			spells        : {},
			effects       : {},
			dots          : {},
			debuffs       : {},
			party_spells  : {},
			party_effects : {},
			party_dots    : {},
			party_debuffs : {},
		};

		for (const key in this.valid_names) {
			let type = key.split("_");

			type = (type.length === 1) ? type[0] : type[1];
			type = type.substring(0, type.length - 1);

			for (const id of state.settings.spells_mode[key]) {
				this.valid_names[key][LocalizationService.getSpellName(type, id, "en")] = true;
			}
		}
	}

	isValidName(key, name) {
		return (this.valid_names[key] && this.valid_names[key][name]);
	}

	isValidJob(type, id, job_abbreviation) {
		const job = Constants.GameJobs[job_abbreviation];

		if (!job) {
			return;
		}

		const role = job.role;
		let data = [];

		switch (type) {
			case "spell":
			case "skill":
				data = (SkillData.oGCDSkills[id]) ? SkillData.oGCDSkills[id].jobs : false;

				break;

			case "effect":
			case "dot":
			case "debuff":
				data = (SkillData.Effects[id]) ? SkillData.Effects[id].jobs : false;

				break;

			default:
				return false;
		}

		return (data) ? (data.indexOf(job_abbreviation) !== -1 || data.indexOf(role) !== -1) : false;
	}

	getKeyName(english_name) {
		return english_name.replace(/[^a-zA-Z\d]/g, "");
	}

	injectDefaults(state) {
		const job = state.internal.character_job;

		if (!job) {
			return state;
		}

		const data         = {
			skill  : state.settings.spells_mode.spells,
			effect : state.settings.spells_mode.effects,
			dot    : state.settings.spells_mode.dots,
			debuff : state.settings.spells_mode.debuffs,
		};
		const data_names   = [];
		const in_use_names = {};
		const is_pvp_zone  = (PVPZoneData.Zones.indexOf(state.internal.current_zone_id) !== -1);

		for (const type in data) {
			for (const id of data[type]) {
				data_names.push(type + "-" + this.getKeyName(LocalizationService.getSpellName(type, id, "en")));
			}
		}

		for (const i in state.internal.spells.in_use) {
			const item = state.internal.spells.in_use[i];

			if (!item.defaulted) {
				continue;
			}

			const name = item.subtype + "-" + this.getKeyName(LocalizationService.getSpellName(item.subtype, item.id, "en"));

			if (data_names.indexOf(name) === -1) {
				state.internal.spells.in_use[i].defaulted = false;
			} else {
				in_use_names[name] = i;
			}
		}

		for (const type in data) {
			if (!state.settings.spells_mode[`always_${type}`]) {
				continue;
			}

			let type_position = 0;

			for (const id of data[type]) {
				if (!this.isValidJob(type, id, job)) {
					continue;
				}

				if (type === "skill" && SkillData.oGCDSkills[id].pvp !== is_pvp_zone) {
					continue;
				}

				const english_name = this.getKeyName(LocalizationService.getSpellName(type, id, "en"));
				const name         = type + "-" + english_name;

				type_position++;

				if (in_use_names[name]) {
					state.internal.spells.in_use[in_use_names[name]].type_position = type_position;

					state.internal.spells.defaulted[name].position = type_position;
					continue;
				}

				const main_type   = (["dot", "debuff"].indexOf(type) !== -1) ? "effect" : type;
				const key         = (main_type === "effect") ? `${main_type}-${english_name}` : `${main_type}-${id}`;
				let max_charges = 0;

				if (main_type === "skill") {
					max_charges = this.getSkillCharges(id, state.internal.character_level);
				}

				state.internal.spells.defaulted[name] = {
					id,
					key,
					position : type_position,
				};
				state.internal.spells.in_use[key] = {
					type          : main_type,
					subtype       : type,
					id            : Number(id),
					time          : new Date("1970-01-01"),
					charges       : max_charges,
					max_charges,
					duration      : 0,
					stacks        : 0,
					log_type      : `you-${type}`,
					party         : false,
					defaulted     : true,
					type_position : state.internal.spells.defaulted[name].position,
				};
			}
		}
	}

	getDemoSpell() {
		const id = 16486;

		return {
			type          : "skill",
			subtype       : "skill",
			log_type      : "you-skill",
			id,
			time          : new Date(),
			name          : LocalizationService.getSpellName("skill", id),
			recast        : SkillData.oGCDSkills[id].recast,
			remaining     : 0,
			cooldown      : 0,
			stacks        : 0,
			dot           : SkillData.oGCDSkills[id].dot,
			debuff        : SkillData.oGCDSkills[id].debuff,
			party         : false,
			defaulted     : false,
			type_position : 0,
			tts           : false,
		};
	}
}

export default new SpellService();
