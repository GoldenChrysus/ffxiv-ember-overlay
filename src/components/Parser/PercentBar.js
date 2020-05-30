import React from "react";

class PercentBar extends React.Component {
	render() {
		let percent = this.props.percent;

		return(
			<div className="column-percent-bar" key="column-percent-bar" style={{backgroundSize: `${percent}% 100%`}}></div>
		);
	}
}

export default PercentBar;