import React from "react";
import { connect } from "react-redux";
import "./App.css";

import Container from "./components/Container";

class App extends React.Component {
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
		collapsed : state.collapsed,
		viewing   : state.viewing
	};
};

export default connect(mapStateToProps)(App);