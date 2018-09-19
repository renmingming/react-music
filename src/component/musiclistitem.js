import React, {Component} from 'react';
import './musiclistitem.css';
import Pubsub from 'pubsub-js'

class MusicListItem extends Component{
	// constructor(props) {
	// 	super(props);
	// }
	render() {
		let musicItem = this.props.musicItem;
		return (
			<li onClick={this.playMusic.bind(this, musicItem)} className={`musicListItem ${this.props.focus ? 'active' : ''}`}>
				<p>{musicItem.title} - {musicItem.artist}</p>
				<span onClick={this.deleteMusic.bind(this, musicItem)} className="delete">*</span>
			</li>
		)
	}
	playMusic(musicItem){
		Pubsub.publish('PLAY_MUSIC', musicItem)
	}
	deleteMusic(musicItem, e){
		e.stopPropagation();
		// 派发事件
		Pubsub.publish('DELETE_MUSIC', musicItem)
	}
}

export default MusicListItem;