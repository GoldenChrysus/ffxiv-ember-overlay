import React from "react";
import { Container } from "semantic-ui-react";

class About extends React.Component {
	render() {
		let github_url  = process.env.REACT_APP_GITHUB_URL;
		let discord_url = process.env.REACT_APP_DISCORD_URL;

		return(
			<React.Fragment>
				<Container fluid className="section-container">
					<h2>Ember Overlay</h2>
					<p>Developed by GoldenChrysus.</p>
					<p>
						<h3>Discord</h3>
						Join the Discord to receive live updates from the developer, submit feature suggestions, get help with a bug or issue, or discuss FFXIV in general with other users.<br/>
						<a href={discord_url} target="_blank" rel="noopener noreferrer"><img class="discord" src="img/buttons/discord.png" alt="Join our Discord server." title="Join our Discord server."/></a>
					</p>
					<p>
						<h3>GitHub</h3>
						See the latest code, changelog, and readme information GitHub. You can also submit bug reports or feature requests.<br/>
						<a href={github_url} target="_blank" rel="noopener noreferrer">{github_url}</a>
					</p>
				</Container>
				<Container fluid className="section-container">
					<h2>Changelog</h2>
					<p>The changelog listed here will show all the changes that have been made (if any) in the current version compared against the last version you used.</p>
					<p>
						<h3>Latest Changes</h3>
					</p>
				</Container>
			</React.Fragment>
		);
	}
}

export default About;