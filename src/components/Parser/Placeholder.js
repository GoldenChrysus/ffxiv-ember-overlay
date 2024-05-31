import React from "react";
import { connect } from "react-redux";
import { updateToggle } from "../../redux/actions";

class Placeholder extends React.Component {
	render() {
		const image_src   = `img/icons/placeholder-${this.props.theme}-theme.png`;
		const class_names = ["placeholder", this.props.location.replace("_", " ")];

		if (!this.props.toggles[this.props.location]) {
			class_names.push("hidden");
		}

		return (
			<div className={class_names.join(" ")} onClick={() => this.props.untoggle(this.props.location)}>
				<div className='inner'>
					<img src={image_src} alt='Minimized button'></img>
				</div>
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	untoggle(location) {
		dispatch(updateToggle({ location, enabled : false }));
	},
});

const mapStateToProps = state => ({
	toggles : state.internal.toggles,
});

export default connect(mapStateToProps, mapDispatchToProps)(Placeholder);
