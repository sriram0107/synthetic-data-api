import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import ModelComponent from './components/modelComponent';
import DatasetComponent from './components/datasetComponent';

function App() {
  // to change between real data & model panel
  const [modelPanelOpen, changeModelPanelOpen] = useState(true);

  const [models, changeModels] = useState([]);
  const [datasets, changeDatasets] = useState([]);
  const [user, changeUser] = useState({});
  const [userid, changeUserId] = useState("");
  const [projectid, changeProjectId] = useState("");

  // refresh variable dictates when the content needs to be fetched again
  const [refresh, changeRefresh] = useState(false);


  // get USERINFO 
  useEffect(() => {
    fetch(process.env.REACT_APP_BACKEND_USER as string)
      .then(data => data.json())
      .then(user => {
        changeUser(user);
        changeUserId(user._id);
        changeProjectId(user.projects[0]);
      })
      .catch(err => console.error("Cannot find user", err))
  }, [])

  // get models
  useEffect(() => {
      fetch(process.env.REACT_APP_BACKEND_MODEL + projectid as string)
      .then(data => data.json())
        .then(models => {
          changeModels(models)
        })
      .catch(err => console.error("Cannot find models", err))
  }, [projectid, refresh])

  // retrieve datasets
  useEffect(() => {
    console.log("Retrieving datasets related to project - ", projectid);
    fetch(process.env.REACT_APP_BACKEND_DATASET + projectid as string)
      .then(data => data.json())
      .then(datasets => changeDatasets(datasets))
      .catch(err => console.error("Cannot find datasets", err))
  }, [projectid, refresh])

  return (
    <div className="App">
      <div className="side_panel">
        <h3>Projects</h3>
        <p>project-1</p>
        <h4 onClick = {() => { changeModelPanelOpen(true) }}>Models</h4>
        <h4 onClick = {() => { changeModelPanelOpen(false) }}>Real Datasets</h4>
      </div>
      <div className="main_panel">
        {modelPanelOpen ? <ModelComponent models={models} projectid={projectid} refresh={refresh} changeRefresh={changeRefresh} /> :
          <DatasetComponent datasets={datasets} refresh={refresh} changeRefresh={changeRefresh} projectid={projectid}/>}
      </div>
    </div>
  );
}

export default App;
