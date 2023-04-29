import * as Icon from 'react-feather';
import React, {useState} from 'react';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import './ModelStyles.css';
import axios from 'axios';
import {Loading} from '../visus/Loading/Loading';

const baseurl = 'http://127.0.0.1:8000/download?id=';

const SqlModel: React.FC<{id: string}> = ({id}) => {
  const [show, setshow] = useState<boolean>(true);
  const [query_results, setQueryResults] = useState<string>('');
  const [loading, setloading] = useState(false);
  const text = 'Run SQL';

  const fetchData = () => {
    setloading(true);
    axios
      .get(baseurl + id)
      .then(res => setQueryResults(res.data))
      .then(() => setloading(false));
    toggleModel();
  };

  const toggleModel = () => {
    setshow(prev => !prev);
  };

  return (
    <>
      <button className="btn btn-sm btn-outline-primary" onClick={fetchData}>
        <Icon.Edit className="feather" /> {text}
      </button>
      <PopupModel
        show={show}
        toggleModel={toggleModel}
        loading={loading}
        query_results={query_results}
      />
    </>
  );
};
interface ModelProps {
  show: boolean;
  loading: boolean;
  query_results: string;
  toggleModel: () => void;
}

const PopupModel: React.FC<ModelProps> = ({
  show,
  loading,
  query_results,
  toggleModel,
}) => {
  const [sqlQuery, setsqlQuery] = useState<string>('');

  return (
    <Modal open={show} onClose={toggleModel}>
      <div className="modal-div ">
        <div className="close-btn">
          <Icon.X className="feather" onClick={toggleModel} />
        </div>
        <div className="header-div">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Run SQL Queries on the dataset
          </Typography>
        </div>
        <div className="toolbar">
          <span>Editor</span>
          <div className="tool-btns">
            <div className="right-btns">
              <div className="icon">
                <Icon.Copy className="feather" />
              </div>

              <div className="icon">
                <Icon.RefreshCw className="feather" />
              </div>
              <div className="icon">
                <Icon.XOctagon className="feather" />
              </div>
              <div
                className="run-btn"
                onClick={() => console.log(query_results)}
              >
                Run
              </div>
            </div>
          </div>
        </div>

        <div className="query-div">
          <textarea
            placeholder="Write Query"
            value={sqlQuery}
            onChange={e => setsqlQuery(e.target.value)}
            rows={8}
          />
        </div>
        {!loading && (
          <div className="results-div">{'tesjd;afkdj f;ajd ;'} </div>
        )}
        {loading && (
          <div className="loading-div">
            <Loading message="Loading..." />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SqlModel;
