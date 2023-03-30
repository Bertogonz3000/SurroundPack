import React, {useCallback, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
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
  const [songName, setSongName] = useState<string>('loading...');
  const [progress, setProgress] = useState(0);
  const [songURI, setSongURI] = useState('');
  const [timeOfSet, setTimeOfSet] = useState(0);

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
    .ref('/session/song_name')
    .on('value', snapshot => {
      setSongName(snapshot.val());
    });

  database()
    .ref('/session/progress_ms')
    .on('value', snapshot => {
      setProgress(snapshot.val());
    });

  database()
    .ref('/session/song_uri')
    .on('value', snapshot => {
      setSongURI(snapshot.val());
    });

  database()
    .ref('/session/time_of_set')
    .on('value', snapshot => {
      setTimeOfSet(snapshot.val());
    });

  const playTest = useCallback(() => {
    spotifyApi.play({uris: ['spotify:track:0ujnucfkB1PrSYXWCBS1q0']}).then(
      function (data) {
        console.log('played');
      },
      function (err) {
        console.log(err);
      },
    );
  }, []);

  const setState = useCallback(() => {
    spotifyApi.getMyCurrentPlaybackState().then(
      function (data) {
        console.log('succ');
        console.log('paused: ' + data.body.is_playing);
        console.log('here we go: ' + data.body.item.name);
        const d = new Date();
        const newSetTime = d.getTime();
        database()
          .ref('/session')
          .set({
            song_name: data.body.item.name ?? 'empty',
            paused: data.body.is_playing ?? 'empty',
            song_id: data.body.item.id ?? 'empty',
            progress_ms: data.body.progress_ms ?? 'empty',
            song_uri: data.body.item.uri ?? 'empty',
            time_of_set: newSetTime,
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

  if (isBitch) {
    spotifyApi.getMyCurrentPlaybackState().then(
      function (data) {
        if (!data.body.is_playing && !playing) {
          const d = new Date();
          const currentTime = d.getTime();
          const timeSinceSet = currentTime - timeOfSet;
          spotifyApi.play({
            uris: [songURI],
            position_ms: progress + timeSinceSet + 600,
          });
        } else if (data.body.is_playing && playing) {
          spotifyApi.pause();
        }
      },
      function (err) {
        console.log(err);
      },
    );
  }

  return (
    <View style={{padding: 50, backgroundColor: '#111111'}}>
      <Text style={styles.textColor}>
        {'song: ' +
          songName +
          ' -- playing: ' +
          playing +
          ' -- seconds in: ' +
          progress / 1000 +
          ' -- uri: ' +
          songURI}
      </Text>
      <Button
        title="hello there!"
        onPress={() => {
          spotifyApi.play();
          if (!isBitch) {
            setState();
          }
        }}
      />
      <Button
        title="General Kenobi!"
        onPress={() => {
          spotifyApi.pause();
          if (!isBitch) {
            setState();
          }
        }}
      />
      <View style={{padding: 40}}>
        <Text style={styles.textColor}>{'check: ' + isBitch}</Text>
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
      <Button title={'play hardcoded song'} onPress={() => playTest()} />
    </View>
  );
};

export default SurroundRepriseMain;

const styles = StyleSheet.create({textColor: {color: 'white'}});
