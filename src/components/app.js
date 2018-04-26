import { h, Component } from 'preact';
import { Router } from 'preact-router';
import createHashHistory from 'history/createHashHistory';

import Header from './header';
import Home from './home';
// import Profile from './profile';
import Imgur from './imgur/imgur';

// <Profile path="/profile/" user="me" />
// <Profile path="/profile/:user" />

export default class App extends Component {
	constructor() {
		super();
		this.state = {
			pathname: '/'
		};
	}
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
		this.setState({
			pathname: e.url
		});
	};

	render() {
		return (
			<div id="app">
				<Header pathname={this.state.pathname} />
				<Router history={createHashHistory()} onChange={this.handleRoute}>
					<Home path="/" />
					<Imgur path="/imgur" />
				</Router>
			</div>
		);
	}
}
