import React from "react";
import { connect } from "react-redux";
import { ContextMenuTrigger } from "react-contextmenu";
import ReactTooltip from "react-tooltip";
import { Rnd } from "react-rnd";
import clone from "lodash.clonedeep";
import isEqual from "lodash.isequal";
import { updateSetting } from "../../redux/actions/index";

import EmberComponent from "../EmberComponent";
import ContextMenu from "./Container/Menu";
import Import from "./Container/Import";
import GameState from "./GameState";
import PlayerTable from "./PlayerTable";
import PlayerDetail from "./PlayerDetail";
import Footer from "./Footer";
import PlaceholderToggle from "./Placeholder/Toggle";
import AggroTable from "./AggroTable";
import SpellGrid from "./SpellGrid";

import SpellService from "../../services/SpellService";
import TTSService from "../../services/TTSService";
import LocalizationService from "../../services/LocalizationService";

class Container extends EmberComponent {
	constructor(props) {
		super(props);

		this.timer           = null;
		this.no_footer_modes = [
			"spells"
		];

		this.mounted = false;
		this.state   = {
			locked          : true,
			spells_sections : this.props.spells_sections,
			spells          : (new Date()).getTime()
		};
	}

	componentDidUpdate(prev_props) {
		let need_state = false;
		let state      = {};

		if (this.processSpellSectionProps(state)) {
			need_state = true;
		}

		if (prev_props.mode !== this.props.mode) {
			this.stopAll();

			if (this.props.mode === "spells") {
				need_state = true;

				state.spells = (new Date()).getTime();

				this.startSpells();
			} else if (this.props.mode === "stats") {
				this.startStats();
			}
		} else if (this.props.mode === "spells") {
			this.setSpellsSettings();

			let new_spells      = false;
			let lost_spells     = false;
			let changed_default = false;

			for (let i in this.props.spells_in_use) {
				if (
					!prev_props.spells_in_use[i] ||
					prev_props.spells_in_use[i].time < this.props.spells_in_use[i].time ||
					!SpellService.hasDefaultedSpell(i, this.props.spells_in_use[i])
				) {
					if (!new_spells) {
						new_spells = {};
					}

					new_spells[i] = this.props.spells_in_use[i];
				} else if (
					prev_props.spells_in_use[i].defaulted !== this.props.spells_in_use[i].defaulted ||
					prev_props.spells_in_use[i].type_position !== this.props.spells_in_use[i].type_position
				) {
					if (!changed_default) {
						changed_default = {};
					}

					changed_default[i] = {
						defaulted : this.props.spells_in_use[i].defaulted,
						position  : this.props.spells_in_use[i].type_position
					};
				}
			}

			for (let i in prev_props.spells_in_use) {
				if (!this.props.spells_in_use[i]) {
					if (!lost_spells) {
						lost_spells = {};
					}

					lost_spells[i] = true;
				}
			}

			if (new_spells || lost_spells || changed_default) {
				need_state = true;

				SpellService.processSpells(new_spells || {}, lost_spells || {}, changed_default || {});

				state.spells = (new Date()).getTime();
			}
		}

		if (need_state) {
			this.setState(state);
		}
	}

	componentDidMount() {
		if (this.props.mode === "stats") {
			this.startStats();
		} else if (this.props.mode === "spells") {
			SpellService.processSpells(this.props.spells_in_use);
			this.startSpells();

			this.setState({
				spells : (new Date()).getTime()
			});
		}

		document.addEventListener("onOverlayStateUpdate", this.toggleHandle.bind(this));
		this.props.plugin_service.subscribe();

		this.mounted = true;
	}

	clearTimer() {
		if (this.timer !== null) {
			clearInterval(this.timer);

			this.timer = null;
		}
	}

	startStats() {
		TTSService.start();
	}

	startSpells() {
		this.setSpellsSettings();

		this.timer = setInterval(
			() => {
				if (!SpellService.updateCooldowns()) {
					return;
				}

				this.setState({
					spells : (new Date()).getTime()
				});
			},
			250
		);
	}

	stopAll() {
		this.clearTimer();
		TTSService.stop();
		SpellService.stop();
	}

	setSpellsSettings() {
		SpellService.setSettings(
			this.props.spells_settings.use_tts,
			this.props.spells_settings.party_use_tts,
			this.props.spells_settings.tts_trigger,
			this.props.spells_settings.warning_threshold,
			this.props.spells_settings.tts_on_effect,
			this.props.spells_settings.party_tts_on_effect,
			this.props.spells_settings.party_tts_on_skill
		);
	}

