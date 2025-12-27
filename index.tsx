
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // 显式添加扩展名以配合某些 ESM 运行环境

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Failed to render the app:", error);
    rootElement.innerHTML = `<div style="padding: 20px; color: red;">应用启动失败，请查看控制台错误详情。</div>`;
  }
} else {
  console.error("Could not find root element with id 'root'");
}
