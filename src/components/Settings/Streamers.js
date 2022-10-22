import React from "react";
import { Container } from "semantic-ui-react";
import $ from "jquery";
import shuffle from "lodash.shuffle";

import LocalizationService from "../../services/LocalizationService";

const reactStringReplace = require("react-string-replace");

class Streamers extends React.Component {
	render() {
		const streamers      = this.props.streamers || {};
		const streamer_names = shuffle(Object.keys(streamers));
		const streamer_boxes = [];
		const discord_url    = process.env.REACT_APP_DISCORD_URL;
		const author_url     = process.env.REACT_APP_AUTHOR_URL;

		for (const streamer_name of streamer_names) {
			let thumbnail = streamers[streamer_name];

			thumbnail = thumbnail
				.replace("{width}", "1920")
				.replace("{height}", "1080");

			streamer_boxes.push(
				<div className='row' key={streamer_name}>
					<a href={"https://twitch.tv/" + streamer_name} target='_blank' rel='noopener noreferrer'>
						<span className='name'>{streamer_name}</span>
						<img src={thumbnail} alt={streamer_name}/>
					</a>
				</div>,
			);
		}

		const discord_link = <span key='discord-link' className='discord-link'>{discord_url}</span>;
		const author_link  = <span key='author-link' className='author-link'>{author_url}</span>;
		const offline_text = (this.props.type === "offline")
			? <p className='offline'>Looks like no one is live. Check out some Ember Overlay users below and follow them to receive notifications when they are live!</p>
			: "";
		let long_cta     = LocalizationService.getMisc("streamer_long_cta");

		long_cta = reactStringReplace(long_cta, "{{discord_link}}", () => discord_link);
		long_cta = reactStringReplace(long_cta, "{{twitch_link}}", () => author_link);

		return (
			<React.Fragment>
				<Container fluid className='section-container'>
					<h2>{LocalizationService.getMisc("streamers")}</h2>
					<p>{LocalizationService.getMisc("streamer_info")}</p>
					<p>
						<a href='/' className='info-link' onClick={this.toggleInfoDiv}>{LocalizationService.getMisc("streamer_short_cta")}</a>
						<span className='info-span' style={{ display : "none" }}>{long_cta}</span>
					</p>
					{offline_text}
					<div id='streamers'>
						{streamer_boxes}
					</div>
				</Container>
			</React.Fragment>
		);
	}

	toggleInfoDiv(e) {
		e.preventDefault();

		const $link = $(e.target);
		const $div  = $link.closest("p").find(".info-span");

		$div.slideToggle();
		return false;
	}
}

export default Streamers;