	render() {
		let encounter = this.props.encounter || {};
		let active    = (["true", true].indexOf(this.props.encounter_active) !== -1);
		let viewing   = this.props.viewing;

		let content;

		switch (this.props.mode) {
			case "stats":
				switch (viewing) {
					case "tables":
						if (this.props.table_type !== "aggro") {
							content = <PlayerTable key="player-table-component" players={this.props.combatants} encounter={encounter} type={this.props.table_type}/>;
						} else {
							content = <AggroTable monsters={this.props.aggro}/>
						}

						break;

					case "player":
						content = <PlayerDetail player={this.props.detail_player} players={this.props.combatants} encounter={encounter}/>;

						break;

					case "import":
						content = <Import/>;

						break;

					default:
						break;
				}

				break;

			case "spells":
				switch (viewing) {
					case "import":
						content = <Import/>;

						break;

					default:
						let settings        = this.props.spells_settings;
						let invert_vertical = settings.invert_vertical;

						if (this.props.spells_settings.ui.use) {
							content = [];

							for (let uuid in this.props.spells_sections) {
								let section = this.state.spells_sections[uuid];

								if (!section) {
									continue;
								}

								let section_settings = clone(settings);
								let layout           = section.layout;

								if (layout.spells_per_row !== -1) {
									section_settings.spells_per_row = layout.spells_per_row;
								}
								
								if (layout.layout !== "default") {
									section_settings.layout = layout.layout;
								}

								section_settings.uuid = uuid;

								if (this.props.ui_builder) {
									if (this.state.locked) {
										content.push(
											<Rnd key={"spell-grid-rnd-" + uuid} bounds="body" minWidth={100} minHeight={100} resizeGrid={[10, 10]} dragGrid={[10, 10]} position={{x : layout.x, y : layout.y}} size={{width : layout.width, height : layout.height}} onDragStop={this.onDrag.bind(this, uuid)} onResizeStop={this.onResize.bind(this, uuid)}>
												<SpellGrid key={"spell-grid-" + uuid} from_builder={true} is_draggable={true} section={section} encounter={encounter} spells={this.state.spells} settings={section_settings} style={{position: "absolute", width: "100%", height: "100%"}}/>
											</Rnd>
										);
									} else {
										content =
											<div id="lock-warning">
												<span>{LocalizationService.getMisc("please_lock")}</span>
											</div>;

										break;
									}
								} else {
									let spells = SpellService.filterSpells(section, section_settings, true);
									let css    = {position: "absolute", top: layout.y + "px", left: layout.x + "px", width: layout.width + "px", maxHeight: layout.height + "px"};

									if (invert_vertical) {
										css.height = layout.height + "px";
									}

									content.push(
										<SpellGrid key={"spell-grid-" + uuid} from_builder={true} section={section} encounter={encounter} spells={spells} settings={section_settings} style={css}/>
									);
								}
							}
						} else {
							let spells = SpellService.filterSpells({}, settings, false);

							content = <SpellGrid key="spell-grid" encounter={encounter} spells={spells} settings={this.props.spells_settings}/>;
						}

						break;
				}

				break;

			default:
				break;
		}

		let footer = [];

		if (
			this.no_footer_modes.indexOf(this.props.mode) === -1 && 
			(
				!this.props.collapsed ||
				viewing !== "tables" ||
				this.props.footer_when_collapsed
			)
		) {
			footer = [
					<div className="split" key="above-footer-split"></div>,
					<Footer key="parser-footer"/>
			];
		}

		let container_classes = [];

		if (this.props.ui_builder && this.props.spells_settings.ui.use) {
			container_classes.push("ui-builder-active");
		}

		return (
			<React.Fragment key="container-fragment">
				<ContextMenuTrigger key="right-click-menu" id="right-click-menu" holdToDisplay={-1}>
					<div id="container" className={container_classes.join(" ")} key="container">
						<PlaceholderToggle type="top left"/>
						<PlaceholderToggle type="top right"/>
						<PlaceholderToggle type="bottom left"/>
						<PlaceholderToggle type="bottom right"/>
						<div id="inner" key="inner">
							{this.getGameState(encounter, active)}
							<div id="content" key="content">
								{content}
							</div>
							{footer}
							<ReactTooltip className="react-tooltip" effect="solid" multiline={false} place="left"/>
						</div>
					</div>
				</ContextMenuTrigger>
				<ContextMenu getUIData={this.getUIData.bind(this)}/>
			</React.Fragment>
		);
	}

	onDrag(uuid, e, data) {
		let state = clone(this.state);

		state.spells_sections[uuid].layout.x = Math.round(data.x / 10) * 10;
		state.spells_sections[uuid].layout.y = Math.round(data.y / 10) * 10;

		this.setState(state);
	}

