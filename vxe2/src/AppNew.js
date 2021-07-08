import React from 'react';
import { Route } from 'react-router-dom';
import Journals from './Components/Journals/JournalsLayout';
import { getToken, validateToken, decodeToken } from './utils/authMethods';
import TokenModal from './Components/Journals/modals/token-modal';
import Loading from './Components/Journals/loading/spinningCircle'; 

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isValidatingToken: true,
      isTokenValid: false,
      userData: {},
      errMessage: '',
      permissions: {},
      isChrome: !!window.chrome,
      browserValHeader: 'Browser Not Support',
      browserValBody:
        'Please use Google Chrome as the browser for making corrections to your proofs through Lanstad (our online portal).',
      browserValBody2:
        'Please note that our online editor, VXE, is better supported in Chrome which enables complete access to all inbuilt features & functionalities.',
    };
  }

  async manageToken() {
    let isTokenValid = false;
    let userData = {};
    let permissions = {};
    let errMessage = { header: 'Unauthorized access' };
    let token = '';

    const getStateDataFromToken = async (tokenValue) => {
      isTokenValid = await validateToken(tokenValue);
      if (isTokenValid === true) {
        const decodifiedToken = decodeToken(tokenValue);
        if (decodifiedToken.user) {
          userData = decodifiedToken;
          permissions = decodifiedToken.user.permissions.permissionsMapped
            ? decodifiedToken.user.permissions.permissionsMapped.vxe
            : {};
          permissions['oup'] = decodifiedToken.user.permissions
            .permissionsMapped
            ? decodifiedToken.user.permissions.permissionsMapped.oup
            : false;
          errMessage = '';
        } else {
          errMessage = {
            body: 'You may be experiencing network connectivity issues. Please, try again later.',
          };
          isTokenValid = false;
        }
      } else if (isTokenValid !== false) {
        errMessage = {
          body: 'You may be experiencing network connectivity issues. Please, try again later.',
        };
        isTokenValid = false;
      }
    };

    if (window.location !== window.parent.location) {
      // Ask parent for magic code
      window.parent.postMessage('getMagicCode', '*');
      window.parent.postMessage('setToken', '*');

      const messageHandler = async (event) => {
        const { action, key, value } = event.data;

        if (action == 'set') {
          window.localStorage.setItem(key, value);
          token = value;
          if (token) {
            await getStateDataFromToken(token);
          }
          this.setState({
            isTokenValid,
            isValidatingToken: false,
            userData,
            permissions,
            errMessage,
          });
        } else if (action == 'remove') {
          window.localStorage.removeItem(key);
        }
      };
      window.addEventListener('message', messageHandler, false);
    } else {
      token = getToken();
      if (token) {
        await getStateDataFromToken(token);
      }
      this.setState({
        isTokenValid,
        isValidatingToken: false,
        userData,
        permissions,
        errMessage,
      });
    }
  }

  componentDidMount() {
    this.manageToken();
  }

  render() {
    const { isChrome } = this.state;

    if (this.state.isValidatingToken === true) {
      //return <Loading loadingText={'Loading...'} />;
      return <>jjj </>;
    } else {
      return this.state.isTokenValid && this.state.permissions.view ? (

        // <h1>yooooooo</h1>
        <Route
          exact
          path="/vxe/:ProjectId/:ChapterId"
          component={(props) => (
            <Journals
              {...props}
              userData={this.state.userData.user}
              permissions={this.state.permissions}
            />
          )}
        />
      ) : (
        <TokenModal
          modalHeader={this.state.errMessage.header}
          modalBody={this.state.errMessage.body}
        />
      );
    }
  }
} 

export default App;
