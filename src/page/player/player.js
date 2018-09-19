import React, { Component } from 'react';
import {NavLink} from 'react-router-dom'
import $ from 'jquery';
// import jPlayer from 'jplayer';
import Progress from '../../component/progress.js'
import './player.css'
import Pubsub from 'pubsub-js'

let duration = null; // 音频总时长
class Player extends Component {
	constructor(props) {
		super(props);
		this.state = {
			progress: 0, // 进度
			volume: 0, // 音量
			isPlay: true, // 播放
			leftTime: '' // 剩余时间
		}
	}
	render() {
		return (
			<div className="player-page">
				<h1 className="caption">
					<NavLink to="/list" activeClassName="active">音乐库 &gt;</NavLink>
				</h1>
				<div className="music-box">
					<div className="controll-wrapper">
						<h2 className="music-title">{this.props.currentMusicItem.title}</h2>
						<h3 className="music-artist">{this.props.currentMusicItem.artist}</h3>
						<div className="music-function">
							<div className="surplus-time">-{this.state.leftTime}</div>
							<div className="music-voice">
								声音: 
								<div className="voice">
									<Progress
										progress={this.state.volume}
										onProgressChange={this.changeVolumeHanler}
										barColor="#aaa"
									></Progress>
								</div>
							</div>
						</div>
						<div className="music-progress">
							<Progress
								progress={this.state.progress}
								onProgressChange={this.progressChangeHandler}
								barColor="green"
							></Progress>
						</div>
						<div className="play-part">
							<span className="music-prve" onClick={this.playPrev}>
								上一首
							</span>
							<span 
								className={`music-play ${this.state.isPlay ? 'pause' : 'play'}`}
								onClick={this.isPlay}
								>{this.state.isPlay ? '暂停' : '播放'}</span>
							<span className="music-next" onClick={this.playNext}>下一首</span>
							<span>循环</span>
						</div>
					</div>
					<div className="right-wrapper">
						<img src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title} />
					</div>
				</div>
			</div>
			
		)
	}
	formatTime(time) {
		time = Math.floor(time);
		let miniutes = Math.floor(time / 60); // 分钟
		let seconds = Math.floor(time % 60); // 秒
		seconds = seconds < 10 ? `0${seconds}` : seconds;
		return `${miniutes}:${seconds}`
	}
	playPrev() {
		Pubsub.publish('PLAY_PREV')
	}
	playNext() {
		Pubsub.publish('PLAY_NEXT');
	}
	isPlay = () => {
		if(this.state.isPlay) {
			$('#jPlayer').jPlayer('pause');
		} else {
			$('#jPlayer').jPlayer('play');
		}
		this.setState({
			isPlay: !this.state.isPlay
		})
	}
	changeVolumeHanler(progress) {
		$('#jPlayer').jPlayer('volume', progress)
	}
	progressChangeHandler(progress) {
		$('#jPlayer').jPlayer('play', duration * progress)
	}
	componentDidMount() {
		$('#jPlayer').bind($.jPlayer.event.timeupdate, (e) => {
	      duration = e.jPlayer.status.duration;
	      this.setState({
	      	volume: e.jPlayer.options.volume * 100,
	        progress: Math.round(e.jPlayer.status.currentPercentAbsolute),
	        leftTime: this.formatTime(duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100))
	      })
	    })
	}
	componentWillUnmount() {
		$('#jPlayer').unbind($.jPlayer.event.timeupdate)
	}
}

export default Player;