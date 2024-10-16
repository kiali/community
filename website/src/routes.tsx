import Metrics from "./views/Metrics";
import Talks from "./views/Talks";
import Talk from "./views/Talk";
import DashboardLayout from "./layouts/Dashboard";

export interface routeDash {
    path: string;
    name: string;
    icon: string;
    component: JSX.Element;
    layout: string;
}

export const dashboardRoutes = [
    {
        path: "/*",
        name: "Dashboard",
        icon: "nc-icon nc-chart-pie-35",
        component: <DashboardLayout component={<Metrics/>} />,
        layout: "/dashboard"
    },    
    {
        path: "/talks",
        name: "Talks",
        icon: "nc-icon nc-audio-92",
        component: <DashboardLayout component={<Talks/>} />,
        layout: "/dashboard"
    }
]

export const extraRoutes = [
    {
        path: "/talk/:talkId",
        name: "Talk",
        icon: "nc-icon nc-audio-92",
        component: <DashboardLayout component={<Talk/>} />,
        layout: "/dashboard"
    }
]
