import React from "react";
import { connect } from "react-redux";
import { Container, Form, TextArea, Button } from "semantic-ui-react";
import $ from "jquery";

import LocalizationService from "../../services/LocalizationService";

class Export extends React.Component {
	render() {
		let settings = btoa(JSON.stringify(this.props.settings));

		return(
			<React.Fragment>
				<Container fluid className="section-container">
					<h2>{LocalizationService.getSettingsSubsectionText("export", 0)}</h2>
					<p>{LocalizationService.getMisc("export_info")}</p>
					<div>
						<Form>
							<Form.Field>
								<Button size="mini" className="export" onClick={this.handleCopy.bind(this)}>{LocalizationService.getMisc("copy")}</Button>
								<TextArea defaultValue={settings} rows={20} readOnly="readonly"/>
							</Form.Field>
						</Form>
					</div>
				</Container>
			</React.Fragment>
		);
	}

	handleCopy(e, f, g) {
		let $button = $(e.target);
		let text    = $button.closest(".field").find("textarea")[0];

		text.focus();
		text.select();
		document.execCommand("copy");
	}
}

const mapStateToProps = (state) => {
	return {
		settings : state.settings
	};
};

export default connect(mapStateToProps)(Export);