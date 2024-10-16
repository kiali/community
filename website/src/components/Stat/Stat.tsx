import React from "react";
import { Card, Col, Row } from "react-bootstrap";

export const convertBytes = (bytes: number, options: { useBinaryUnits?: boolean; decimals?: number } = {}): string => {
  const { useBinaryUnits = false, decimals = 2} = options;

  if (decimals < 0) {
    throw new Error(`Invalid decimals ${decimals}`);
  }

  const base = useBinaryUnits ? 1024 : 1000;
  const units = useBinaryUnits
    ? ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
    : ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(base));

  return `${(bytes / Math.pow(base, i)).toFixed(decimals)} ${units[i]}`;
}

export const Stat = (props: {name: string, value: number}) => {
    var icon = <i className="fas fa-code text-info"/>

    switch(props.name) {
      case "forks":
        icon = <i className="fas fa-code text-warning"></i>
      break;     
      case "starts":
        icon = <i className="fas fa-star text-success"></i>
      break;  
      case "size":
        icon = <i className="fas fa-compress text-info"></i>
      break;   
      case "issues":
        icon = <i className="fas fa-wrench text-danger"></i>  
       break;       
      default:
        icon = <i className="nc-icon nc-chart text-info"/>
      break;
    }

    return (
        <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      {icon}
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">{props.name}</p>
                      <Card.Title as="h4">{props.name === "size" ? convertBytes(props.value*1024): props.value}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
    )
}