	onResize(uuid, e, side, elem, delta, position) {
		let state = clone(this.state);

		state.spells_sections[uuid].layout.width  += delta.width;
		state.spells_sections[uuid].layout.height += delta.height;

		state.spells_sections[uuid].layout.width  = Math.round(state.spells_sections[uuid].layout.width / 10) * 10;
		state.spells_sections[uuid].layout.height = Math.round(state.spells_sections[uuid].layout.height / 10) * 10;
		state.spells_sections[uuid].layout.x      = Math.round(position.x / 10) * 10;
		state.spells_sections[uuid].layout.y      = Math.round(position.y / 10) * 10;

		this.setState(state);
	}

	getUIData() {
		return this.state.spells_sections;
	}

	getGameState(encounter, active) {
		if (this.props.mode === "spells" && (this.props.hide_top_bar || this.props.spells_settings.ui.use)) {
			return "";
		}

		return(
			<GameState encounter={encounter} active={active} rank={this.props.rank} show_rank={this.props.top_right_rank}/>
		);
	}

	toggleHandle(e) {
		let body = document.getElementsByTagName("body")[0];

		this.setState({
			locked : e.detail.isLocked
		});

		if (!e.detail.isLocked) {
			body.classList.add("resizeHandle");

			if (this.props.spells_settings.ui.use && this.props.mode === "spells") {
				body.classList.add("white-background");
			}
		} else {
			body.classList.remove("resizeHandle");

			if (this.props.spells_settings.ui.use || body.classList.contains("white-background")) {
				body.classList.remove("white-background");
			}
		}
	}

	processSpellSectionProps(state) {
		let need_state = false;
		let need_save  = false;

		// Only run if settings have been updated in the past 20 seconds.
		if ((((new Date()).getTime() - this.props.last_settings_update.getTime()) / 1000) > 20) {
			return need_state;
		}

		for (let uuid in this.props.spells_sections) {
			if (
				!this.state.spells_sections[uuid] || 
				this.state.spells_sections[uuid].layout.spells_per_row !== this.props.spells_sections[uuid].layout.spells_per_row ||
				this.state.spells_sections[uuid].layout.layout !== this.props.spells_sections[uuid].layout.layout ||
				!isEqual(this.state.spells_sections[uuid].types, this.props.spells_sections[uuid].types)
			) {
				need_state = true;

				state.spells_sections = this.props.spells_sections;

				break;
			}
		}

		if (!need_state) {
			for (let uuid in this.state.spells_sections) {
				if (!this.props.spells_sections[uuid]) {
					need_state = true;

					state.spells_sections = this.props.spells_sections;

					break;
				}
			}
		}

		if (need_state) {
			for (let uuid in state.spells_sections) {
				if (!this.state.spells_sections[uuid]) {
					continue;
				}

				if (
					state.spells_sections[uuid].layout.x !== this.state.spells_sections[uuid].layout.x ||
					state.spells_sections[uuid].layout.y !== this.state.spells_sections[uuid].layout.y ||
					state.spells_sections[uuid].layout.width !== this.state.spells_sections[uuid].layout.width ||
					state.spells_sections[uuid].layout.height !== this.state.spells_sections[uuid].layout.height
				) {
					state.spells_sections[uuid].layout.x      = this.state.spells_sections[uuid].layout.x;
					state.spells_sections[uuid].layout.y      = this.state.spells_sections[uuid].layout.y;
					state.spells_sections[uuid].layout.width  = this.state.spells_sections[uuid].layout.width;
					state.spells_sections[uuid].layout.height = this.state.spells_sections[uuid].layout.height;

					need_save = !this.props.ui_builder;
				}
			}
		}
		if (need_save) {
			let data = {
				key   : "spells_mode.ui.sections",
				value : state.spells_sections
			}

			setTimeout(() => { this.props.updateSetting(data); }, 50);
		}

		return need_state;
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateSetting : (data) => {
			dispatch(updateSetting(data));
		}
	}
};

const mapStateToProps = (state) => {
	return {
		plugin_service        : state.plugin_service,
		mode                  : state.internal.mode,
		encounter             : state.internal.game.Encounter,
		encounter_active      : state.internal.game.isActive,
		combatants            : state.internal.game.Combatant,
		collapsed             : state.settings.intrinsic.collapsed,
		footer_when_collapsed : state.settings.interface.footer_when_collapsed,
		rank                  : state.internal.rank,
		top_right_rank        : state.settings.interface.top_right_rank,
		viewing               : state.internal.viewing,
		table_type            : state.settings.intrinsic.table_type,
		detail_player         : state.internal.detail_player,
		aggro                 : state.internal.aggro,
		spells_sections       : state.settings.spells_mode.ui.sections,
		spells_in_use         : state.internal.spells.in_use,
		spells_settings       : state.settings.spells_mode,
		hide_top_bar          : state.settings.interface.hide_top_bar,
		ui_builder            : state.internal.ui_builder,
		last_settings_update  : state.internal.last_settings_update,
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);