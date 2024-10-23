import React from "react";
import { Accordion, Badge, Card, Col, Container, Row, Stack } from "react-bootstrap";
import { convertBytes } from "../components/Stat/Stat";
import { Repo, Repository } from "../components/Repo/Repo";
import metrics from "../data/metrics.json";
import { PieChart } from "@mui/x-charts";
import { Box, Slider } from "@mui/material";
import { MetricChartLine } from "../components/MetricChartLine/MetricChartLine";

export interface MetricsT {
    repositories: {[key: string] : Repository};
}

const getPieDataChart = (data: {[key:string]: number}) => {
    return Object.keys(data).map((key, index) => { return {"id": 0, "value": data[key], "label": key}})
}



const Metrics = () => {
    const [pieLangSlice, setPieLangSlice] = React.useState(5);
    const data: MetricsT = metrics;

    const handlePieLangSlice = (event: Event, newValue: number | number[]) => {
        if (typeof newValue !== 'number') {
          return;
        }
        setPieLangSlice(newValue);
      };

    return (
        <Container fluid>
            <Accordion defaultActiveKey="0">
            {Object.keys(data.repositories).map((repo, index) => 
                <Accordion.Item eventKey={index.toString()} key={`Item_${repo}`}>
                    <Accordion.Header>                                          
                                <h3>{repo}  </h3> 
                                <Stack direction="horizontal" gap={2} style={{marginTop: "10px", marginLeft: "10px"}}>   
                                    {data.repositories[repo].topics.map(badge => <Badge key={`badge_${repo}_${badge}`} bg="light" text="dark">{badge}</Badge>)}
                                </Stack>
                        </Accordion.Header>
                    <Accordion.Body>
                    <Repo repo={data.repositories[repo]}/>
                    <Row>
          <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Community grow</Card.Title>
              </Card.Header>
              <Card.Body>
                <MetricChartLine data={data.repositories[repo].metrics} />               
              </Card.Body>
             
            </Card>
          </Col>
          <Col md="4">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Top {pieLangSlice} languages</Card.Title>
                <p className="card-category">Size by language type</p>
              </Card.Header>
              <Card.Body>
                <Box sx={{ width: '100%' }} className="ct-chart ct-perfect-fourth">
                    <PieChart
                    series={[
                        {
                        data: getPieDataChart(data.repositories[repo].language).slice(0, pieLangSlice),
                        valueFormatter: (v, { dataIndex }) => {
                             return `(${convertBytes(v.value)})`;
                          },
                        innerRadius: 0,
                        outerRadius: 100,
                        paddingAngle: 0,
                        cornerRadius: 0,
                        startAngle: 0,
                        endAngle: 360,
                        cx: 150,
                        cy: 100,
                        }
                    ]}
                    skipAnimation={true}
                    width={500}
                    height={300}
                    slotProps={{
                        legend: {
                            direction: 'column',
                            position: {
                                vertical: 'middle',
                                horizontal: 'right',
                            },
                            padding: 40,
                            itemMarkWidth: 20,
                            itemMarkHeight: 2,
                            markGap: 5,
                            itemGap: 5,
                        },
                    }}
                    /> 
                    <h5>Selected {pieLangSlice} languages</h5>                    
                    <Slider
                            value={pieLangSlice}
                            onChange={handlePieLangSlice}
                            valueLabelDisplay="auto"
                            min={1}
                            max={Object.keys(data.repositories[repo].language).length}
                            aria-labelledby="input-item-number"
                        />
                         </Box>
                     </Card.Body>                       
            </Card>
          </Col>
        </Row>
                    </Accordion.Body>
                </Accordion.Item>            
            )}
            </Accordion>          
        </Container>
    )
}

export default Metrics;