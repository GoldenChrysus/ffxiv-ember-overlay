import store from "../redux/store";

class TTSService {
	rules = {};
	state = {
		top      : false,
		critical : [],
		aggro    : []
	};
	queue = {
		critical  : {},
		top       : {},
		aggro     : {},
		encounter : []
	};

	start() {
		setInterval(
			this.processQueue,
			1500
		);
	}

	updateRules() {
		this.rules = store.getState.settings_data.getSetting("tts");
	}

	processLogLine(data) {
		let player     = "";
		let hp_percent = 0;

		if (hp_percent < 0 && !this.state.critical.includes(player)) {
			this.state.critical.push(player);

			this.queue.critical[player] = true;
		} else if (hp_percent > 0 && this.state.critical.includes(player)) {
			this.state.critical.splice(this.state.critical.indexOf(player), 1);
		}
	}

	processRank(rank) {
		if (rank === 1 & !this.state.top) {
			this.state.top = true;

			this.queue.top.dps = "You are top DPS.";
		} else if (rank !== 1 && this.state.top) {
			this.state.top = false;
		}
	}

	processAggro(mobs) {
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

			messages.push(`You have been aggroed by ${monsters}.`);

			this.queue.aggro = {};
		}

		if (this.encounter.length) {
			messages = messages.concat(this.queue.encounter);

			this.queue.encounter = [];
		}
	}
}

export default new TTSService();