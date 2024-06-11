import PlayerProcessor from "../processors/PlayerProcessor";
import store from "../redux/store";
import $ from "jquery";
import LocalizationService from "./LocalizationService";

class DiscordService {
	postToWebhook() {
		const state = store.getState();

		if (!state.internal.game || !state.internal.game.Encounter) {
			return;
		}

		const players        = state.internal.game.Combatant;
		const encounter      = state.internal.game.Encounter;
		const metrics        = state.settings.discord.metrics || ["encdps", "enchps"];
		const sort_metric    = state.settings.discord.sort || "damage";
		const sorted_players = PlayerProcessor.sortPlayers(players, encounter, sort_metric);

		const data = {
			username   : "Ember Overlay & Spell Timers",
			avatar_url : "https://i.imgur.com/g2Heqn5.png",
			embeds     : [
				{
					title       : "Encounter: {{encounter}}",
					type        : "rich",
					description : "Powered by [Ember](" + process.env.REACT_APP_GITHUB_URL + ").\n\n*Duration: {{duration}}*",
					color       : 7419530,
					thumbnail   : {
						// "url" : "https://i.imgur.com/sZSRJJK.png"
						url : "https://i.imgur.com/p6oH6xe.png",
					},
					fields : [],
					footer : {
						text     : "Total DPS: {{total_dps}}",
						// "icon_url" : "https://i.imgur.com/bBOcrTZ.png"
						icon_url : "https://i.imgur.com/ko7LnGw.png",
					},
				},
			],
		};

		for (const player of sorted_players) {
			let name             = PlayerProcessor.getDataValue("name", player);
			let job              = (player._is_pet) ? "PET" : (player.Job || "LMB").toUpperCase();
			const player_metrics = [];

			for (const metric of metrics) {
				const value = PlayerProcessor.getDataValue(metric, player, sorted_players, encounter);
				const title = LocalizationService.getPlayerDataTitle(metric, "short");

				player_metrics.push(`${title}: ${value}`);
			}

			if (job) {
				job = `${job}: `;
			}

			if (name === "YOU") {
				name = "You";
			}

			data.embeds[0].fields.push({
				name   : `${job}${name}`,
				value  : `>>> ${player_metrics.join("\n")}`,
				inline : true,
			});
		}

		let duration         = state.internal.game.Encounter.duration;
		const encounter_name = (state.internal.game.Encounter.title === "Encounter") ? state.internal.game.Encounter.CurrentZoneName : state.internal.game.Encounter.title;

		if (duration[0] === "0" && duration[1] !== ":") {
			duration = duration.substring(1);
		}

		data.embeds[0].title       = data.embeds[0].title.replace("{{encounter}}", encounter_name);
		data.embeds[0].description = data.embeds[0].description.replace("{{duration}}", duration);

		data.embeds[0].footer.text = data.embeds[0].footer.text.replace(
			"{{total_dps}}",
			(Number(state.internal.game.Encounter.encdps)).toLocaleString(undefined, { minimumFractionDigits : 0, maximumFractionDigits : 0 }),
		);

		$.ajax({
			contentType : "application/json",
			data        : JSON.stringify(data),
			method      : "POST",
			url         : state.settings.discord.url,
		});
	}

	openDiscordWindow() {
		const url = process.env.REACT_APP_DISCORD_URL;

		window.open(url, "", "width=500,height=1000,location=no,menubar=no");
	}
}

export default new DiscordService();
