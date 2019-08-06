import $ from "jquery";

class TwitchAPIService {
	getLiveStreamers() {
		return new Promise((resolve, reject) => {
			$.get("data/streamers.txt")
				.then((res) => {
					let usernames     = res.split(",")
					let client_id     = process.env.REACT_APP_TWITCH_API_CLIENT_ID;
					let streamers     = {};
					let get_usernames = usernames.join("&user_login=");

					$.get({
						url     : `https://api.twitch.tv/helix/streams?user_login=${get_usernames}`,
						headers : {
							"Client-ID" : client_id
						}
					})
					.then((res) => {
						if (res.data.length === 0) {
							get_usernames = usernames.join("&login=");

							$.get({
								url     : `https://api.twitch.tv/helix/users?login=${get_usernames}`,
								headers : {
									"Client-ID" : client_id
								}
							})
							.then((res) => {
								for (let streamer of res.data) {
									streamers[streamer.display_name] = streamer.profile_image_url;
								}

								resolve({
									type      : "offline",
									streamers : streamers
								});
							})
							.catch((e) => {
								reject(e);
							});

							return;
						}

						for (let streamer of res.data) {
							streamers[streamer.user_name] = streamer.thumbnail_url;
						}

						resolve({
							type      : "live",
							streamers : streamers
						});
					})
					.catch((e) => {
						reject(e);
					});
				})
				.catch((e) => {
					reject(e);
				});
		});
	}
}

export default new TwitchAPIService();