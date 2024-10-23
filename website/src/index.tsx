import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { HashRouter, Route, Routes, Navigate } from "react-router-dom";

/* CSS */
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/light-bootstrap-dashboard-react.css";
import "./assets/css/animate.min.css";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {dashboardRoutes, extraRoutes} from './routes';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HashRouter>
    <Routes>
      {dashboardRoutes.map( rout => 
      (
        <Route key={`path_${rout.layout + rout.path}`} path={rout.layout + rout.path} element={rout.component} />
      )
      )}
      {extraRoutes.map( rout => 
      (
        <Route key={`path_${rout.layout + rout.path}`} path={rout.layout + rout.path} element={rout.component} />
      )
      )}
      <Route path="*" element={<Navigate to="/dashboard/" replace />} />
    </Routes>
  </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
