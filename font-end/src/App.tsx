import View from './components/View'

import "./App.less"
import Login from './pages/Login';
function App() {
  const authenticate = () => {
    //获取页面中存储的token
    let token = sessionStorage.getItem('LOGINTAKEN')
    //根据是否存在token,返回不同的值
    return token ? true : false
  }
  return (
    <>
      {
        authenticate() ?
          <View /> : <Login />
      }
    </>
  );
}

export default App;
