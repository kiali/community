import sidebarImage from "../../assets/img/sidebar.jpg";
import logo from "../../assets/img/kiali_icon_darkbkg_1280px.svg";
import { useLocation, NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { routeDash } from "../../routes";

export const Sidebar = (props: {routes: routeDash[]}) => {   
    const location = useLocation();
    const activeRoute = (routeName: string) => {
        return location.pathname === routeName ? "active" : "";
    }; 
    return (
        <div className="sidebar" data-image={sidebarImage} data-color={"black"}>
                <div
                    className="sidebar-background"
                    style={{
                    backgroundImage: "url(" + sidebarImage + ")"
                    }}
                />
                 <div className="sidebar-wrapper">
                    <div className="logo d-flex align-items-center justify-content-start">
                        <a
                            href="https://kiali.io/"
                            rel="noreferrer"
                            className="simple-text logo-mini mx-1"
                            target="_blank"
                        >
                            <div className="logo-img">                                
                                <img src={logo} alt="..." style={{width: "40px"}} />
                            </div>
                        </a>
                        <a rel="noreferrer" className="simple-text" style={{marginLeft: "10px", fontWeight: "bold"}} href="https://kiali.io/">
                           Kiali
                        </a>
                    </div>
                    <Nav>
                        {props.routes.map((prop, key) => (
                                <li
                                className={
                                    activeRoute(prop.layout + prop.path)
                                }
                                key={key}
                                >
                                <NavLink
                                    to={prop.layout + prop.path}
                                    className="nav-link"
                                >
                                    <i className={prop.icon} />
                                    <p>{prop.name}</p>
                                </NavLink>
                                </li>
                            )
                        )}
                    </Nav>
                </div>
        </div>
    )
}