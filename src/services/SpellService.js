import clone from "lodash.clonedeep";

import SkillData from "../constants/SkillData";

import TTSService from "./TTSService";

class SpellService {
	spells   = {};
	settings = {};

	setSettings(use_tts, tts_trigger, warning_threshold) {
		this.settings.use_tts     = use_tts;
		this.settings.tts_trigger = tts_trigger;
		this.warning_threshold    = warning_threshold;
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

			this.processTTS(i);
		}

		this.processing = false;

		return this.spells;
	}

	updateCooldowns() {
		let now = new Date();

		for (let i in this.spells) {
			this.spells[i].remaining = (this.spells[i].time - now) / 1000;
			this.spells[i].cooldown  = Math.max(0, this.spells[i].remaining);

			this.processTTS(i);
		}

		return this.spells;
	}

	processTTS(key) {
		if (!this.settings.use_tts || this.spells[key].tts) {
			return false;
		}

		let threshold = (this.settings.tts_trigger === "zero") ? 0 : this.settings.warning_threshold * 1000;

		if (this.spells[key].remaining > -10000000 && this.spells[key].remaining <= threshold) {
			this.spells[key].tts = true;

			TTSService.saySpell(key, this.spells[key].id, this.spells[key].type, this.spells[key].name);
		}
	}

	filterSpells(spells, section, settings, builder) {
		spells = clone(spells);

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