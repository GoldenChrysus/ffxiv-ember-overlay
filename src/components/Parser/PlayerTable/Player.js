import React from "react";

import PlayerProcessor from "../../../processors/PlayerProcessor";

class Player extends React.Component {
	render() {
		let processor   = new PlayerProcessor();
		let player      = this.props.player;
		let player_type = (player.name === "YOU") ? "active" : "other";
		let job         = player.Job.toUpperCase() || "LMB";
		let columns     = [];

		for (let title in this.props.columns) {
			let key   = this.props.columns[title];
			let value = processor.getDataValue(key, player, this.props.players);

			columns.push(
				<div className="column" key={key}>{value}</div>
			);
		}

		return (
			<div className={"row player " + player_type} onClick={this.props.onClick}>
				<div className="column"><img src={"img/icons/jobs/" + job + ".png"} alt={job + " icon"}></img></div>
				<div className="column">{processor.getDataValue("name", player)}</div>
				{columns}
			</div>
		);
	}
}

export default Player;