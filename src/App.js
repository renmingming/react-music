import React, { Component } from 'react';
import './App.css'
import $ from 'jquery'
import Header from './component/Header.js'
import Player from './page/player/player.js'
import MusicList from './page/musiclist/index.js'
import {MUSIC_LIST} from './config/musiclist.js'
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom'
import Pubsub from 'pubsub-js'
import jPlayer from 'jplayer'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      musicList: MUSIC_LIST, // 列表
      currentMusicItem: MUSIC_LIST[0]  // 当前音乐
    }
  }
  render() {
    return (
      <Router>
        <div>
          <Header></Header>
          <div  style={{maxWidth: '750px', margin: '0 auto'}}>
            <Switch>
              <Route 
                path="/"
                exact 
                render={() => {
                  return (<Player currentMusicItem={this.state.currentMusicItem}></Player>)
                }}
                ></Route>
              <Route
                path="/list"
                render={() => {
                  return (
                    <MusicList
                      currentMusicItem={this.state.currentMusicItem}
                      musicList={this.state.musicList}
                    ></MusicList>
                    )
                }}
              ></Route>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
  playMusic(musicItem) {
    $('#jPlayer').jPlayer('setMedia', {
      mp3: musicItem.file
    }).jPlayer('play');

    this.setState({
      currentMusicItem: musicItem
    })
  }
  playNext(type = "next") {
    // 默认播放下一曲
    let index = this.findMusicIndex(this.state.currentMusicItem);
    let newIndex = null;
    let musicListLength = this.state.musicList.length;
    if(type === 'next') {
      newIndex = (index + 1) % musicListLength
      console.log(newIndex, index, musicListLength)
    } else {
      newIndex = (index - 1 + musicListLength) % musicListLength;
    }

    this.playMusic(this.state.musicList[newIndex]);
  }
  findMusicIndex(musicItem) {
    // 当前播发音乐在音乐列表的位置index
    return this.state.musicList.indexOf(musicItem)
  }
  componentDidMount() {
    $('#jPlayer').jPlayer({
      supplied: 'mp3',
      wmode: 'window'
    });
    this.playMusic(this.state.currentMusicItem);

    // 监听音乐播放完之后的会掉事件
    $("#jPlayer").bind($.jPlayer.event.ended, (e) => {
      this.playNext(); // 播放下一曲
    })

    // 接受事件
    Pubsub.subscribe('DELETE_MUSIC', (msg, musicItem) => {
      this.setState({
        musicList: this.state.musicList.filter(item => {
          return item !== musicItem;
        })
      })
    })
    Pubsub.subscribe('PLAY_MUSIC', (msg, musicItem) => {
      console.log(musicItem)
      this.playMusic(musicItem)
    })
    Pubsub.subscribe('PLAY_NEXT', (msg) => {
      this.playNext()
    })
    Pubsub.subscribe('PLAY_PREV', (msg) => {
      this.playNext('prev')
    })
  }
  componentWillUnmount() {
    Pubsub.unsubscribe('DELETE_MUSIC')
    Pubsub.unsubscribe('PLAY_MUSIC')
    Pubsub.unsubscribe('PLAY_NEXT')
    Pubsub.unsubscribe('PLAY_PREV')
    $("#jPlayer").unbind($.jPlayer.event.ended);
  }
}

export default App;
