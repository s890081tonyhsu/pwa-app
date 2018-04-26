import { h, Component } from 'preact';
import { Gallery } from 'amazeui-react';
import XMLHttpRequestPromise from 'xhr-promise';

const xhrPromise = new XMLHttpRequestPromise();
let options = {
  'method': 'GET',
  'url': 'https://api.imgur.com/3/gallery/search/?q=cats',
  'headers': {
	'Authorization': 'Client-ID d5341581181e338'
  },
  'data': ''
};

export default class Imgur extends Component {
	constructor() {
		super();
		this.state = {
			isLoading: false,
			data: []
		};
	}
	handleClick() {
		if (this.state.isLoading) return;
		this.setState({
			isLoading: true
		});
		xhrPromise.send(options).then(results => {
			if (results.status !== 200)
				throw new Error('request failed');
			console.log(results);
			let list = results.responseText.data.map(item => {
				let res = {};
				let date = new Date(item.datetime);
				if(item.is_album) res.img = item.images[0].link;
				else res.img = item.link;
				res.title = item.title;
				res.desc = date.toLocaleDateString("zh-TW");
				return res;
			});
			this.setState({
				isLoading: false,
				data: list
			});
		});
	}
	render() {
		return (
			<div class="am-container">
				<div class="am-g">
					<div className="am-u-sm-3 am-u-sm-centered">
						<button
							className={this.state.isLoading ? "am-btn am-btn-default" : "am-btn am-btn-primary"}
							disabled={this.state.isLoading}
							onClick={e => this.handleClick()}>
							{this.state.isLoading ? "讀取中" : "取得貓圖"}
						</button>
					</div>
				</div>
				<Gallery data={this.state.data} />
			</div>
		);
	}
}