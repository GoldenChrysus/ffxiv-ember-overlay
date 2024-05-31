import React from "react";
import { connect } from "react-redux";

import "./../styles/components/parser/parser-theme.less";

import Container from "./Parser/Container";
import Placeholder from "./Parser/Placeholder";
import { updateToggle } from "../redux/actions";

class Parser extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			collapsed_modes : {
				stats  : false,
				spells : false,
			},
			always_visible : {
				spells : true,
			},
			minimized_last_activity : 0,
		};
	}

	UNSAFE_componentWillMount() {
		window.parser = true;

		this.setState({
			visible : true,
		});

		setInterval(this.processAutoHide.bind(this), 2000);
	}

	componentDidUpdate() {
		if (this.props.mode === "spells") {
			if (this.props.has_spells !== this.state.collapsed_modes.spells) {
				this.setState({
					collapsed_modes : {
						...this.state.collapsed_modes,
						spells : this.props.has_spells,
					},
				});
			}
		}
	}

	processAutoHide() {
		let visible = true;

		if (this.props.auto_hide === "disabled" || this.state.always_visible[this.props.mode]) {
			return;
		}

		if (this.props.auto_hide && this.props.auto_hide_delay > 0 && ((new Date().getTime() / 1000) - this.props.last_activity) > this.props.auto_hide_delay) {
			visible = false;
		}

		if (!visible) {
			if (this.props.auto_hide === "hide") {
				if (this.state.visible !== visible) {
					this.setState({
						visible,
						last_activity : this.props.last_activity,
					});
				}
			} else if (this.props.auto_hide.startsWith("minimize_")) {
				const location = this.props.auto_hide.substring(9);

				if (!this.props.toggles[location] && this.props.last_activity !== this.state.minimized_last_activity) {
					this.setState({ minimized_last_activity : this.props.last_activity });
					this.props.autoHideMinimize(location);
				}
			}
		}
	}

	render() {
		const is_spells        = (this.props.mode === "spells");
		const collapsed        = ((!is_spells && this.props.collapsed && this.props.viewing === "tables") || this.state.collapsed_modes[this.props.mode]);
		const collapse_down    = this.shouldCollapseDown(is_spells);
		let root_inner_classes = [];
		const opacity          = this.props.opacity / 100;
		const zoom             = this.props.zoom / 100;
		const font_size        = (14 * (this.props.text_scale / 100));
		const context_zoom     = 1 / zoom;
		const display          = (this.state.visible) ? "block" : "none";
		const max_width        = (this.props.footer_dps) ? "325" : "0";
		const setting_style    = `
			html {
				font-size: ${font_size}px;
			}

			body {
				zoom: ${zoom};
				display: ${display};
			}

			.container-context-menu {
				zoom: ${context_zoom};
			}

			.container-context-menu .item-group {
				zoom: ${zoom};
			}

			#container {
				opacity: ${opacity};
			}

			.resizeHandle {
				background-image: url("img/handle.png");
			}

			@media screen and (max-width: ${max_width}px) {
				#container #inner #footer #role-links,
				#container #inner #footer #footer-actions {
					width: 100%;
					float: none;
					text-align: center;
				}
			}
		`;

		if (collapsed) {
			if (!is_spells || !this.props.using_ui_builder) {
				root_inner_classes.push("auto-height");
			}

			if (collapse_down) {
				root_inner_classes.push("down");
			}

			if (is_spells && this.props.invert_spells_horizontal) {
				root_inner_classes.push("right");
			}
		}

		root_inner_classes = root_inner_classes.join(" ");

		return (
			<React.Fragment key='parser-fragment'>
				<style type='text/css'>
					{setting_style}
					{this.props.css}
				</style>
				<Placeholder location='top_left' theme={this.props.theme}/>
				<Placeholder location='top_right' theme={this.props.theme}/>
				<Placeholder location='bottom_left' theme={this.props.theme}/>
				<Placeholder location='bottom_right' theme={this.props.theme}/>
				<div id='root-inner' key='root-inner' className={root_inner_classes}>
					<Container key='container-component'/>
				</div>
			</React.Fragment>
		);
	}

	shouldCollapseDown(is_spells) {
		return ((!is_spells && this.props.collapse_down) || (is_spells && this.props.invert_spells_vertical));
	}
}

const mapDispatchToProps = dispatch => ({
	autoHideMinimize(location) {
		dispatch(updateToggle({ location, enabled : true }));
	},
});

const mapStateToProps = state => ({
	collapsed                : state.settings.intrinsic.collapsed,
	collapse_down            : state.settings.interface.collapse_down,
	viewing                  : state.internal.viewing,
	css                      : state.settings.custom.css || "",
	opacity                  : state.settings.interface.opacity,
	zoom                     : state.settings.interface.zoom,
	text_scale               : state.settings.interface.text_scale,
	theme                    : state.settings.interface.theme,
	auto_hide                : state.settings.interface.auto_hide,
	auto_hide_delay          : state.settings.interface.auto_hide_delay,
	last_activity            : (state.settings.interface.auto_hide) ? state.last_activity : 0,
	footer_dps               : state.settings.interface.footer_dps,
	mode                     : state.internal.mode,
	invert_spells_vertical   : state.settings.spells_mode.invert_vertical,
	invert_spells_horizontal : state.settings.spells_mode.invert_horizontal,
	has_spells               : (Object.keys(state.internal.spells.in_use).length > 0),
	using_ui_builder         : state.settings.spells_mode.ui.use,
	toggles                  : state.internal.toggles,
});

export default connect(mapStateToProps, mapDispatchToProps)(Parser);
