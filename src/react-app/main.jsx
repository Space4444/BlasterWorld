import { ConfigProvider, theme } from 'antd';
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot( document.getElementById("root") ).render(
    <ConfigProvider
        theme={{
            algorithm: theme.darkAlgorithm,
            components: {
                Button: {
                    colorPrimary: '#007F00',
                    colorPrimaryHover: '#00AF00',
                    borderRadius: 10,
                    primaryShadow: '0 2px 0 rgba(0, 0, 0, 0.1)',
                    colorLink: '#FFFF00',
                    colorLinkHover: '#AA5f00',
                    paddingInlineLG: 0
                }
            }
        }}
    >
        <App />
    </ConfigProvider>
);
