import React from "react";
import { Container } from "semantic-ui-react";
import $ from "jquery";
import shuffle from "lodash.shuffle";

import LocalizationService from "../../services/LocalizationService";

const reactStringReplace = require("react-string-replace");

class Streamers extends React.Component {
	render() {
		let streamers      = this.props.streamers || {};
		let streamer_names = shuffle(Object.keys(streamers));
		let streamer_boxes = [];
		let discord_url    = process.env.REACT_APP_DISCORD_URL;
		let author_url     = process.env.REACT_APP_AUTHOR_URL;

		for (let streamer_name of streamer_names) {
			let thumbnail = streamers[streamer_name];

			thumbnail = thumbnail
				.replace("{width}", "1920")
				.replace("{height}", "1080");

			streamer_boxes.push(
				<div className="row" key={streamer_name}>
					<a href={"https://twitch.tv/" + streamer_name} target="_blank" rel="noopener noreferrer">
						<span className="name">{streamer_name}</span>
						<img src={thumbnail} alt={streamer_name}/>
					</a>
				</div>
			);
		}

		let discord_link = <span className="discord-link">{discord_url}</span>;
		let author_link  = <span className="author-link">{author_url}</span>;
		let offline_text = (this.props.type === "offline")
			? <p className="offline">Looks like no one is live. Check out some Ember Overlay users below and follow them to receive notifications when they are live!</p>
			: "";
		let long_cta     = LocalizationService.getMisc("streamer_long_cta");

		long_cta = reactStringReplace(long_cta, "{{discord_link}}", () => discord_link);
		long_cta = reactStringReplace(long_cta, "{{twitch_link}}", () => author_link);

		return(
			<React.Fragment>
				<Container fluid className="section-container">
					<h2>{LocalizationService.getMisc("streamers")}</h2>
					<p>{LocalizationService.getMisc("streamer_info")}</p>
					<p>
						<a className="info-link" onClick={this.toggleInfoDiv}>{LocalizationService.getMisc("streamer_short_cta")}</a>
						<span className="info-span" style={{ display: "none" }}>{long_cta}</span>
					</p>
					{offline_text}
					<div id="streamers">
						{streamer_boxes}
					</div>
				</Container>
			</React.Fragment>
		);
	}

	toggleInfoDiv(e) {
		let $link = $(e.target);
		let $div  = $link.closest("p").find(".info-span");

		$div.slideToggle();
	}
}

export default Streamers;