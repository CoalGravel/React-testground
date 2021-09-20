import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import RenderSnackBar from './components/snackbar/snackbar';

ReactDOM.render(
  <RenderSnackBar>
    <App />
  </RenderSnackBar>,
  document.getElementById('root')
);
