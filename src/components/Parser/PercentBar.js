import React from "react";

class PercentBar extends React.Component {
	getStyle = () => {
		return {
			backgroundSize: "50% 100%"
		};
	}

	render() {
		let percent = this.props.percent;

		return(
			<div className="column-percent-bar" style={{backgroundSize: `${percent}% 100%`}}></div>
		);
	}
}

export default PercentBar;