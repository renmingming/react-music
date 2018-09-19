import React, {Component} from 'react'
import MusicListItem from '../../component/musiclistitem.js'

class MusicList extends Component {
	// constructor(props) {
	// 	super(props);
	// }
	render() {
		let listEle = null;
		listEle = this.props.musicList.map((item) => {
			return <MusicListItem
					focus={item === this.props.currentMusicItem}
					 key={item.id}
					 musicItem={item}
					 ></MusicListItem>
		})

		return (
			<ul>{listEle}</ul>
		)
	}
}

export default MusicList;