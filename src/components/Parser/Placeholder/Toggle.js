import React from "react";
import { connect } from "react-redux";
import { updateToggle } from "../../../redux/actions";

class Toggle extends React.Component {
	render() {
		return (
			<div
				className={"toggle " + this.props.location.replace("_", " ")}
				onClick={() => this.props.toggle(this.props.location)}>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	toggle(location) {
		dispatch(updateToggle({ location, enabled : true }));
	},
});

const mapStateToProps = state => ({
	toggles : state.internal.toggles,
});

export default connect(mapStateToProps, mapDispatchToProps)(Toggle);
