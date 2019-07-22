import React from "react";
import { connect } from "react-redux";

import "./../styles/components/parser/parser-dark.less";

import Container from "./Parser/Container";

class Parser extends React.Component {
	render() {
		let inner_class = (this.props.collapsed && this.props.viewing === "tables") ? "auto-height" : "";

		return (
			<div id="root-inner" className={inner_class}>
				<Container/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		collapsed : state.settings.intrinsic.collapsed,
		viewing   : state.settings.intrinsic.viewing
	};
};

export default connect(mapStateToProps)(Parser);