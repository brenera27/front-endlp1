import './App.css'
import { Router,BrowserRouter } from "react-router-dom"
import Routes from './routes';
import { history } from './history.js';
import Menu from "./pages/navbar"
function App() {
  return (
    <BrowserRouter>
    <Menu />
    <Router history={history}> 
      <Routes />
    </Router>
    </BrowserRouter>
  );
}

export default App
