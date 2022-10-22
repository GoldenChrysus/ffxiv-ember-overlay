import store from "../redux/store";
import Constants from "../constants/index";
import LocalizationService from "./LocalizationService";
import UsageService from "./UsageService";

class TTSService {
	timer = null;
	state = {
		top                : {},
		critical_hp        : [],
		critical_mp        : [],
		aggro              : [],
		combatants         : {},
		encounter          : false,
		valid_player_names : [],
		rules              : {},
	};

	queue = {
		critical_hp : {},
		critical_mp : {},
		top         : {},
		aggro       : {},
		encounter   : [],
	};

	last = {
		spells : {},
	};

	start() {
		this.timer = setInterval(
			this.processQueue.bind(this),
			1500,
		);
	}

	stop() {
		if (this.timer !== null) {
			clearInterval(this.timer);

			this.timer = null;
		}
	}

	updateRules(rules) {
		this.state.rules = rules;
	}

	updateCombatants(combatants, valid_player_names) {
		this.state.combatants = combatants;
		this.state.valid_player_names = valid_player_names;
	}

	processLogLine(data, current_state) {
		if (!UsageService.usingLogTTS(current_state.settings_data)) {
			return;
		}

		data = data.line;

		const player_data = {};

		switch (Number(data[0])) {
			case 37:
				player_data.name = data[3];
				player_data.hp_percent = (Number(data[5]) / Number(data[6])) * 100;
				player_data.mp_percent = (Number(data[7]) / Number(data[8])) * 100;

				break;

			case 39:
				player_data.name = data[3];
				player_data.hp_percent = (Number(data[4]) / Number(data[5])) * 100;
				player_data.mp_percent = (Number(data[6]) / Number(data[7])) * 100;

				break;

			default:
				return;
		}

		if (this.state.valid_player_names.includes(player_data.name)) {
			player_data.name = "YOU";
		}

		if (!this.state.combatants[player_data.name]) {
			return;
		}

		const job_data = Constants.GameJobs[this.state.combatants[player_data.name].Job.toUpperCase()];

		player_data.job_type = (job_data) ? job_data.role : false;

		if (!player_data.job_type) {
			return;
		}

		const critical_hp_threshold = Math.max(
			this.state.rules.critical_hp[player_data.job_type] ? this.state.rules.critical_hp[player_data.job_type] : 0,
			this.state.rules.critical_hp.all ? this.state.rules.critical_hp.all : 0,
		);

		if (
			critical_hp_threshold &&
			player_data.hp_percent < critical_hp_threshold &&
			this.state.critical_hp.indexOf(player_data.name) === -1
		) {
			this.state.critical_hp.push(player_data.name);

			this.queue.critical_hp[player_data.name] = true;
		} else if (
			critical_hp_threshold &&
			player_data.hp_percent >= critical_hp_threshold &&
			this.state.critical_hp.indexOf(player_data.name) !== -1
		) {
			this.state.critical_hp.splice(this.state.critical_hp.indexOf(player_data.name), 1);
		}

		const critical_mp_threshold = Math.max(
			this.state.rules.critical_mp[player_data.job_type] ? this.state.rules.critical_mp[player_data.job_type] : 0,
			this.state.rules.critical_mp.all ? this.state.rules.critical_mp.all : 0,
		);

		if (
			critical_mp_threshold &&
			player_data.mp_percent < critical_mp_threshold &&
			this.state.critical_mp.indexOf(player_data.name) === -1
		) {
			this.state.critical_mp.push(player_data.name);

			this.queue.critical_mp[player_data.name] = true;
		} else if (
			critical_mp_threshold &&
			player_data.mp_percent >= critical_mp_threshold &&
			this.state.critical_mp.indexOf(player_data.name) !== -1
		) {
			this.state.critical_mp.splice(this.state.critical_mp.indexOf(player_data.name), 1);
		}
	}

	processRank(rank, type, current_state) {
		if (rank === 1 && !this.state.top[type]) {
			this.state.top[type] = true;

			const locale_data    = LocalizationService.getTTSTextData("top", current_state);
			const corrected_type = (type === "tps") ? "dtps" : type;

			this.queue.top[type] = locale_data.text.replace("{{metric}}", corrected_type.toUpperCase());
		} else if (rank !== 1 && this.state.top[type]) {
			this.state.top[type] = false;
		}
	}

