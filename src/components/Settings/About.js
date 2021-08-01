import React from "react";
import { Container } from "semantic-ui-react";

import LocalizationService from "../../services/LocalizationService";
import VersionService from "../../services/VersionService";

import SocialLink from "./About/SocialLink";

const reactStringReplace = require("react-string-replace");

class About extends React.Component {
	componentWillMount() {
		this.setState({
			changelog: <p>Loading changelog...</p>
		});

		VersionService.getChangelogForUser()
			.then((data) => {
				let changelog = VersionService.formatChangelog(data);

				this.setState({
					changelog: changelog
				});
			})
			.catch((e) => {
				console.error(JSON.stringify(e));
			});
	}

	render() {
		let github_url    = process.env.REACT_APP_GITHUB_URL;
		let discord_url   = process.env.REACT_APP_DISCORD_URL;
		let author_url    = process.env.REACT_APP_AUTHOR_URL;
		let changelog_url = process.env.REACT_APP_CHANGELOG_URL;

		let state                = this.state || {};
		let author_link          = <a href={author_url} target="_blank" rel="noopener noreferrer">GoldenChrysus</a>;
		let changelog_cta        = LocalizationService.getMisc("changelog_cta");
		let changelog_link_match = changelog_cta.match(/{{changelog_link_open}}.+{{changelog_link_close}}/g)[0];
		let changelog_link_text  = changelog_link_match
			.replace("{{changelog_link_open}}", "")
			.replace("{{changelog_link_close}}", "");
		let changelog_link       = <a href={changelog_url} target="_blank" rel="noopener noreferrer">{changelog_link_text}</a>;

		return(
			<React.Fragment>
				<Container fluid className="section-container">
					<h2>{LocalizationService.getSettingsSubsectionText("about", 0)}</h2>
					<p>{reactStringReplace(LocalizationService.getMisc("developer_credit"), "{{developer}}", () => author_link)}</p>

					<h3>Discord</h3>
					<p>{LocalizationService.getMisc("discord_cta")}</p>
					<p>
						<a href={discord_url} target="_blank" rel="noopener noreferrer">
							<img className="discord" src="img/buttons/discord.png" alt="Join our Discord server." title="Join our Discord server."/>
						</a>
					</p>

					<p>{LocalizationService.getMisc("broken_link")} <span className="discord-link">{discord_url}</span></p>

					<h3>GitHub</h3>
					<p>
						{LocalizationService.getMisc("github_cta")}<br/>
						<a href={github_url} target="_blank" rel="noopener noreferrer">{github_url}</a>
					</p>

					<h3>Credits</h3>
					<p id="credits">
						<ul>
							<li><strong class="featured">Pimpy Shortstocking</strong> - Featured donor</li>
							<li><strong class="featured">FortiusTTV</strong> - <SocialLink name="fortiusttv" type="twitch"/> - Featured donor</li>
						</ul>

						<ul>
							<li><strong>Bona</strong> - Portuguese translation</li>
							<li><strong>ShadyWhite</strong> - Chinese translation</li>
							<li><strong>Gusma</strong> - Portuguese translation</li>
							<li><strong>The_X</strong> - Portuguese translation</li>
							<li><strong>okuRaku</strong> <SocialLink name="okurakuu" type="twitter"/><SocialLink name="okuraku" type="twitch"/> - Japanese translation</li>
							<li><strong>Astriel</strong> - German translation</li>
							<li><strong>Claud</strong> - Spanish translation</li>
							<li><strong>Okâme</strong> - French translation</li>
							<li><strong>Tsunari96</strong> - Tsunari96#8491 (Discord) - Korean translation</li>
							<li><strong>justscribe</strong> <SocialLink name="justscribe" type="twitch"/><SocialLink type="globe" url="https://ffxiv.gaming4eternity.online/"/> - Ukrainian translation</li>
						</ul>

						<ul>
							<li><strong>Amneamnius</strong> - Donor</li>
							<li><strong>Vulasuw</strong> - Donor</li>
							<li><strong>Jessica</strong> - Donor</li>
							<li><strong>mehdont</strong> - Donor</li>
						</ul>
					</p>
				</Container>
				<Container fluid className="section-container">
					<h2>{LocalizationService.getMisc("changelog")}</h2>
					<p>{LocalizationService.getMisc("changelog_info")}</p>
					<p>{reactStringReplace(changelog_cta, changelog_link_match, () => changelog_link)}</p>

					<h3>{LocalizationService.getMisc("latest_changes")}</h3>
					{state.changelog}
				</Container>
			</React.Fragment>
		);
	}
}

export default About;