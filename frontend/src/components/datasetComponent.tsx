import React from 'react';
import "../App.css";
import { Dataset } from "./dataTypes";
import Papa from "papaparse";

interface DatasetComponentProps {
    datasets: Dataset[];
    refresh: boolean;
    changeRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    userid: String
}

const DatasetComponent: React.FC<DatasetComponentProps> = ({ datasets, refresh, changeRefresh, userid }) => {

    const createDataset = async () => {
        try {
            const newName = prompt("Enter name of dataset", "sample");
            const stream = await fetch("/data/real.csv");
            const reader : any = stream.body?.getReader();
            const result = await reader.read();
            const decoder = new TextDecoder('utf-8');
            const csv = decoder.decode(result.value);
            const results = Papa.parse(csv, { header: true });
            const rows = results.data;
            const msg = await fetch(process.env.REACT_APP_BACKEND_DATASET + `createData/${newName}/${userid}`, {
                method: "POST",
                headers: {
             'Content-Type': 'application/json'
            },
                body: JSON.stringify({
                    data: rows,
                })
            }) 
        } catch (err) {
            console.error(err);
        }
        changeRefresh(!refresh);
    }

    const updateDataset = (id: String) => {
        const newName = prompt("Enter new name of dataset");
        fetch(`${process.env.REACT_APP_BACKEND_DATASET}updateName/${newName}/${id}`, {
            method: "PUT",
        })
            .then(resp => console.log(resp))
            .catch(err => console.error(err, " error while updating dataset"))
        changeRefresh(!refresh);
    }

    const deleteDataset = (id: String) => {
        console.log("id to be deleted", id)
        fetch(`${process.env.REACT_APP_BACKEND_DATASET}deleteData/${id}`, {
            method: "DELETE",
        })
            .then(resp => console.log(resp))
            .catch(err => console.error(err, " error while deleting dataset"))
        changeRefresh(!refresh);
    }
    
    const printDatasets = (dataset: Dataset) => {
        console.log("print data check")
       return(<div className="panel_row">
            <p>{dataset.name}</p>
            <button onClick={() => deleteDataset(dataset._id)}>Delete Data</button>
            <button onClick={() => updateDataset(dataset._id)}>Update Name</button>
            </div>)
    }

    return (
        <>
            <div className="panel_header">
                <h2>Real Datasets</h2>
                <button onClick={ () => createDataset() }>Create new dataset</button>
            </div>
            <div className="models">
                {datasets.map(dataset => printDatasets(dataset))}
            </div>
        </>
    );
};

export default DatasetComponent;