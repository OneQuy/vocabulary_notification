import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { RegisterNotificationEvent } from './src/Common/Nofitication';

RegisterNotificationEvent()

AppRegistry.registerComponent(appName, () => App);