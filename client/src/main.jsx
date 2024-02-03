import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter as Router} from 'react-router-dom';
import {ChainId,ThirdwebProvider} from '@thirdweb-dev/react';
import {Sepolia} from "@thirdweb-dev/chains";
import "./index.css";
import { StateContextProvider } from './context';
import App from './App';
const root = ReactDOM.createRoot(document.getElementById('root'));
 


root.render(
    <ThirdwebProvider activeChain={ Sepolia } 
    clientId="0xC1439b948C271515C60DC99fA83087ea9E8E5C6D" // You can get a client id from dashboard settings
    >
        
        <Router>
            <StateContextProvider>
            <App />
            </StateContextProvider>
        </Router>

    </ThirdwebProvider>
)