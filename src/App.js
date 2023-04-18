import './App.css';
import Items from './components/Items';
import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/style.scss';
import { CContainer } from '@coreui/react';

function App() {
  return (
    <div className="App">
      <CContainer fluid>
          <Items />
      </CContainer>
    </div>
  );
}

export default App;