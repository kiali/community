import React from "react";
import { Button, Card, Col, Collapse, Container, Row, Form } from "react-bootstrap";
import { useParams } from 'react-router';
import events from '../data/events.json';
import { TalkView } from "../components/TalkView/TalkView";
import { Flag } from "../components/Flag";
import { iconsType } from "./Talks";


const Talk = () => {
    const { talkId } = useParams();
    const [openPreview, setOpenPreview] = React.useState(false);
    const talk = events.filter(ev => ev.id === talkId)[0]

    return (
        <Container fluid>
            <Row>
                <Col md="12">
                    <Card style={{height: "100%"}}> 
                    <Card.Header>
                        <Card.Title as="h3"><i className={iconsType[talk.type]} /><span style={{marginLeft: "10px"}}>{talk.talkName}</span></Card.Title>
                        </Card.Header>
                         <Card.Body>
                        <Form>
                                <Form.Group as={Row}>
                                    <Form.Label column sm={1} style={{fontWeight: "bold"}}>
                                        Type
                                    </Form.Label>
                                    <Form.Label column sm={1}>
                                        {talk.type}                              
                                    </Form.Label>                                    
                                    <Form.Label column sm={1} style={{fontWeight: "bold"}}>
                                        Language
                                    </Form.Label>
                                    <Form.Label column sm={4}>
                                    <Flag lang={talk.lang} />                    
                                    </Form.Label>
                                    <Form.Label column sm={1} style={{fontWeight: "bold"}}>
                                        Event Name
                                    </Form.Label>
                                    <Form.Label column sm={1}>
                                        {talk.eventName}                              
                                    </Form.Label>
                                    <Form.Label column sm={1} style={{fontWeight: "bold"}}>
                                        Location
                                    </Form.Label>
                                    <Form.Label column sm={1}>
                                    <a rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${talk.place.replace(',','+')}`} target="_blank">{talk.place}</a>
                                    </Form.Label>
                                </Form.Group>
                                <Form.Group as={Row}>
                                    <Form.Label column sm={12} style={{fontWeight: "bold"}}>
                                    Description
                                    </Form.Label>                                    
                                    <Form.Label column sm={12}>
                                    <div style={{marginLeft: "10px"}}>{talk.description} </div>              
                                    </Form.Label>
                                </Form.Group>
                                
                        </Form>        
                        
                        <Button
                            onClick={() => setOpenPreview(!openPreview)}
                            aria-expanded={openPreview}
                        >
                            See Preview
                        </Button>
                        <Collapse in={openPreview}>
                            <div>
                            <TalkView type={talk.presentation.type} link={talk.presentation.link}/> 
                            </div>   
                        </Collapse>
                         </Card.Body>
                         <Card.Body>
                            <Card.Link target='_blank' href={talk.folder_path}>See {talk.type}</Card.Link>
                         </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Talk;

/*
"date": "2024-06-21",
	"place": "Brno, Czech Republic",
	"eventName": "DevConf",
	"talkName": "Kiali Beyond the Graph – Troubleshooting Istio",
	"lang": "EN",
	"type": "talk",
	"presentation": {
		"type" : "youtube",
		"link": "https://www.youtube.com/watch?v=aM6fslVXbZc"
	},	
	"folder_path": "https://www.youtube.com/watch?v=aM6fslVXbZc"

*/