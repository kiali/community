import React from "react";
import { Badge, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
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

const iconDown = "fas fa-arrow-down"
const iconUp = "fas fa-arrow-up"
const equals = "fas fa-equals"

export const Stat = (props: {name: string, value: number, previous: number, previousDate: string}) => {
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

    const getContentBadge = () => {
      const value = props.value - props.previous;      
      let icon = iconUp
      icon = value < 0 ? iconDown : value === 0 ? equals : iconUp 
      if (props.name === "issues") {
        icon += value > 0 ? " text-danger" : value < 0 ? " text-success" : " text"      
      } else {
        icon += value > 0 ? " text-success" : value < 0 ? " text-danger" : " text"   
      }
     
      return (
        <>
          <i className={icon}></i> {props.name === "size" ? convertBytes(value*1024): value}
        </>   
      )
    }

    return (
        <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="4">
                    <div className="icon-big text-center icon-warning">
                      {icon}
                    </div>
                  </Col>
                  <Col xs="8">
                    <div className="numbers">
                      <p className="card-category">{props.name}</p>
                      <Card.Title as="h4">
                        <OverlayTrigger 
                          placement={"bottom"}
                          overlay={
                            <Tooltip id={`tooltip-${props.name}`}>
                              Metric from {props.previousDate}
                            </Tooltip>
                          }
                        >
                        
                          <Badge pill bg="light" text="dark" style={{fontSize: "12px", marginRight: "5px"}}>
                            {getContentBadge()}                   
                          </Badge>                          
                        </OverlayTrigger>
                        {props.name === "size" ? convertBytes(props.value*1024): props.value}
                      </Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
    )
}