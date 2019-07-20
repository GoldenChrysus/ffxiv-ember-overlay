import React from "react";

class GameState extends React.Component {
	render() {
		let span_class = (this.props.active) ? "active" : "inactive";

		return (
			<div id="game-state">
				<span className={span_class}>{this.props.state}</span>
			</div>
		);
	}
}

export default GameState;