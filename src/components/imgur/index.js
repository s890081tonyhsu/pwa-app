// import 'babel-polyfill';
import { h, Component } from 'preact';
import { 	Grid,
			Col,
			Thumbnail,
			Input,
			Modal,
			ModalTrigger,
			Image,
			Button,
			ButtonToolbar } from 'amazeui-react';
import XMLHttpRequestPromise from 'xhr-promise';
import thumbnails from 'imgur-thumbnails';

const xhrPromise = new XMLHttpRequestPromise();
let options = {
	'method': 'GET',
	'url': 'https://api.imgur.com/3/gallery/search/?q=',
	'headers': {
		'Authorization': 'Client-ID d5341581181e338'
	},
	'data': ''
};

export default class Imgur extends Component {
	constructor(props) {
		super(props);
		console.log(this.props.db);
		this.state = {
			isLoading: false,
			data: [],
			keyword: '',
			pos: -1,
			favorite: []
		};
	}
	componentDidMount() {
		this.props.db.getPouchDocs().then(favorite => {
			console.log(favorite);
			this.setState({favorite});
		})
	}
	onChange(e) {
		this.setState({
			keyword: e.target.value
		});
	}
	onSelected(pos) {
		this.setState({
			pos
		});
	}
	handleClick() {
		if (this.state.isLoading) return;
		this.setState({
			isLoading: true
		});
		let myoption = JSON.parse(JSON.stringify(options));
		myoption.url += this.state.keyword;
		xhrPromise.send(myoption).then(results => {
			if (results.status !== 200)
				throw new Error('request failed');
			console.log(results);
			let list = results.responseText.data.map(item => {
				let res = {};
				let date = new Date(item.datetime);
				res.id = item.id;
				if (item.is_album) res.img = item.images[0].link;
				else res.img = item.link;
				res.thumbnail = thumbnails.small(thumbnails.original(res.img));
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
	handleFavorite(imgurId) {
		this.setState({
			isLoading: true
		});
		let favorite_key = [];
		console.log(this.state.favorite);
		if (this.state.favorite && this.state.favorite.length !== 0)
			favorite_key = this.state.favorite.map(f => f.imgurId);
		if (favorite_key.indexOf(imgurId) === -1) {
			this.props.db.addPouchDoc(imgurId, this.state.keyword)
				.then(favorite => {
					console.log(favorite);
					this.setState({isLoading: false, favorite});
				});
		} else {
			let idx = this.state.favorite[favorite_key.indexOf(imgurId)]['_id'];
			this.props.db.delPouchDoc(idx)
				.then(favorite => {
					console.log('fav: ' + favorite);
					this.setState({isLoading: false, favorite});
				});
		}

	}
	render() {
		let favorite_key = [];
		if (this.state.favorite && this.state.favorite.length !== 0)
			favorite_key = this.state.favorite.map(f => f.imgurId);
		console.log(favorite_key);
		let modal = (
		<Modal title={this.state.pos === -1 ? "" : this.state.data[this.state.pos].title}
				onClose={e => this.setState({pos: -1})}>
			<Image
				src={this.state.pos === -1 ? "" : this.state.data[this.state.pos].img}
				style="width: 100%"
				/>
		</Modal>);
		return (
			<div class="am-container">
				<div class="am-g">
					<div className="am-u-sm-12 am-u-sm-centered">
						<Input type='text' value={this.state.keyword} onChange={this.onChange.bind(this)}
							btnAfter={<button
								className={this.state.isLoading ? "am-btn am-btn-default" : "am-btn am-btn-primary"}
								disabled={this.state.isLoading}
								onClick={e => this.handleClick()}>
								{this.state.isLoading ? "讀取中" : "取得"}
							</button>} />
					</div>
				</div>
				<Grid>
					{this.state.data.map((item, index) => <Col sm={12} md={6} lg={3}>
						<Thumbnail
						// style="height: 100px;width: auto;"
						caption={<div>
							<h3>{item.title}</h3>
							<p>{item.desc}</p>
							<ButtonToolbar>
								<Button amStyle="default"
									onClick={e => this.onSelected(index)}>
									查看全圖
								</Button>
								<Button amStyle={favorite_key.indexOf(item.id) !== -1 ? "danger" : "primary"}
									disabled={this.state.isLoading}
									onClick={e => this.handleFavorite(item.id)}>
									{favorite_key.indexOf(item.id) !== -1 ? "取消最愛" : "加到最愛"}
								</Button>
							</ButtonToolbar>
						</div>}
						src={item.thumbnail}/>
					</Col>)}
				</Grid>
				<ModalTrigger
					modal={modal}
					show={this.state.pos !== -1}
					onClose={e => this.setState({pos: -1})}
					/>
			</div>
		);
	}
}