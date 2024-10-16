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

const getLastDate = (stats: string[]) => {
    let arrayDates = stats.map((da) => new Date(da) );
    return arrayDates.reduce((a,b) => a > b ? a : b)
}

const formatDate = (d: Date) => {
    return `${d.getFullYear()}-${('0' + (d.getMonth()+1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`
}

export const Repo = (props: {repo: Repository}) => {
    const date = getLastDate(Object.keys(props.repo.metrics));
    const met = props.repo.metrics[formatDate(date)]
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
                      <Col lg="3" sm="6"> <Stat name={"forks"} value={met.forks} /> </Col>
                      <Col lg="3" sm="6"> <Stat name={"issues"} value={met.issues} /> </Col>
                      <Col lg="3" sm="6"> <Stat name={"starts"} value={met.stars} /> </Col>
                      <Col lg="3" sm="6"> <Stat name={"size"} value={met.size} /> </Col>                                   
                </Row>
            </Card.Body>  
            <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-clock mr-1"></i>
                  Last update: {date.toLocaleDateString()}
                </div>
              </Card.Footer>          
        </Card>
    )

}