import { h, Component } from 'preact';
import { Router } from 'preact-router';
import createHashHistory from 'history/createHashHistory';
import Notification from 'react-web-notification';
import { Store } from 'idb-keyval';

import Header from './header';
import Home from './home';
// import Profile from './profile';
import Imgur from './imgur';

// <Profile path="/profile/" user="me" />
// <Profile path="/profile/:user" />

export default class App extends Component {
	constructor() {
		super();
		this.state = {
			pathname: '/',
			ignore: true,
			title: ''
		};
	}
	data = new Store('pwaDB', 'favorite')
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
		this.setState({
			pathname: e.url
		});
	}

	handlePermissionGranted(){
		console.log('Permission Granted');
		this.setState({
			ignore: false
		});
	}

	handlePermissionDenied(){
		console.log('Permission Denied');
		this.setState({
			ignore: true
		});
	}

	handleNotSupported(){
		console.log('Web Notification not Supported');
		this.setState({
			ignore: true
		});
	}

	handleNotificationOnClick(e, tag){
		console.log(e, 'Notification clicked tag:' + tag);
	}

	handleNotificationOnError(e, tag){
		console.log(e, 'Notification error tag:' + tag);
	}

	handleNotificationOnClose(e, tag){
		console.log(e, 'Notification closed tag:' + tag);
	}

	handleNotificationOnShow(e, tag){
		console.log(e, 'Notification shown tag:' + tag);
	}

	pushNotify (title, options) {
		if (this.state.ignore) return;
		this.setState({
			title,
			options
		});
	}

	render() {
		return (
			<div id="app">
				<Notification
					ignore={this.state.ignore && this.state.title !== ''}
					notSupported={this.handleNotSupported.bind(this)}
					onPermissionGranted={this.handlePermissionGranted.bind(this)}
					onPermissionDenied={this.handlePermissionDenied.bind(this)}
					onShow={this.handleNotificationOnShow.bind(this)}
					onClick={this.handleNotificationOnClick.bind(this)}
					onClose={this.handleNotificationOnClose.bind(this)}
					onError={this.handleNotificationOnError.bind(this)}
					timeout={5000}
					title={this.state.title}
					options={this.state.options}
				/>
				<Header pathname={this.state.pathname} />
				<Router history={createHashHistory()} onChange={this.handleRoute}>
					<Home path="/" notify={this.pushNotify.bind(this)} db={this.data} />
					<Imgur path="/imgur" notify={this.pushNotify.bind(this)} db={this.data} />
				</Router>
			</div>
		);
	}
}
