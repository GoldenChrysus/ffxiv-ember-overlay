import React from "react";
import { Container } from "semantic-ui-react";
import $ from "jquery";

import DonationService from "../../services/DonationService";
import SocialLink from "./About/SocialLink";

const querystring = require("querystring");

class Donate extends React.Component {
	constructor() {
		super();

		const params = new querystring.parse(window.location.search);
		const type   = params.default || params["?default"];

		this.state = {
			type,
		};
	}

	componentDidMount() {
		if (this.state.type) {
			const type = this.state.type;
			const $url = $(this.refs[type]);

			$url.focus();
			this.selectText(`donation-${type}`);
			$url.focus();
		}
	}

	render() {
		return (
			<React.Fragment>
				<Container fluid className='section-container'>
					<h2>Donate</h2>
					<p>
						Copy one of the following URL&apos;s into your regular browser to make a donation.
						Donations are extremely appreciated, but this overlay will continue to be developed even without donations.
						If you would like your name to be included in the list of donors, please state this in the donation message.
						Thank you!
					</p>

					<div className='donation-link' data-type='cash' ref='cash' id='donation-cash'>{DonationService.getRealDonationLink("cash")}</div>
					<div className='donation-link' data-type='paypal' ref='paypal' id='donation-paypal'>{DonationService.getRealDonationLink("paypal")}</div>
					<div className='donation-link' data-type='paypay' ref='paypay' id='donation-paypay'>{DonationService.getRealDonationId("paypay")}</div>
					<div className='donation-link' data-type='kofi' ref='kofi' id='donation-kofi'>{DonationService.getRealDonationLink("kofi")}</div>
					<div className='donation-link' data-type='patreon' ref='patreon' id='donation-patreon'>{DonationService.getRealDonationLink("patreon")}</div>
					<div className='donation-link' data-type='streamlabs' ref='streamlabs' id='donation-streamlabs'>{DonationService.getRealDonationLink("streamlabs")}</div>

					<h2>Featured Donors</h2>
					<p>Pimpy Shortstocking, FortiusTTV <SocialLink name='fortiusttv' type='twitch'/>, loski3, Vale Alania</p>

					<h2>Donors</h2>
					<p>Amneamnius, Vulasuw, Jessica, mehdont, tomo</p>
				</Container>
			</React.Fragment>
		);
	}

	selectText(id) {
		const element = document.getElementById(id);

		let range;

		if (window.getSelection && document.createRange) {
			const selection = window.getSelection();

			range = document.createRange();

			range.selectNodeContents(element);
			selection.removeAllRanges();
			selection.addRange(range);
		} else if (document.body.createTextRange) {
			range = document.body.createTextRange();

			range.moveToElementText(element);
			range.select();
		}
	}
}

export default Donate;
