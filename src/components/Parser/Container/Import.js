import React from "react";
import { connect } from "react-redux";
import { Form, Input, Button } from "semantic-ui-react";
import $ from "jquery";

import Settings from "../../../data/Settings";

class Import extends React.Component {
	render() {
		return(
			<React.Fragment>
				<div id="import">
					<div className="header">
						<div className="name">Import Settings</div>
					</div>
					<div className="section">
						<p>
							Paste your exported setting key below and click "Import."
						</p>
						<div>
							<Form>
								<Form.Field>
									<Button size="mini" className="import" onClick={this.handleImport.bind(this)}>Import</Button>
									<Input/>
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

		Settings.importSettings(value);
	}
}

export default connect()(Import);