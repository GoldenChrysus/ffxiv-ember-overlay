import React from "react";
import { connect } from "react-redux";

import LocalizationService from "../../services/LocalizationService";

import Monster from "./AggroTable/Monster";
import OverlayInfo from "./PlayerTable/OverlayInfo";

class AggroTable extends React.Component {
	render() {
		const header      = [
			<div className='column' key='icon'></div>,
		];
		const rows        = [];
		const player_blur = (this.props.player_blur);
		const short_names = this.props.table_settings.general.table.short_names;
		const columns     = [
			"Name",
			"health_percent",
			"CurrentHP",
			"player_Name",
		];
		const monsters    = (!this.props.encounter.Combatant || this.props.overlayplugin_author !== "ngld") ? [] : this.props.monsters;

		for (const key of columns) {
			const title = LocalizationService.getMonsterDataTitle(key, "short");

			if (key === "player_Name") {
				header.push(
					<div className='column icon' key='job-icon'></div>,
				);
			}

			header.push(
				<div className='column' key={key}>{title}</div>,
			);
		}

		for (const monster of monsters) {
			monster._is_current = (monster.Target && monster.Target.isMe);

			const blur = (player_blur && !monster._is_current);

			rows.push(
				<Monster key={monster.ID} monster={monster} columns={columns} blur={blur} icon_blur={this.props.icon_blur} short_names={short_names} encounter={this.props.encounter}/>,
			);
		}

		const overlay_info = (this.props.collapsed || (this.props.monsters && this.props.monsters.length)) ? "" : <OverlayInfo/>;

		return (
			<React.Fragment>
				<div id='player-table' className='monster-table' ref='aggro_table'>
					<div className='row header'>
						{header}
					</div>
					{rows}
				</div>
				{overlay_info}
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => ({
	encounter            : state.internal.game,
	overlayplugin_author : state.internal.overlayplugin_author,
	player_blur          : state.settings.intrinsic.player_blur,
	icon_blur            : state.settings.interface.blur_job_icons,
	table_settings       : state.settings.table_settings,
	collapsed            : state.settings.intrinsic.collapsed,
});

export default connect(mapStateToProps)(AggroTable);
