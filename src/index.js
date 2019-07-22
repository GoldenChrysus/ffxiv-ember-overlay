import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route } from "react-router-dom";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";

import "semantic-ui-less/semantic.less";
import "./index.css";

import * as serviceWorker from "./serviceWorker";

import Parser from "./components/Parser";
import Settings from "./components/Settings"

ReactDOM.render(
	<Router basename={process.env.REACT_APP_ROUTER_BASE}>
		<Provider store={store}>
			<Route exact path="/" component={Parser}/>
			<Route path="/settings" component={Settings}/>
		</Provider>
	</Router>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
