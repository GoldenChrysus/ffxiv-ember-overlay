import store from "../redux/store";
import GameJobs from "../constants/index";

class TTSService {
	state = {
		top        : {},
		critical   : [],
		aggro      : [],
		combatants : {},
		rules      : {}
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

	updateRules() {
		this.state.rules = store.getState.settings_data.getSetting("tts");
	}

	updateCombatants(combatants) {
		this.state.combatants = combatants;
	}

	processLogLine(data) {
		let player_data = {};

		switch (data[0]) {
			case 38:
				player_data.name       = data[3];
				player_data.hp_percent = (data[5] / data[6]) * 100;

				break;

			case 39:
				player_data.name       = data[3];
				player_data.hp_percent = (data[4] / data[5]) * 100;
				
				break;

			default:
				return;
		}

		if (!this.state.combatants[player_data.name]) {
			return;
		}

		player_data.job_type = GameJobs[this.state.combatants[player_data.name].Job];

		if (!player_data.job_type) {
			return;
		}

		if (player_data.hp_percent < this.state.critical[player_data.job_type] && !this.state.critical.includes(player_data.name)) {
			this.state.critical.push(player_data.name);

			this.queue.critical[player_data.name] = true;
		} else if (player_data.hp_percent > this.state.critical[player_data.job_type] && this.state.critical.includes(player_data.name)) {
			this.state.critical.splice(this.state.critical.indexOf(player_data.name), 1);
		}
	}

	processRank(rank, type) {
		if (rank === 1 & !this.state.top[type]) {
			this.state.top[type] = true;

			this.queue.top.dps = `You are top ${type}.`;
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
			if (!old_mobs.includes(mob)) {
				this.queue.aggro[mob] = true;
			}
		}
	}

	processEncounter(encounter, type) {
		this.queue.encounter.push(`${encounter} has ${type}ed.`);
	}

	processQueue() {
		let messages = [];

		if (Object.keys(this.queue.critical).length) {
			let keys      = Object.keys(this.queue.critical);
			let players   = (keys <= 2)
				? keys.join(" and ")
				: "Several players";
			let connector = (keys.length > 1) ? "are" : "is";

			messages.push(`${players} ${connector} critical health.`);

			this.queue.critical = {};
		}

		if (Object.keys(this.queue.top).length) {
			messages = messages.concat(Object.values(this.queue.top));

			this.queue.top = {};
		}

		if (Object.keys(this.queue.aggro).length) {
			let monsters = Object.keys(this.queue.aggro).join(", ");

			messages.push(`Received aggro from ${monsters}.`);

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