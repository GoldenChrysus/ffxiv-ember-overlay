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

			if (key.substring(0, 7) === "player_") {
				key       = key.substring(7);
				processor = PlayerProcessor;
				object    = player;
			}

			let value = processor.getDataValue(key, object);

			if (key === "health_percent") {
				columns.push(<div className="column" key={key}><PercentBar percent={value}/></div>);
			} else {
				columns.push(
					<div className="column" key={key}><span>{prefix}</span>{value}</div>
				);
			}
		}
	}
}

export default Monster;