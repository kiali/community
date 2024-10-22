import React from "react";
import events from '../data/events.json';
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

export const iconsType: {[key:string]: string} = {
    "workshop": "fas fa-desktop",
    "talk": "fas fa-microphone",
    "lighting": "fas fa-bolt"
}

const Talks = () => {
    const navigate = useNavigate();
    const talks = events.sort((a,b) => {  
        const date_a = new Date(a.date).getTime()
        const date_b = new Date(b.date).getTime()
        return date_b - date_a 
    })
    return (
        <Container fluid>
            <Row>
                <Col md="12">
                    <Card className="strpied-tabled-with-hover">
                        <Card.Header>
                            <Card.Title as="h4">Talks/Workshops</Card.Title>
                        </Card.Header>
                        <Card.Body className="table-full-width table-responsive px-0">
                            {talks.length > 0 ? (
                                <Table className="table-hover"> 
                                    <thead>
                                        <tr>
                                        <th className="border-0">Type</th>
                                        <th className="border-0">Date</th>    
                                        <th className="border-0">Event</th>
                                        <th className="border-0">Name</th>
                                        <th className="border-0">Place</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {talks.map(talk => {
                                             return (
                                                <tr key={`wokshop_${talk.date}_${talk.eventName}`} onClick={() => navigate(`/dashboard/talk/${talk.id}`)}>                                                    
                                                    <td>
                                                        <span className="d-inline-block" data-bs-toggle="tooltip" title={`${talk.type}`}>
                                                            <i className={iconsType[talk.type]} />
                                                        </span>
                                                    </td>
                                                    <td>{talk.date}</td>
                                                    <td>{talk.eventName}</td>
                                                    <td>
                                                    <NavLink
                                                        to={`/dashboard/talk/${talk.id}`}
                                                        className="nav-link"
                                                    >
                                                        {talk.talkName}
                                                    </NavLink>
                                                    </td>
                                                    <td>{talk.place}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            ) : (
                                <Table className="table-hover"><tbody><tr><th>No talks available</th></tr></tbody></Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Talks;