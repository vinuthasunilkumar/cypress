import "../styles/App.scss";
import { AppProvider } from "../providers/app";
import { AppWithRouterAccess } from "../routes/AppWithRouterAccess";
import { Provider } from 'react-redux';
import store from "../redux/store";

function App() {
  return (
    <Provider store={store}>   
      <AppProvider>   
          <AppWithRouterAccess />
      </AppProvider>
    </Provider>
  );
}

export default App;
