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
		let collapsed          = (this.props.collapsed && this.props.viewing === "tables");
		let root_inner_classes = [];
		let opacity            = this.props.opacity / 100;
		let opacity_style      = `
			#container {
				opacity: ${opacity};
			}
		`;

		if (collapsed) {
			root_inner_classes.push("auto-height");

			if (this.props.collapse_down) {
				root_inner_classes.push("down");
			}
		}

		root_inner_classes = root_inner_classes.join(" ");

		return (
			<React.Fragment>
				<style type="text/css">
					{opacity_style}
					{this.props.css}
				</style>
				<div id="root-inner" className={root_inner_classes}>
					<Container/>
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		collapsed     : state.settings.intrinsic.collapsed,
		collapse_down : state.settings.interface.collapse_down,
		viewing       : state.internal.viewing,
		css           : state.settings.custom.css || "",
		opacity       : state.settings.interface.opacity
	};
};

export default connect(mapStateToProps)(Parser);