import React from "react";
import { connect } from "react-redux";
import Constants from "../../constants/index";

class Screen extends React.Component {
	render() {
		return "Screen";
	}
}

const mapStateToProps = (state) => {
	return {
		settings : state.settings
	};
};

export default connect(mapStateToProps)(Screen);