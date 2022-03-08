import ReactDOM from 'react-dom';
import App from './App';
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN';
import { BrowserRouter } from "react-router-dom"
ReactDOM.render(
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>,
  document.getElementById('root')
);


