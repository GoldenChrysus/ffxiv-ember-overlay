import $ from "jquery";

class TwitchAPIService {
	getLiveStreamers() {
		return new Promise((resolve, reject) => {
			$.get("data/streamers.txt")
				.then(res => {
					const usernames = res.split(",");

					$.get({
						url : `https://chrysus.xyz/games/ffxiv/ember-overlay/scripts/streamers.php?usernames=${usernames}`,
					})
						.then(res => {
							resolve(res);
						})
						.catch(e => {
							reject(e);
						});
				})
				.catch(e => {
					console.error(JSON.stringify(e));
					reject(e);
				});
		});
	}
}

export default new TwitchAPIService();
