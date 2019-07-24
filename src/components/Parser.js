import React from "react";
import { connect } from "react-redux";

import "./../styles/components/parser/parser-dark.less";

import Container from "./Parser/Container";
import VersionService from "./../services/VersionService";

class Parser extends React.Component {
	componentWillMount() {
		window.parser = true;

		VersionService.determineIfNewer();
	}

	render() {
		let inner_class   = (this.props.collapsed && this.props.viewing === "tables") ? "auto-height" : "";
		let opacity       = this.props.opacity / 100;
		let opacity_style = `
			#container {
				opacity: ${opacity};
			}
		`;

		return (
			<React.Fragment>
				<style type="text/css">
					{opacity_style}
					{this.props.css}
				</style>
				<div id="root-inner" className={inner_class}>
					<Container/>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		collapsed : state.settings.intrinsic.collapsed,
		viewing   : state.internal.viewing,
		css       : state.settings.custom.css || "",
		opacity   : state.settings.interface.opacity
	};
};

export default connect(mapStateToProps)(Parser);