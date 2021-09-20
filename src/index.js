import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import RenderSnackBar from './components/snackbar/snackbar';
import SimpleBackdrop from './components/backdrop/backdrop';

ReactDOM.render(
  <RenderSnackBar>
    <SimpleBackdrop>
      <App />
    </SimpleBackdrop>
  </RenderSnackBar>,
  document.getElementById('root')
);
