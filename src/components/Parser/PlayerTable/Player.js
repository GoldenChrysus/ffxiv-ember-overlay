import React from "react";

import PlayerProcessor from "../../../processors/PlayerProcessor";
import LocalizationService from "../../../services/LocalizationService";
import Constants from "../../../constants/index";
import PercentBar from "../PercentBar";

class Player extends React.Component {
	render() {
		let player       = this.props.player;
		let player_type  = (player._is_current) ? "active" : "other";
		let job          = player.Job.toUpperCase() || "LMB";
		let table_type   = this.props.type;
		let is_raid      = (table_type === "raid");
		let columns      = [];
		let stat_columns = this.props.columns;

		if (is_raid) {
			let job_data = Constants.GameJobs[job];
			let role     = (job_data) ? job_data.role : "dps";

			stat_columns = stat_columns[role];
		}

		for (let key of stat_columns) {
			let value  = PlayerProcessor.getDataValue(key, player, this.props.players, this.props.encounter);
			let prefix = (is_raid) ? LocalizationService.getPlayerDataTitle(key, "short") + ": " : "";

			if (key === "enmity_percent") {
				columns.push(<div className="column" key={key}><PercentBar percent={value}/></div>);
			} else {
				columns.push(
					<div className="column" key={key}><span>{prefix}</span>{value}</div>
				);
			}
		}

		let name_blur   = (this.props.blur) ? "blur" : "";
		let icon_blur   = (this.props.blur && this.props.icon_blur) ? "blur" : "";
		let icon_style  = (icon_blur) ? { WebkitFilter: "blur(4px)" } : {};
		let icon        = <div className="column" key="player-data-icon"><img src={"img/icons/jobs/" + job + ".png"} className={"icon " + icon_blur} style={icon_style} alt={job + " icon"}></img></div>;
		let player_name = PlayerProcessor.getDataValue("name", player);

		if (this.props.short_names !== "no_short") {
			player_name = PlayerProcessor.getShortName(player_name, this.props.short_names);
		}

		let name       = <div className={"column " + name_blur} key="player-data-name">{player_name}</div>;
		let playerData = () => {
			if (!is_raid) {
				return [
					icon,
					name
				];
			}

			return (
				<div className="player-data">
					{icon}
					{name}
				</div>
			);
		};
		let statData   = () => {
			if (!is_raid) {
				return columns;
			}


			return(
				<div className="stat-data">
					{columns}
				</div>
			);
		};
		let percentBar = () => {
			if (!this.props.percent_bars) {
				return "";
			}

			return (
				<div className="percent-bar" key={"percent-bar-" + player_name} style={{
					backgroundSize      : "0% 100%",
					backgroundRepeat    : "no-repeat",
					backgroundPositionY : "1px",
					position            : "absolute",
					top                 : "0",
					left                : "0",
					width               : "0",
					height              : "0"
				}}></div>
			);
		};

		return (
			<div className={"row player " + player_type} data-job={job} key={"player-" + player_name} data-percent={this.props.percent} onClick={this.props.onClick}>
				{playerData()}
				{statData()}
				{percentBar()}
			</div>
		);
	}
}

export default Player;