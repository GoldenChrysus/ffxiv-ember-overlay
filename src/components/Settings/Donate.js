import React from "react";
import { Container } from "semantic-ui-react";
import $ from "jquery";

const querystring = require("querystring");

class Donate extends React.Component {
	componentWillMount() {
		let params = new querystring.parse(window.location.search);
		let type   = params["default"];

		this.setState({
			type : type
		});
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
					<p>Copy one of the following URL's into your regular browser to make a donation.</p>

					<div className="donation-link" data-type="streamelements" ref="streamelements"><span id="donation-streamelements">https://streamelements.com/chrysus/tip</span></div>
					<div className="donation-link" data-type="kofi" ref="kofi"><span id="donation-kofi">https://ko-fi.com/S6S611OOG</span></div>
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