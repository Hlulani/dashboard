import { useEffect, useState } from 'react';
import axios from "axios";
import { Button, Row, Col, Container, Form } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
// import LineChart from '.LineChart/LineChart';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



const baseUrlDataSource = 'http://localhost:3000/api/csv/ds';
const baseUrlData = 'http://localhost:3000/api/csv';
const baseURLCompagin = 'http://localhost:3000/api/csv/camp/';

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Campaign metrics',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
let ds = {};

ds["Datasource"] = "red";
ds["Facebook Ads"] = "rgba(255, 99, 132, 0.5)";
ds["Google Adwords"] = "rgba(53, 162, 235, 0.5)";
ds["Google Analytics"] = "gray";
ds["Mailchimp"] = "green";



function App() {


  const [dataSource, setdataSource] = useState([]);
  const [data, setData] = useState([]);
  const [dataSourceOptions, setdataSourceOptions] = useState([]);
  const [campaignOptions, setCampaignOptions] = useState([]);

  const [selectedData, setSelectedData] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');
 const [dataPlot, setDataPlot] = useState({
  labels,
  datasets: []
 });

  
    useEffect(() => {
    axios.get(baseUrlData).then((response) => {
      console.log("dataDD", response.data);
      setData(response.data.data);
    });
  }, []);

  const filterData = (e) => {
    e.preventDefault();
    console.log("selectedData", selectedData);
    console.log("selectedCampaign", selectedCampaign);
    /**axios.get('url').then(rep=>{
      console.log("DATARESP", rep);
    })*/
    let arr = []
    selectedData.forEach(d=> {
      let filtererd = data.filter(ds=> ds.dataSource === d && ds.campaign === selectedCampaign && ds.clicks !== null)      
      filtererd = filtererd.map(e=>e.clicks);
      arr = [...arr, {
      label: d,
      data: filtererd,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: ds[d],
    }];

    })
    console.log("New-DataSet", {
      labels,
      datasets: arr
    });
    setDataPlot({
      labels,
      datasets: arr
    });

  }

  
  
  useEffect(() => {
    axios.get(baseUrlDataSource).then((response) => {
      console.log("data", response.data);
      setdataSource(response.data.data);
      let arr = []
      for(let str of response.data.data)
      {
        arr = [...arr, {label:str, value:str}];
      }
      setdataSourceOptions(arr);
    });
  }, []);

  const [campaign, setCampagin] = useState([]);

  useEffect(() => {
    axios.get(baseURLCompagin).then((response) => {
      console.log("sacmpaign", response.data)
      setCampagin(response.data.data);
      let arr = [];
      response.data.data.forEach(r=> {
        arr = [...arr, {label:r, value:r}];
      })
      setCampaignOptions(arr);
    });
  }, []);

  const state = {
    labels: dataSource,
    datasets: [
      {
        label: 'Rainfall',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: campaign
      }
    ]
  }

  return (
    <div>
      <Container fluid>
        <Row className="mx-0 mt-5">
          <Col md={4} className="menu">
            <Form.Label>Data Source</Form.Label>
            <Select
              isMulti
              name="colors"
              onChange={(evt)=>setSelectedData(evt.map(e=>e.value))}
              options={dataSourceOptions}
              className="basic-multi-select"
              classNamePrefix="select"
            />

            <Form.Label className="mt-3">Compaign</Form.Label>
            <Select
              name="colors"
              options={campaignOptions}
              onChange={(evt)=>setSelectedCampaign(evt.value)}
              className="basic-multi-select"
              classNamePrefix="select"
            />

            <Button variant="primary" className=" mt-3" onClick={(e)=>filterData(e)}>Apply</Button>

          </Col>
          <Col md={8} className="main">
            <h2>Dashboard</h2>

            <Line options={options} data={dataPlot} />

            {/* <Line
              data={state}
              options={{
                title: {
                  display: true,
                  text: 'Average Rainfall per month',
                  fontSize: 20
                },
                legend: {
                  display: true,
                  position: 'right'
                }
              }}
            /> */}
            {/* <LineChart/> */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;