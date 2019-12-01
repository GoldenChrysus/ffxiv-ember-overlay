import React from "react";
import { connect } from "react-redux";
import { Form, Input, Button } from "semantic-ui-react";
import $ from "jquery";

import LocalizationService from "../../../services/LocalizationService";

class Import extends React.Component {
	render() {
		return(
			<React.Fragment>
				<div id="import">
					<div className="header">
						<div className="name">{LocalizationService.getOverlayText("import_settings")}</div>
					</div>
					<div className="section">
						<p>
							{LocalizationService.getOverlayText("import_instructions")}
						</p>
						<div>
							<Form>
								<Form.Field>
									<Input/>
									<Button size="mini" className="import" onClick={this.handleImport.bind(this)}>{LocalizationService.getOverlayText("import")}</Button>
								</Form.Field>
							</Form>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}

	handleImport(e, f, g) {
		let $button = $(e.target);
		let value   = $button.closest(".field").find("input").val();

		this.props.settings_data.importSettings(value);
	}
}

const mapStateToProps = (state) => {
	return {
		language      : state.settings.interface.language,
		settings_data : state.settings_data
	};
};

export default connect(mapStateToProps)(Import);