import React, {useCallback, useState} from 'react';
import {Button, Text, View} from 'react-native';
import useLogin from '../hooks/use-login';

import database from '@react-native-firebase/database';

type Data = {body: {item: {name: string}}};

const SurroundRepriseMain = (authToken: {authToken: string}) => {
  const {state} = useLogin();
  var SpotifyWebApi = require('spotify-web-api-node');
  var spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(state.auth.token);

  const [isBitch, setIsBitch] = useState(true);

  const [playing, setPlaying] = useState(false);
  const [songID, setSongID] = useState(0);
  const [playedTimestamp, setPlayedTimestamp] = useState(0);
  const [songName, setSongName] = useState<string>('loading...');
  const [progress, setProgress] = useState(0);


  database()
    .ref('/session/paused')
    .on('value', snapshot => {
      setPlaying(snapshot.val());
    });

  database()
    .ref('/session/song_id')
    .on('value', snapshot => {
      setSongID(snapshot.val());
    });

  database()
    .ref('/session/timestamp')
    .on('value', snapshot => {
      setPlayedTimestamp(snapshot.val());
    });

    database()
    .ref('/session/song_name')
    .on('value', snapshot => {
      setSongName(snapshot.val());
    });

    database()
    .ref('/session/progress_ms')
    .on('value', snapshot => {
      setProgress(snapshot.val());
    });


  const setState = useCallback(() => {
    spotifyApi.getMyCurrentPlaybackState().then(
      function (data) {
        console.log('succ');
        console.log('paused: ' + data.body.is_playing);
        console.log('here we go: ' + data.body.item.name);
        database().ref('/session').set({
          song_name: data.body.item.name ?? 'empty',
          paused: data.body.is_playing ?? 'empty',
          song_id: data.body.item.id ?? 'empty',
          timestamp: data.body.timestamp ?? 'empty',
          progress_ms: data.body.progress_ms ?? 'empty',
        });
      },
      function (err) {
        console.log(err);
      },
    );
  }, []);

  if (songName === 'loading...') {
    spotifyApi.getMyCurrentPlayingTrack().then(function (data: Data) {
      console.log(data.body.item.name);
      setSongName(data.body.item.name);
    });
  }

  return (
    <View style={{padding: 50, backgroundColor: '#ffffff'}}>
      <Text>{'song: ' + songName + ' -- playing: ' + playing + ' -- seconds in: ' + (progress / 1000)}</Text>
      <Button
        title="hello there!"
        onPress={() => {
          spotifyApi.play();
        }}
      />
      <Button
        title="General Kenobi!"
        onPress={() => {
          spotifyApi.pause();
        }}
      />
      <View style={{padding: 40}}>
        <Text>{'check: ' + isBitch}</Text>
        <Button
          title={'Become lead'}
          onPress={() => {
            setIsBitch(false);
          }}
        />
        <Button
          title={'become bitch'}
          onPress={() => {
            setIsBitch(true);
          }}
        />
      </View>
      <Button title={'Set State'} onPress={() => setState()} />
    </View>
  );
};

export default SurroundRepriseMain;
