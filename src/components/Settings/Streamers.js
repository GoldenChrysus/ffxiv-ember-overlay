import React from "react";
import { Container } from "semantic-ui-react";
import $ from "jquery";
import shuffle from "lodash.shuffle";

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

		let offline_text = (this.props.type === "offline")
			? <p className="offline">Looks like no one is live. Check out some Ember Overlay users below and follow them to receive notifications when they are live!</p>
			: "";

		return(
			<React.Fragment>
				<Container fluid className="section-container">
					<h2>Streamers</h2>
					<p>
						Twitch streamers who use Ember Overlay are featured here!
					</p>
					<p>
						<a className="info-link" onClick={this.toggleInfoDiv}>Are you a streamer or do you know a streamer who uses Ember Overlay?</a>
						<span className="info-span" style={{ display: "none" }}>
							Have the stream added to this list by joining our Discord at <span className="discord-link">{discord_url}</span> and posting the stream in
							#streamer-requests. You can also message <span className="author-link">{author_url}</span> with your stream info. 
							The stream is only eligible for inclusion if Ember Overlay is used on stream (will be verified via VOD's).
						</span>
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