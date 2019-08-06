import React from "react";
import { connect } from "react-redux";
import { Container, Form, TextArea, Button } from "semantic-ui-react";
import $ from "jquery";

class Export extends React.Component {
	render() {
		let settings = btoa(JSON.stringify(this.props.settings));

		return(
			<React.Fragment>
				<Container fluid className="section-container">
					<h2>Export Settings</h2>
					<p>
						Select and copy the text below, then import it into your desired overlay by right-clicking on the overlay and choosing "Import."
					</p>
					<div>
						<Form>
							<Form.Field>
								<Button size="mini" className="export" onClick={this.handleSelect.bind(this)}>Select All</Button>
								<TextArea defaultValue={settings} rows={20} readOnly="readonly"/>
							</Form.Field>
						</Form>
					</div>
				</Container>
			</React.Fragment>
		);
	}

	handleSelect(e, f, g) {
		let $button = $(e.target);
		let text    = $button.closest(".field").find("textarea")[0];

		text.focus();
		text.select();
	}
}

const mapStateToProps = (state) => {
	return {
		settings : state.settings
	};
};

export default connect(mapStateToProps)(Export);