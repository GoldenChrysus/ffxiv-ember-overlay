import React from "react";
import { connect } from "react-redux";
import { Form, Input, Button } from "semantic-ui-react";
import $ from "jquery";

import LocalizationService from "../../../services/LocalizationService";

class Import extends React.Component {
	render() {
		let allow_overlayplugin_import = (this.props.plugin_service.is_websocket && this.props.author === "ngld");
		let overlayplugin_button       = (!allow_overlayplugin_import)
			? ""
			: <Button size="mini" className="import" onClick={this.handleImport.bind(this, true)}>{LocalizationService.getOverlayText("import")} from OverlayPlugin</Button>;
		let overlayplugin_text         = (!allow_overlayplugin_import)
			? ""
			: (
				<p>
					Ember has detected you are using OverlayPlugin.
					You can attempt to import automatically from OverlayPlugin by clicking "{LocalizationService.getOverlayText("import")} from OverlayPlugin" below.
					Otherwise, follow the import steps as normal.
				</p>
			);
		return(
			<React.Fragment>
				<div id="import">
					<div className="header">
						<div className="name">{LocalizationService.getOverlayText("import_settings")}</div>
					</div>
					<div className="section">
						{overlayplugin_text}
						<p>
							{LocalizationService.getOverlayText("import_instructions")}
						</p>
						<div>
							<Form>
								<Form.Field>
									<Input/>
									<Button size="mini" className="import" onClick={this.handleImport.bind(this, false)}>{LocalizationService.getOverlayText("import")}</Button>
									{overlayplugin_button}
								</Form.Field>
							</Form>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}

	getButtons() {
		return $(document).find("button.import");
	}

	getButton(e) {
		return $(e.target);
	}

	getInput(e, button) {
		let $button = button || this.getButton(e);
		
		return $button.closest(".field").find("input");
	}

	handlePaste(e, f, g) {
		let $input = this.getInput(e);

		$input[0].focus();
		document.execCommand("paste");
	}

	enableButtons($clicked_button, button_text) {
		let $buttons = this.getButtons();

		$clicked_button.text(button_text);
		$buttons.attr("disabled", false);
	}

	handleImport(overlayplugin, event) {
		let $button      = this.getButton(event);
		let $buttons     = this.getButtons();
		let value        = this.getInput(event, $button).val();
		let initial_text = $button.text();
		let promise      = null;

		$buttons.attr("disabled", true);
		$button.text("Importing...");

		if (!overlayplugin) {
			promise = this.props.settings_data.importSettings(value);
		} else {
			promise = this.props.settings_data.restoreFromOverlayPlugin();
		}

		promise
			.then(() => {
				$button.text("Imported!");
				setTimeout(this.enableButtons.bind(this, $button, initial_text), 4000);
			})
			.catch((e) => {
				console.error(JSON.stringify(e));
				$button.text("Import has failed...");
				setTimeout(this.enableButtons.bind(this, $button, initial_text), 4000);
			});
	}
}

const mapStateToProps = (state) => {
	return {
		author         : state.internal.overlayplugin_author,
		language       : state.settings.interface.language,
		settings_data  : state.settings_data,
		plugin_service : state.plugin_service
	};
};

export default connect(mapStateToProps)(Import);