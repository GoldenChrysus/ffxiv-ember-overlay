import React from "react";

import PlayerProcessor from "../../../processors/PlayerProcessor";
import LocalizationService from "../../../services/LocalizationService";
import Constants from "../../../constants/index";
import PercentBar from "../PercentBar";
import ReactTooltip from "react-tooltip";

class Player extends React.Component {
	componentDidUpdate() {
		ReactTooltip.rebuild();
	}

	render() {
		const player      = this.props.player;
		const player_type = (player._is_current) ? "active" : "other";
		const job         = (player._is_pet) ? "PET" : (player.Job || "LMB").toUpperCase();
		const table_type  = this.props.type;
		const is_raid     = (table_type === "raid");
		const columns     = [];
		let stat_columns  = this.props.columns;
		const job_data    = Constants.GameJobs[job];
		const role        = (job_data) ? job_data.role : "dps";

		if (is_raid) {
			stat_columns = stat_columns[role];
		}

		for (const key of stat_columns) {
			const value = PlayerProcessor.getDataValue(key, player, this.props.players, this.props.encounter);
			let prefix  = (is_raid || this.props.horizontal) ? LocalizationService.getPlayerDataTitle(key, "short") : "";

			if (is_raid) {
				prefix += ": ";
			}

			if (key === "enmity_percent") {
				columns.push(<div className='column' key={key}><PercentBar percent={value}/></div>);
			} else {
				columns.push(
					<div className='column' key={key}><span className='metric-name'>{prefix}</span>{value}</div>,
				);
			}
		}

		const name_blur  = (this.props.blur) ? "blur" : "";
		const icon_blur  = (this.props.blur && this.props.icon_blur) ? "blur" : "";
		const icon_style = (icon_blur) ? { WebkitFilter : "blur(4px)" } : {};
		let player_name  = PlayerProcessor.getDataValue("name", player);
		const icon       = <div className='column' key={"player-data-icon-" + player_name}><img src={"img/icons/jobs/" + job + ".png"} className={"icon " + icon_blur} style={icon_style} alt={job + " icon"}></img></div>;

		if (this.props.short_names !== "no_short") {
			player_name = PlayerProcessor.getShortName(player_name, this.props.short_names);
		}

		const name       = <div className={"column " + name_blur} key='player-data-name'>{player_name}</div>;
		const playerData = () => {
			if (!is_raid) {
				return [
					icon,
					name,
				];
			}

			return (
				<div className='player-data'>
					{icon}
					{name}
				</div>
			);
		};

		const statData = () => {
			if (!is_raid) {
				return columns;
			}

			return (
				<div className='stat-data'>
					{columns}
				</div>
			);
		};

		let tooltip = null;

		if (this.props.horizontal && this.props.detail_data && this.props.detail_data[role]) {
			tooltip = [];

			for (const key of this.props.detail_data[role]) {
				const value = PlayerProcessor.getDataValue(key, player, this.props.players, this.props.encounter);
				const name  = LocalizationService.getPlayerDataTitle(key, "short").toUpperCase();

				tooltip.push(name + ": " + value);
			}

			tooltip = tooltip.join("<br>");
		}

		return (
			<div data-tip={tooltip} data-multiline={true} className={"row player " + player_type} data-job={job} data-role={role} data-party={Number(player._party || 0)} key={"player-row-" + player_name} data-uuid={player_name} onClick={this.props.onClick}>
				{playerData()}
				{statData()}
				{
					this.props.percent_bars &&
					(
						<div className='percent-bar' key={"percent-bar-" + player_name} style={{
							backgroundRepeat    : "no-repeat",
							backgroundPositionY : "1px",
							position            : "absolute",
							top                 : "0",
							left                : "0",
							width               : this.props.percent + "%",
							height              : "100%",
						}}/>
					)
				}
			</div>
		);
	}
}

export default Player;
