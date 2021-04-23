import store from "../redux/store";
import $ from "jquery";

class DiscordService {
	postToWebhook() {
		const state = store.getState();

		if (!state.internal.game || !state.internal.game.Encounter) {
			return;
		}

		let data = {
			"username"   : "Ember Overlay & Spell Timers",
			"avatar_url" : "https://i.imgur.com/g2Heqn5.png",
			"embeds"     : [
				{
					"title"       : "Encounter: {{encounter}}",
					"type"        : "rich",
					"description" : "Powered by [Ember](" + process.env.REACT_APP_GITHUB_URL + ").\n\n*Duration: {{duration}}*",
					"color"       : 15258703,
					"thumbnail"   : {
						"url" : "https://i.imgur.com/sZSRJJK.png"
					},
					"fields" : [],
					"footer" : {
						"text"     : "Total DPS: {{total_dps}}",
						"icon_url" : "https://i.imgur.com/bBOcrTZ.png"
					}
				}
			]
		};

		for (let name in state.internal.game.Combatant) {
			let dps = (+state.internal.game.Combatant[name].encdps).toLocaleString(undefined, { minimumFractionDigits : 0, maximumFractionDigits: 0 });
			let hps = (+state.internal.game.Combatant[name].enchps).toLocaleString(undefined, { minimumFractionDigits : 0, maximumFractionDigits: 0 });

			if (name === "YOU") {
				name = state.internal.character_name;

				if (name === "YOU") {
					name = state.settings.interface.player_name;
				}

				if (name === "YOU") {
					name = "You";
				}
			}

			data.embeds[0].fields.push({
				"name": name,
				"value": `>>> DPS: ${dps}\nHPS: ${hps}`,
				"inline": true
			});
		}

		let duration  = state.internal.game.Encounter.duration;
		let encounter = (state.internal.game.Encounter.title === "Encounter") ? state.internal.game.Encounter.CurrentZoneName : state.internal.game.Encounter.title;

		if (duration[0] === "0" && duration[1] !== ":") {
			duration = duration.substring(1);
		}

		data.embeds[0].title       = data.embeds[0].title.replace("{{encounter}}", encounter);
		data.embeds[0].description = data.embeds[0].description.replace("{{duration}}", duration);

		data.embeds[0].footer.text = data.embeds[0].footer.text.replace(
			"{{total_dps}}",
			(+state.internal.game.Encounter.encdps).toLocaleString(undefined, { minimumFractionDigits : 0, maximumFractionDigits: 0 })
		);

		$.ajax({
			contentType : "application/json",
			data        : JSON.stringify(data),
			method      : "POST",
			url         : state.settings.discord.url
		});
	}

	openDiscordWindow() {
		const url = process.env.REACT_APP_DISCORD_URL;

		window.open(url, "", "width=500,height=1000,location=no,menubar=no");
	}
}

export default new DiscordService();