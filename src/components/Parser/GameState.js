import React from "react";

class GameState extends React.Component {
	render() {
		let encounter_class = (this.props.active) ? "active" : "inactive";
		let rank_class      = (this.props.show_rank) ? "" : "hidden";

		return (
			<div id="game-state">
				<span className={encounter_class}>{this.props.state}</span>
				<span className={rank_class}>Rank: {this.props.rank}</span>
			</div>
		);
	}
}

export default GameState;