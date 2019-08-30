import React from "react";
import { Container } from "semantic-ui-react";

import LocalizationService from "../../services/LocalizationService";
import VersionService from "../../services/VersionService";

const reactStringReplace = require("react-string-replace");

class About extends React.Component {
	componentWillMount() {
		this.setState({
			changelog: <p>Loading changelog...</p>
		});

		VersionService.getChangelogForUser()
			.then((data) => {
				let changelog = [];

				if (typeof data === "string") {
					changelog = <p>{data}</p>;
				} else {
					for (let item_type in data) {
						let count = 0;
						let items = data[item_type].map((item) => {
							count++;

							return <li key={item_type + "-" + count}>{item}</li>
						});

						let ul = <ul>{items}</ul>

						changelog.push(
							<Container fluid className="changelog-section" key={item_type + "-section"}>
								<h4>{item_type}</h4>
								{ul}
							</Container>
						);
					}
				}

				this.setState({
					changelog: changelog
				});
			})
			.catch((e) => {
				console.log(e);
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