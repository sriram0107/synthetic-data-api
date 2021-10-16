import React, { useState, useEffect } from 'react';
import { Model, SynData } from './dataTypes';
import { Types } from "mongoose";
import Papa from "papaparse";
import "../App.css";


interface ModelComponentProps {
    models: Model[];
    projectid: string;
    refresh: boolean;
    changeRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModelComponent: React.FC<ModelComponentProps> = ({ models, projectid, refresh, changeRefresh }) => {

    const [synData, changeSynData] = useState([]);

    useEffect(() => {
        fetch(process.env.REACT_APP_BACKEND_SYN + projectid)
            .then(data => data.json())
            .then(data => {
                console.log("syndata new , , ", data)
                changeSynData(data);
            })
            .catch((err) => console.error(err))
    }, [projectid, refresh])

    const createNewModel = () => {
        const modelName = prompt("Enter name of model");
        const batchSize = prompt("Enter batch size of model", "32");
        const trainingCycles = prompt("Enter training cycles of model", "32");
        fetch(`${process.env.REACT_APP_BACKEND_MODEL}custom/${projectid}`, {
            method: "POST",
            headers: {
             'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                batchSize: batchSize,
                trainingCycles: trainingCycles,
                name: modelName,
            })
        })
            .then(resp => {
                console.log("Added model");
                changeRefresh(!refresh);
            })
            .catch(err => console.error(err, " error while creating model"))
    }

    const deleteModel = (id: String) => {
        fetch(`${process.env.REACT_APP_BACKEND_MODEL}${id}/${projectid}`, {
            method: "DELETE",
        })
            .then(resp => {
                console.log(resp);
                changeRefresh(!refresh);
            })
            .catch(err => console.error(err, " error while deleting model"))
    }

    const updateName = (id: String) => {
        const modelName = prompt("Enter name of model", "sample model");
        
        fetch(`${process.env.REACT_APP_BACKEND_MODEL}changeName/${id}/${modelName}`, {
            method: "PUT",
        })
            .then(resp => {
                console.log(resp);
                changeRefresh(!refresh);
            })
            .catch(err => console.error(err, " error while updating model"))
    }

    const createSyntheticData = async (id: String) => {
        const newName = prompt("Enter name of dataset");
        const stream = await fetch("/data/synthetic.csv");
        const reader : any = stream.body?.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        const fd = new FormData();
        fd.append("data_file", csv);
        const msg = await fetch(process.env.REACT_APP_BACKEND_MODEL + `createData/${newName}/${id}/${projectid}`, {
            method: "PUT",
            body: fd
        }) 
        changeRefresh(!refresh);
    }

    const deleteSyntheticData = async (id: String, name: String) => {
        try {
            const msg = await fetch(process.env.REACT_APP_BACKEND_MODEL + `deleteData/${id}/${name}`, {
                method: "DELETE",
            })
            console.log(msg);
        } catch (err) {
            console.log(err);
        }
        changeRefresh(!refresh);
    }

    const printSynData = (data_id: String, model_id: String) => {
        const modelSynData: SynData = synData.filter((data: SynData) => data._id === data_id)[0];
        console.log("filering", synData);
        return (
            <div className="syn_data_rows">
                <p>{modelSynData?.name}</p>
                <button onClick={() => deleteSyntheticData(model_id, modelSynData._id)}> Delete synthetic data</button>
             </div>)
    }

    const printModels = (model: Model) => {
        return(
            <div className="model_info">
            <div className="main_info">
            <p>{model.name}</p>
            <button onClick={() => deleteModel(model._id)}>Delete Model</button>
            <button onClick={() => updateName(model._id)}>Update Name</button>
            </div>
                <div className="info">
                    <h4>Parameters</h4>
                    <p>batch-size = { model.parameters.batchSize}</p>
                    <p>training-cycles = {model.parameters.trainingCycles}</p>
                    <div className="synthetic_data_row">
                        <p>synthetic-data</p>
                        <button onClick={() => createSyntheticData(model._id)}>Create synthetic data</button>
                    </div>
                    <div className="syn_data_files">
                    {model.syntheticData.map(data_id => printSynData(data_id, model._id))}
                    </div>
                </div>    
            </div>)
        }

    return (
        <>
            <div className="panel_header">
                <h2>models</h2>
                <button onClick={ () => createNewModel() }>Create new model</button>
            </div>
            <div className="models">
                {models.map((model) => printModels(model))}
            </div>
        </>
    );
};

export default ModelComponent;