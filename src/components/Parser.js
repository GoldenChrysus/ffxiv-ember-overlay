import React from "react";
import { connect } from "react-redux";

import "./../styles/components/parser/parser-dark.less";

import Container from "./Parser/Container";

class Parser extends React.Component {
	render() {
		let inner_class = (this.props.collapsed && this.props.viewing === "tables") ? "auto-height" : "";

		return (
			<React.Fragment>
				<style type="text/css">
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
		viewing   : state.settings.intrinsic.viewing,
		css       : state.settings.custom.css || ""
	};
};

export default connect(mapStateToProps)(Parser);