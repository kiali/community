import React from "react";
import { Accordion, Badge, Card, Col, Container, Row, Stack } from "react-bootstrap";
import { convertBytes } from "../components/Stat/Stat";
import { Repo, Repository, Stats } from "../components/Repo/Repo";
import metrics from "../data/metrics.json";
import { LineChart, PieChart } from "@mui/x-charts";
import { Box, Slider } from "@mui/material";

export interface MetricsT {
    repositories: {[key: string] : Repository};
}

const getPieDataChart = (data: {[key:string]: number}) => {
    return Object.keys(data).map((key, index) => { return {"id": 0, "value": data[key], "label": key}})
}

const getLineXChart = (data: string[]) => {
    return data.map(d => new Date(d))
}

const getSeriesLine = (data: {[key: string]: Stats}) => {
    Object.values(data).map(v => v.forks)

    return {
        series: [
          {
            label: 'Forks',
            data: Object.values(data).map(v => v.forks),
            showMark: false,
          },
          {
            label: 'Stars',
            data: Object.values(data).map(v => v.stars),
            showMark: false,
          },
          {
            label: 'Issues',
            data: Object.values(data).map(v => v.issues),
            showMark: false,
          },
          {
            label: 'Size',
            data: Object.values(data).map(v => v.size/1024),
            showMark: false,
          },
        ]
      };
}

const yearFormatter = (date: Date) => `${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`;

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
                <p className="card-category">Forks / Starts / Issues / Size (KB)</p>
              </Card.Header>
              <Card.Body>
                <div className="ct-chart" id="chartHours">
                <LineChart
                    xAxis={[{ data: getLineXChart(Object.keys(data.repositories[repo].metrics)), scaleType: 'time', valueFormatter: yearFormatter }]}            
                    series={getSeriesLine(data.repositories[repo].metrics).series.map((series) => ({
                        ...series
                      }))}
                    width={800}
                    height={300}
                    />
                </div>
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