import React from "react";

import PlayerProcessor from "../../../processors/PlayerProcessor";
import MonsterProcessor from "../../../processors/MonsterProcessor";
import PercentBar from "../PercentBar";

class Monster extends React.Component {
	render() {
		const fallback_player = { Job : "", Name : "", name : "" };

		const monster      = this.props.monster;
		const player       = monster.Target || fallback_player;
		const player_type  = (monster._is_current) ? "active" : "other";
		const columns      = [];
		const stat_columns = this.props.columns;

		for (let key of stat_columns) {
			let processor = MonsterProcessor;
			let object    = monster;
			const raw_key   = key;
			const name_blur = (this.props.blur && key === "player_Name") ? "blur" : "";

			if (key.substring(0, 7) === "player_") {
				key = key.substring(7);
				processor = PlayerProcessor;
				object = player;

				object[key.toLowerCase()] = object[key];
			}

			let value = processor.getDataValue(key, object);

			if (key === "health_percent") {
				columns.push(<div className='column' key={raw_key}><PercentBar percent={value}/></div>);
			} else {
				if (raw_key === "player_Name") {
					let player = this.props.encounter.Combatant[value];

					if (monster._is_current && !player) {
						player = this.props.encounter.Combatant.YOU;
					}

					if (!player) {
						player = fallback_player;
					}

					const job        = player.Job.toUpperCase();
					const icon_blur  = (this.props.blur && this.props.icon_blur) ? "blur" : "";
					const icon_style = (icon_blur) ? { WebkitFilter : "blur(4px)" } : {};
					const icon_image = (job) ? <img src={"img/icons/jobs/" + job + ".png"} className={"icon " + icon_blur} style={icon_style} alt={job + " icon"}></img> : "";
					const icon       = <div className='column icon' key='player-data-icon'>{icon_image}</div>;

					if (this.props.short_names !== "no_short") {
						value = PlayerProcessor.getShortName(value, this.props.short_names);
					}

					columns.push(icon);
				}

				columns.push(
					<div className={"column " + name_blur} key={raw_key}>{value}</div>,
				);
			}
		}

		return (
			<div className={"row player " + player_type} key={"monster-" + monster.ID}>
				<div className='column' key='icon'></div>
				{columns}
			</div>
		);
	}
}

export default Monster;
