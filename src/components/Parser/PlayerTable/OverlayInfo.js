import React from "react";

import VersionService from "../../../services/VersionService";

class OverlayInfo extends React.Component {
	componentWillMount() {
		this.setState({
			changelog: <p>Loading changelog...</p>
		});

		VersionService.getLatestChangelogs(3)
			.then((data) => {
				let changelog = VersionService.formatChangelog(data);

				this.setState({
					changelog: changelog
				});
			})
			.catch((e) => {
				console.log(e);
			});
	}

	render() {
		return (
			<div id="overlay-info">
				<h3>Ember Overlay</h3>
				<p>This section will disappear when an encounter begins.</p>

				<div id="funding">
					<span onClick={this.openFundingLink.bind(this, "streamelements")} ref="streamelements"><img src="https://img.shields.io/badge/Donate-on%20StreamElements-green" alt="Donate on StreamElements" height="20"/></span>
					<span onClick={this.openFundingLink.bind(this, "kofi")} ref="kofi"><img src="https://www.ko-fi.com/img/githubbutton_sm.svg" alt="ko-fi" height="20"/></span>
				</div>

				<h3>Latest Changes</h3>
				{this.state.changelog}
			</div>
		);
	}

	openFundingLink(rel) {
		let search     = window.location.search || "";
		let search_add = (search.slice(0, 1) === "?") ? "&" : "?";

		search += search_add + `default=${rel}`;

		window.open(window.location.pathname + search + "#/settings/donate", "", "width=600,height=430,location=yes,menubar=yes");
	}
}

export default OverlayInfo;