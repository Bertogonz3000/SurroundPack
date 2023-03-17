import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';
import useLogin from '/Users/bertogonz3000/SpotifyRNExample/your-music-rn/src/hooks/use-login';

type Data = {body: {item: {name: string}}};

const SurroundRepriseMain = (authToken: {authToken: string}) => {
  const {state} = useLogin();
  var SpotifyWebApi = require('spotify-web-api-node');
  var spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(state.auth.token);

  const [songName, setSongName] = useState<string>('loading...');

  if (songName === 'loading...') {
    spotifyApi.getMyCurrentPlayingTrack().then(function (data: Data) {
      console.log(data.body.item.name);
      setSongName(data.body.item.name);
    });
  }

  return (
    <View>
      <Text>{'song: ' + songName}</Text>
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
    </View>
  );
};

export default SurroundRepriseMain;
