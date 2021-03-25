import store from "../redux/store";
import Constants from "../constants/index";
import LocalizationService from "./LocalizationService";
import UsageService from "./UsageService";

class TTSService {
	state = {
		top                : {},
		critical           : [],
		aggro              : [],
		combatants         : {},
		encounter          : false,
		valid_player_names : [],
		rules              : {}
	};
	queue = {
		critical  : {},
		top       : {},
		aggro     : {},
		encounter : []
	};

	start() {
		setInterval(
			this.processQueue.bind(this),
			1500
		);
	}

	updateRules(rules) {
		this.state.rules = rules;
	}

	updateCombatants(combatants, valid_player_names) {
		this.state.combatants         = combatants;
		this.state.valid_player_names = valid_player_names;
	}

	processLogLine(data, current_state) {
		if (!UsageService.usingLogTTS(current_state.settings_data)) {
			return;
		}

		data = data.line;

		let player_data = {};

		switch (+data[0]) {
			case 37:
				player_data.name       = data[3];
				player_data.hp_percent = (+data[5] / +data[6]) * 100;

				break;

			case 39:
				player_data.name       = data[3];
				player_data.hp_percent = (+data[4] / +data[5]) * 100;
				
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

		let job_data = Constants.GameJobs[this.state.combatants[player_data.name].Job.toUpperCase()];

		player_data.job_type = (job_data) ? job_data.role : false;

		if (!player_data.job_type) {
			return;
		}

		let critical_threshold = Math.max(
			this.state.rules.critical[player_data.job_type] ? this.state.rules.critical[player_data.job_type] : 0,
			this.state.rules.critical.all ? this.state.rules.critical.all : 0
		);

		if (
			critical_threshold &&
			player_data.hp_percent < critical_threshold &&
			this.state.critical.indexOf(player_data.name) === -1
		) {
			this.state.critical.push(player_data.name);

			this.queue.critical[player_data.name] = true;
		} else if (
			critical_threshold &&
			player_data.hp_percent >= critical_threshold &&
			this.state.critical.indexOf(player_data.name) !== -1
		) {
			this.state.critical.splice(this.state.critical.indexOf(player_data.name), 1);
		}
	}

	processRank(rank, type, current_state) {
		if (rank === 1 & !this.state.top[type]) {
			this.state.top[type] = true;

			let locale_data    = LocalizationService.getTTSTextData("top", current_state);
			let corrected_type = (type === "tps") ? "dtps" : type;

			this.queue.top[type] = locale_data.text.replace("{{metric}}", corrected_type.toUpperCase());
		} else if (rank !== 1 && this.state.top[type]) {
			this.state.top[type] = false;
		}
	}

	processAggro(data) {
		let mobs = [];

		for (let monster of data.AggroList) {
			if (monster.Target && monster.Target.isMe) {
				mobs.push(monster.Name);
			}
		}

		let old_mobs = this.aggro;

		this.aggro = mobs;

		for (let mob of this.aggro) {
			if (old_mobs.indexOf(mob) === -1) {
				this.queue.aggro[mob] = true;
			}
		}
	}

	processEncounter(game, current_state) {
		let active = ([true, "true"].indexOf(game.isActive) !== -1);

		if (active === this.state.encounter) {
			return false;
		}

		let type = (active) ? "start" : "end";

		this.state.encounter = active;

		if (UsageService.usingEncounterTTS(current_state.settings_data, type)) {
			let locale_data = LocalizationService.getTTSTextData("encounter", current_state);
			let title       = (game.Encounter) ? game.Encounter.title : locale_data.default_title;

			this.queue.encounter.push(
				locale_data
					.text
					.replace("{{encounter}}", title)
					.replace("{{verb}}", locale_data[type])
			);
		}
	}

	processQueue() {
		let messages = [];

		if (Object.keys(this.queue.critical).length) {
			let locale_data = LocalizationService.getTTSTextData("critical");
			let has_you     = (this.queue.critical.YOU);

			if (has_you) {
				delete this.queue.critical.YOU;

				this.queue.critical[locale_data.you] = true;
			}

			let keys      = Object.keys(this.queue.critical);
			let connector = (has_you || keys.length > 1) ? locale_data.plural : locale_data.singular;
			let players   = (keys.length <= 2)
				? keys.join(locale_data.joiner)
				: locale_data.several;

			messages.push(
				locale_data
					.text
					.replace("{{players}}", players)
					.replace("{{connector}}", connector)
			);

			this.queue.critical = {};
		}

		if (Object.keys(this.queue.top).length) {
			messages = messages.concat(Object.values(this.queue.top));

			this.queue.top = {};
		}

		if (Object.keys(this.queue.aggro).length) {
			let locale_data = LocalizationService.getTTSTextData("aggro");
			let monsters    = Object.keys(this.queue.aggro).join(locale_data.joiner);

			messages.push(locale_data.text.replace("{{monsters}}", monsters));

			this.queue.aggro = {};
		}

		if (this.queue.encounter.length) {
			messages = messages.concat(this.queue.encounter);

			this.queue.encounter = [];
		}

		if (messages.length) {
			store.getState().plugin_service.tts(messages);
		}
	}
}

export default new TTSService();