import React from "react";
import { connect } from "react-redux";
import { Container, Form, TextArea, Button } from "semantic-ui-react";
import $ from "jquery";

import LocalizationService from "../../services/LocalizationService";

class Export extends React.Component {
	render() {
		return (
			<React.Fragment>
				<Container fluid className='section-container'>
					<h2>{LocalizationService.getSettingsSubsectionText("export", 0)}</h2>
					<p>{LocalizationService.getMisc("export_info")}</p>
					<div>
						<Form>
							<Form.Field>
								<Button size='mini' className='export' onClick={this.handleCopy.bind(this)}>{LocalizationService.getMisc("copy")}</Button>
								<TextArea defaultValue={this.props.settings_data.getExportKey()} rows={20} readOnly='readonly'/>
							</Form.Field>
						</Form>
					</div>
				</Container>
			</React.Fragment>
		);
	}

	handleCopy(e) {
		const $button = $(e.target);
		const text    = $button.closest(".field").find("textarea")[0];

		text.focus();
		text.select();
		document.execCommand("copy");
	}
}

const mapStateToProps = state => ({
	settings_data : state.settings_data,
});

export default connect(mapStateToProps)(Export);
