import deviceDiffer from './../utils/device-differ.js';

import WindowsComponent from './windows.jsx';
import MobileComponent from './mobile.jsx';

window.onload = () => ReactDOM.render(deviceDiffer() ? <MobileComponent />:<WindowsComponent />, document.body)
