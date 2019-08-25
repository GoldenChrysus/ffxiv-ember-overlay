import React from "react";
import { Container } from "semantic-ui-react";
import $ from "jquery";

const querystring = require("querystring");

class Donate extends React.Component {
	constructor() {
		super();

		let params = new querystring.parse(window.location.search);
		let type   = params["default"] || params["?default"];

		this.state = {
			type : type
		};
	}

	componentDidMount() {
		if (this.state.type) {
			let type = this.state.type;
			let $url = $(this.refs[type]).find("span");

			$url.focus();
			this.selectText(`donation-${type}`);
			$url.focus();
		}
	}

	render() {
		return(
			<React.Fragment>
				<Container fluid className="section-container">
					<h2>Donate</h2>
					<p>
						Copy one of the following URL's into your regular browser to make a donation. 
						Donations are extremely appreciated, but this overlay will continue to be developed even without donations. 
						If you would like your name to be included in the list of donors, please state this in the donation message. 
						Thank you!
					</p>

					<div className="donation-link" data-type="streamelements" ref="streamelements" id="donation-streamelements">https://streamelements.com/chrysus/tip</div>
					<div className="donation-link" data-type="kofi" ref="kofi" id="donation-kofi">https://ko-fi.com/goldenchrysus</div>
				</Container>
			</React.Fragment>
		);
	}

	selectText(id) {
		let element = document.getElementById(id);

		let range;

		if (window.getSelection && document.createRange) {
			let selection = window.getSelection();

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