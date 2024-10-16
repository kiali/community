/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

import { Sidebar } from "../components/Sidebar/Sidebar";
import { dashboardRoutes } from "../routes";

function DashboardLayout(prop: {component: JSX.Element}) {
    
  return (
      <div className="wrapper">
        <Sidebar routes={dashboardRoutes} />
        <div className="main-panel">
          <div className="content">
            {prop.component}
          </div>
        </div>
      </div>
  );
}

export default DashboardLayout;