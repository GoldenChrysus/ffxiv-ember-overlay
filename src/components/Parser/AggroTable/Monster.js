import React from "react";

import PlayerProcessor from "../../../processors/PlayerProcessor";
import MonsterProcessor from "../../../processors/MonsterProcessor";
import LocalizationService from "../../../services/LocalizationService";
import Constants from "../../../constants/index";
import PercentBar from "../PercentBar";

class Monster extends React.Component {
	render() {
		let monster      = this.props.monster;
		let player       = monster.Target;
		let player_type  = (monster._is_current) ? "active" : "other";
		let columns      = [];
		let stat_columns = this.props.columns;

		for (let key of stat_columns) {
			let processor = MonsterProcessor;
			let object    = monster;
			let raw_key   = key;
			let name_blur = (this.props.blur && key === "player_name") ? "blur" : "";

			if (key.substring(0, 7) === "player_") {
				key       = key.substring(7);
				processor = PlayerProcessor;
				object    = player;
			}

			let value = processor.getDataValue(key, object);

			if (raw_key === "player_name" && this.props.short_names !== "no_short") {
				value = PlayerProcessor.getShortName(value, this.props.short_names);
			}

			if (key === "health_percent") {
				columns.push(<div className="column" key={raw_key}><PercentBar percent={value}/></div>);
			} else {
				columns.push(
					<div className={"column " + name_blur} key={raw_key}>{value}</div>
				);
			}
		}

		return (
			<div className={"row player " + player_type} key={"monster-" + monster.ID}>
				{columns}
			</div>
		);
	}
}

export default Monster;