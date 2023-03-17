import {useContext} from 'react';
import {authorize} from 'react-native-app-auth';
import {MyContext} from '../context/context';
import {Types} from '../types/reducer-type';

const authConfig = {
  clientId: '184fb43fb4e54bbe8140e5f637a89f0d',
  // optional clien secret
  clientSecret: '156c22a6b7ed4110816beca572135bda',
  redirectUrl: 'com.yourmusic://oauth/',
  scopes: [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state",
    "streaming",
    "user-read-email",
    "user-read-private","playlist-modify-public", "playlist-modify-private",
  ],  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  },
};

export default function useLogin() {
  // const {token, setToken} = useContext(AuthContext);
  const {state, dispatch} = useContext(MyContext);

  const authLogin = async () => {
    try {
      const result = await authorize(authConfig);

      // setToken(result.accessToken);
      dispatch({
        type: Types.Auth,
        payload: {
          token: result.accessToken,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  return {
    state,
    authLogin,
  };
}
