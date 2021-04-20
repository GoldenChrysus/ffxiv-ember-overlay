import clone from "lodash.clonedeep";

import SkillData from "../constants/SkillData";

import TTSService from "./TTSService";

class SpellService {
	spells   = {};
	tts_log  = {};
	settings = {};

	stop() {
		this.spells = {};
	}

	setSettings(use_tts, tts_trigger, warning_threshold) {
		this.settings.use_tts           = use_tts;
		this.settings.tts_trigger       = tts_trigger;
		this.settings.warning_threshold = warning_threshold;
	}

	processSpells(used, lost) {
		for (let i in used) {
			let date     = used[i].time;
			let new_date = new Date(date);
			let recast   = 0;
			let dot      = false;
			let type     = used[i].type;

			if (new_date.getFullYear() !== 1970) {
				switch (type) {
					case "skill":
						recast = SkillData.oGCDSkills[used[i].id].recast;

						break;

					case "effect":
						recast = used[i].duration;
						dot    = SkillData.Effects[used[i].id].dot;

						if (dot) {
							type = "dot";
						}

						break;

					default:
						break;
				}
				
				new_date.setSeconds(date.getSeconds() + recast);
			}

			this.spells[i] = {
				type      : used[i].type,
				subtype   : type,
				log_type  : used[i].log_type,
				id        : used[i].id,
				time      : new_date,
				name      : used[i].name,
				recast    : recast,
				remaining : recast,
				cooldown  : Math.max(0, recast),
				dot       : dot,
				party     : used[i].party,
				tts       : false
			};
		}

		for (let i in lost) {
			if (!this.spells[i]) {
				continue;
			}

			this.spells[i].remaining = 0;
			this.spells[i].cooldown  = 0;

			this.processTTS(i);
		}
	}

	updateCooldowns() {
		let now       = new Date();
		let changed   = false;
		let threshold = (this.settings.tts_trigger === "zero") ? 0 : this.settings.warning_threshold;

		for (let i in this.spells) {
			if (this.spells[i].cooldown === 0) {
				continue;
			}

			changed = true;

			this.spells[i].remaining = (this.spells[i].time - now) / 1000;
			this.spells[i].cooldown  = Math.max(0, this.spells[i].remaining);

			if (this.settings.use_tts && this.spells[i].remaining > -10000000 && this.spells[i].remaining <= threshold) {
				this.processTTS(i);
			}
		}

		return changed;
	}

	processTTS(key) {
		if (this.spells[key].tts) {
			return;
		}

		let log_key = `${this.spells[key].subtype}-${this.spells[key].id}`;
		let time    = (new Date()).getTime();

		if ((time - (this.tts_log[log_key] || 0)) <= 500) {
			this.tts_log[log_key] = time;

			return false;
		}

		this.spells[key].tts = true;

		this.tts_log[log_key] = time;

		TTSService.saySpell(key, this.spells[key].id, this.spells[key].type, this.spells[key].name);
	}

	filterSpells(section, settings, builder) {
		let spells = clone(this.spells);

		for (let i in spells) {
			if (builder && section.types.indexOf(spells[i].log_type) === -1) {
				delete spells[i];

				continue;
			}

			if (spells[i].cooldown <= 0 && !settings[`always_${spells[i].subtype}`]) {
				delete spells[i];

				continue;
			}
		}

		return spells;
	}
}

export default new SpellService();