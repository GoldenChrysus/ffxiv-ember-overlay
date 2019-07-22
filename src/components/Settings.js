import React from "react";
import { HashRouter as Router, Route, Redirect, NavLink } from "react-router-dom";
import { Grid, Menu } from "semantic-ui-react";

import About from "./Settings/About";

import "./../styles/components/settings/settings-dark.less";

class Settings extends React.Component {
	render() {
		let base_url = this.props.match.url;

		return (
			<React.Fragment>
				<Router>
					<Grid celled id="settings-container">
						<Grid.Row>
							<Grid.Column width={3} id="settings-sidebar">
								<Menu vertical id="settings-menu">
									<NavLink to={base_url + "/interface"} className="item">Interface</NavLink>
									<NavLink to={base_url + "/player-table"} className="item">Player Table</NavLink>
									<NavLink to={base_url + "/raid-view"} className="item">Raid View</NavLink>
									<NavLink to={base_url + "/custom-css"} className="item">Custom CSS</NavLink>
									<NavLink to={base_url + "/about"} className="item">About</NavLink>
								</Menu>
							</Grid.Column>
							<Grid.Column width={13}>
								<Route exact path={base_url} render={() => (
									<Redirect to={base_url + "/about"}/>
								)}/>
								<Route path={base_url + "/about"} component={About}/>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Router>
			</React.Fragment>
		);
	}
}

export default Settings;