import React from "react";
import { Card, Form, Col, Row } from "react-bootstrap"
import { Stat } from "../Stat/Stat"

export interface Stats {
    forks: number,
    issues: number,
    stars: number,
    size: number
}

export interface Repository {
    license: string,
    description: string,
    url: string,
    created: string,
    topics: string[],
    metrics: {[key: string]: Stats},
    language: {[key: string]: number}
}

const getLastDate = (stats: string[]): [Date, Date] => {
    let arrayDates = stats.map((da) => new Date(da) );
    const latest = arrayDates.reduce((a,b) => a > b ? a : b)
    let nearest = Infinity
    let winner = -1
    let latestMonth = new Date(latest.getTime());
    if (latestMonth.getMonth() === 0) {
        // It's January
        latestMonth.setFullYear(latestMonth.getFullYear() - 1 )
        latestMonth.setMonth(11)
    }else {
        latestMonth.setMonth(latestMonth.getMonth() - 1)
    }
    const latestTime = latestMonth.getTime()
    arrayDates.forEach((date, index) => {
        let distance = Math.abs(date.getTime() - latestTime)
        if (distance < nearest) {
          nearest = distance
          winner = index
        }
    })
    const closest = arrayDates[winner]
    return [latest,closest]
}


const formatDate = (d: Date) => {
    return `${d.getFullYear()}-${('0' + (d.getMonth()+1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`
}

export const Repo = (props: {repo: Repository}) => {
    const [latest, closest] = getLastDate(Object.keys(props.repo.metrics));
    const met = props.repo.metrics[formatDate(latest)];
    const formatClosest = formatDate(closest);
    const metLastMonth = props.repo.metrics[formatClosest];
    return (
        <Card>
            <Card.Body>
                <Row>
                    <Form>
                    <Form.Group as={Row}>
                                    <Form.Label column sm={1} style={{fontWeight: "bold"}}>
                                        Repo
                                    </Form.Label>
                                    <Form.Label column sm={5} style={{textTransform: "none"}}>
                                    <a rel="noreferrer" href={props.repo.url} target="_blank">{props.repo.url}</a>                              
                                    </Form.Label>    

                                    <Form.Label column sm={1} style={{fontWeight: "bold"}}>
                                        License
                                    </Form.Label>
                                    <Form.Label column sm={2} style={{textTransform: "none"}}>
                                    {props.repo.license}                      
                                    </Form.Label>    
                                    <Form.Label column sm={1} style={{fontWeight: "bold"}}>
                                        Created at
                                    </Form.Label>
                                    <Form.Label column sm={2} style={{textTransform: "none"}}>
                                    {props.repo.created}                      
                                    </Form.Label>    
                                                                  
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm={12} style={{fontWeight: "bold"}}>
                                    Description
                                    </Form.Label>                                    
                                    <Form.Label column sm={12} style={{textTransform: "none"}}>
                                    <div style={{marginLeft: "10px"}}>{props.repo.description}</div>              
                                    </Form.Label>
                                </Form.Group>
                    </Form>
                </Row>
                <Row><Form.Label column sm={1} style={{fontWeight: "bold"}}>Stats</Form.Label></Row>
                <Row>
                      <Col lg="3" sm="6"> <Stat name={"forks"} value={met.forks} previous={metLastMonth.forks} previousDate={formatClosest} /> </Col>
                      <Col lg="3" sm="6"> <Stat name={"issues"} value={met.issues} previous={metLastMonth.issues} previousDate={formatClosest}/> </Col>
                      <Col lg="3" sm="6"> <Stat name={"starts"} value={met.stars} previous={metLastMonth.stars} previousDate={formatClosest}/> </Col>
                      <Col lg="3" sm="6"> <Stat name={"size"} value={met.size} previous={metLastMonth.size} previousDate={formatClosest}/></Col>                                   
                </Row>
            </Card.Body>  
            <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-clock mr-1"></i>
                  Last update: {latest.toLocaleDateString()}
                </div>
              </Card.Footer>          
        </Card>
    )

}