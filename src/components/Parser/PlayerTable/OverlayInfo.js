import React from "react";

import DonationService from "../../../services/DonationService";
import VersionService from "../../../services/VersionService";

class OverlayInfo extends React.Component {
	componentWillMount() {
		// Hibiya OverlayPlugin: 45.0.2454.85
		// ACTWS: 53.0.2785.148
		// ngld OverlayPlugin: 78
		let browser_data    = navigator.userAgent.match(/Chrome\/[\d.]+/g);
		let browser_version = "hibiya";

		if (browser_data) {
			let chrome_version = +browser_data[0].split("/")[1].split(".")[0];

			if (chrome_version >= 65) {
				browser_version = "ngld";
			} else if (chrome_version >= 53) {
				browser_version = "actws";
			}
		} else {
			// Probably in a non-Chrome desktop browser, so we'll call it ngld for consistency
			browser_version = "ngld";
		}

		this.setState({
			changelog : <p>Loading changelog...</p>,
			chrome    : browser_version
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
				<p>Seeking a translator for Korean. Please join the Discord if interested.</p>

				<div id="funding">
					<span onClick={this.openFundingLink.bind(this, "paypal")} ref="paypal"><img src="img/buttons/funding/paypal.png" alt="Donate at PayPal" height="20"/></span>
					<span onClick={this.openFundingLink.bind(this, "kofi")} ref="kofi"><img src="img/buttons/funding/kofi.svg" alt="Donate at Ko-fi" height="20"/></span>
					<span onClick={this.openFundingLink.bind(this, "patreon")} ref="patreon"><img src="img/buttons/funding/patreon.png" alt="Donate at Patreon" height="20"/></span>
					<span onClick={this.openFundingLink.bind(this, "streamelements")} ref="streamelements"><img src="https://img.shields.io/badge/Donate-at%20StreamElements-green" alt="Donate at StreamElements" height="20"/></span>
				</div>

				<h3>Latest Changes</h3>
				{this.state.changelog}
			</div>
		);
	}

	openFundingLink(rel) {
		let url = "";

		// Min for PayPal: Hibiya
		// Min for StreamElements: ngld
		// Min for Ko-fi: Hibiya
		// Min for Patreon: ngld
		switch (this.state.chrome) {
			case "hibiya":
			case "actws":
				switch (rel) {
					case "paypal":
					case "kofi":
						url = DonationService.getRealDonationLink(rel);

						break;

					default:
						url = DonationService.buildLocalDonationLink(rel);

						break;
				}

				break;

			case "ngld":
			default:
				url = DonationService.getRealDonationLink(rel);

				break;
		}

		window.open(url, "", "width=600,height=430,location=yes,menubar=yes");
	}
}

export default OverlayInfo;