	processAggro(data) {
		const mobs = [];

		for (const monster of data) {
			if (monster.Target && monster.Target.isMe) {
				mobs.push(monster.Name);
			}
		}

		const old_mobs = this.state.aggro;

		this.state.aggro = mobs;

		for (const mob of this.state.aggro) {
			if (old_mobs.indexOf(mob) === -1) {
				this.queue.aggro[mob] = true;
			}
		}
	}

	processEncounter(game, current_state) {
		const active = ([true, "true"].indexOf(game.isActive) !== -1);

		if (active === this.state.encounter) {
			return false;
		}

		const type = (active) ? "start" : "end";

		this.state.encounter = active;

		if (UsageService.usingEncounterTTS(current_state.settings_data, type)) {
			const locale_data = LocalizationService.getTTSTextData("encounter", current_state);
			const title       = (game.Encounter) ? game.Encounter.title : locale_data.default_title;

			this.queue.encounter.push(
				locale_data
					.text
					.replace("{{encounter}}", title)
					.replace("{{verb}}", locale_data[type]),
			);
		}
	}

	sayNow(message) {
		store.getState().plugin_service.tts(message);
	}

	saySpell(key, id, type, name, extra) {
		const date = new Date();

		if (this.last.spells[key] && date.getTime() - this.last.spells[key].getTime() <= 500) {
			return;
		}

		this.last.spells[key] = date;

		extra = extra || "";

		this.sayNow((name || LocalizationService.getSpellName(type, id)) + extra);
	}

	processQueue() {
		let messages = [];

		if (Object.keys(this.queue.critical_hp).length) {
			const locale_data = LocalizationService.getTTSTextData("critical_hp");
			const has_you     = (this.queue.critical_hp.YOU);

			if (has_you) {
				delete this.queue.critical_hp.YOU;

				this.queue.critical_hp[locale_data.you] = true;
			}

			const keys      = Object.keys(this.queue.critical_hp);
			let connector = (has_you || keys.length > 1) ? locale_data.plural : locale_data.singular;
			const players   = (keys.length <= 2)
				? keys.join(locale_data.joiner)
				: locale_data.several;

			if (has_you && locale_data.you_no_connector && keys.length === 1) {
				connector = "";
			}

			messages.push(
				locale_data
					.text
					.replace("{{players}}", players)
					.replace("{{connector}}", connector),
			);

			this.queue.critical_hp = {};
		}

		if (Object.keys(this.queue.critical_mp).length) {
			const locale_data = LocalizationService.getTTSTextData("critical_mp");
			const has_you     = (this.queue.critical_mp.YOU);

			if (has_you) {
				delete this.queue.critical_mp.YOU;

				this.queue.critical_mp[locale_data.you] = true;
			}

			const keys      = Object.keys(this.queue.critical_mp);
			let connector = (has_you || keys.length > 1) ? locale_data.plural : locale_data.singular;
			const players   = (keys.length <= 2)
				? keys.join(locale_data.joiner)
				: locale_data.several;

			if (has_you && locale_data.you_no_connector && keys.length === 1) {
				connector = "";
			}

			messages.push(
				locale_data
					.text
					.replace("{{players}}", players)
					.replace("{{connector}}", connector),
			);

			this.queue.critical_mp = {};
		}

		if (Object.keys(this.queue.top).length) {
			messages = messages.concat(Object.values(this.queue.top));

			this.queue.top = {};
		}

		if (Object.keys(this.queue.aggro).length) {
			const locale_data = LocalizationService.getTTSTextData("aggro");
			const monsters    = Object.keys(this.queue.aggro).join(locale_data.joiner);

			messages.push(locale_data.text.replace("{{monsters}}", monsters));

			this.queue.aggro = {};
		}

		if (this.queue.encounter.length) {
			messages = messages.concat(this.queue.encounter);

			this.queue.encounter = [];
		}

		if (messages.length) {
			store.getState().plugin_service.tts(messages.join(" "));
		}
	}
}

export default new TTSService();
