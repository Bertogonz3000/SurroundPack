import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {horizontalAnimation, verticalAnimation} from './utils/transition';
import {MyTheme} from './utils/theme';
import Login from './screens/login/Login';
import useLogin from './hooks/use-login';
import BottomNav from './components/bottom-navigation/BottomNav';
import AddPlaylist from './screens/add-playlist/AddPlaylist';
import AddSongs from './screens/add-songs/AddSongs';
import {Button, View} from 'react-native';
import SurroundRepriseMain from './SurroundReprise/SurroundRepriseMain';

const Stack = createStackNavigator();

const Routes = () => {
  const {state} = useLogin();

  var SpotifyWebApi = require('spotify-web-api-node');
  // credentials are optional
  var spotifyApi = new SpotifyWebApi({
    clientId: '184fb43fb4e54bbe8140e5f637a89f0d',
    clientSecret: '156c22a6b7ed4110816beca572135bda',
    redirectUri: 'com.yourmusic://oauth/',
  });

  if (state.auth.token !== '') {
    spotifyApi.setAccessToken(state.auth.token.toString());
  }

  return (
    <>
      {state.auth.token === '' ? (
        <Login />
      ) : (
        <SurroundRepriseMain authToken={state.auth.token} />
      )}
    </>
  );

  // return (
  //   <NavigationContainer theme={MyTheme}>
  //     <Stack.Navigator screenOptions={horizontalAnimation}>
  //       {state.auth.token === '' ? (
  //         <>
  //           <Stack.Screen name="Login" component={Login} />
  //         </>
  //       ) : (
  //         <>
  //           <Stack.Group>
  //             <Stack.Screen name="Bottom Navigation" component={BottomNav} />
  //           </Stack.Group>
  //           <Stack.Group
  //             screenOptions={{
  //               presentation: 'transparentModal',
  //             }}>
  //             <Stack.Screen
  //               name="Add Playlist"
  //               component={AddPlaylist}
  //               options={verticalAnimation}
  //             />
  //             <Stack.Screen
  //               name="Add Songs"
  //               component={AddSongs}
  //               options={verticalAnimation}
  //             />
  //           </Stack.Group>
  //         </>
  //       )}
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );
};

export default Routes;
