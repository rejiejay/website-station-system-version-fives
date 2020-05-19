import deviceDiffer from './../../utils/device-differ.js';

import WindowsComponent from './windows.jsx';
import MobileComponent from './mobile.jsx';

window.onload = () => deviceDiffer() ? ReactDOM.render(<MobileComponent />, document.body) : ReactDOM.render(<WindowsComponent />, document.body)
