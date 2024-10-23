import React from "react";
import { Stats } from "../Repo/Repo";
import { LineChart } from "@mui/x-charts";

const getLineXChart = (data: string[]) => {
    return data.map(d => new Date(d))
}

const yearFormatter = (date: Date) => `${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`;



export const MetricChartLine = (props: {data: {[key: string]: Stats}}) => {
    const [forks, setForks] = React.useState<boolean>(false);
    const [issues, setIssues] = React.useState<boolean>(false);
    const [stars, setStars] = React.useState<boolean>(true);
    const [size, setSize] = React.useState<boolean>(false);
    const [all, setAll] = React.useState<boolean>(false);

    const setEverything = () => {
        setAll(!all)
        setForks(!all)
        setIssues(!all)
        setStars(!all)
        setSize(!all)
    }

    const getSeriesLine = (data: {[key: string]: Stats}) => {
        Object.values(data).map(v => v.forks)
        const series = []
        forks && series.push(
            {
                label: 'Forks',
                data: Object.values(data).map(v => v.forks),
                showMark: false,
              }
        ) 
        stars && series.push(
            {
                label: 'Stars',
                data: Object.values(data).map(v => v.stars),
                showMark: false,
              }
        ) 
        issues && series.push(
            {
                label: 'Issues',
                data: Object.values(data).map(v => v.issues),
                showMark: false,
              }
        ) 
        size && series.push(
            {
                label: 'Size',
                data: Object.values(data).map(v => v.size/1024),
                showMark: false,
              }
        ) 
        return {
            series: series
          };
    }

    return (
        <>
        <div style={{display: "flex"}}>
            <div style={{marginLeft: "10px"}}>
                <input type="checkbox" className="form-check-input" checked={stars} onClick={() => setStars(!stars)}/>
                <label className="form-check-label" style={{marginLeft: "10px"}}>Starts</label>     
            </div>
            <div style={{marginLeft: "10px"}}>
                <input type="checkbox" className="form-check-input" checked={forks} onClick={() => setForks(!forks)}/>
                <label className="form-check-label" style={{marginLeft: "10px"}}>Forks</label>     
            </div>
            <div style={{marginLeft: "10px"}}>
                <input type="checkbox" className="form-check-input" checked={issues} onClick={() => setIssues(!issues)}/>
                <label className="form-check-label" style={{marginLeft: "10px"}}>Issues</label>     
            </div>
            <div style={{marginLeft: "10px"}}>
                <input type="checkbox" className="form-check-input" checked={size} onClick={() => setSize(!size)}/>
                <label className="form-check-label" style={{marginLeft: "10px"}}>Size (MB)</label>     
            </div>
            <div style={{marginLeft: "10px"}}>
                <input type="checkbox" className="form-check-input" checked={all} onClick={() => setEverything()}/>
                <label className="form-check-label" style={{marginLeft: "10px"}}>{!all? "All" : "Remove all"}</label>     
            </div>                  
        </div>
        <div className="ct-chart" id="chartHours">
                <LineChart
                    xAxis={[{ data: getLineXChart(Object.keys(props.data)), scaleType: 'time', valueFormatter: yearFormatter }]}            
                    series={getSeriesLine(props.data).series.map((series) => ({
                        ...series
                      }))}
                    width={800}
                    height={300}
                    />
                </div>
      </>
    )

}