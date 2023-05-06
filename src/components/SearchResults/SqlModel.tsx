import * as Icon from 'react-feather';
import React, {useEffect, useMemo, useState} from 'react';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import './ModelStyles.css';
import axios from 'axios';
import {Loading} from '../visus/Loading/Loading';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
const baseurl = 'http://127.0.0.1:8000/query?id=';

interface QueryStructure {
  data: Array<string>;
  error: boolean;
  message: string;
  dtypes: Array<string>;
}

const SqlModel: React.FC<{id: string}> = ({id}) => {
  const [show, setshow] = useState<boolean>(false);
  const [query_results, setQueryResults] = useState<QueryStructure>({
    data: [],
    error: false,
    message: '',
    dtypes: [],
  });
  const [loading, setloading] = useState(false);
  const text = 'Run SQL';

  const fetchData = (query: string) => {
    setloading(true);
    axios
      .get(baseurl + id + '&query=' + query)
      .then(res => {
        setQueryResults({
          data: JSON.parse(res.data.data),
          error: res.data.error,
          message: res.data.message,
          dtypes: res.data.dtypes,
        });
      })
      .then(() => setloading(false));
  };

  useEffect(() => {
    console.log('query results updated to');
    console.log(query_results);
  }, [query_results]);

  const toggleModel = () => {
    setshow(prev => !prev);
  };

  return (
    <>
      <button
        className="btn btn-sm btn-outline-primary"
        onClick={() => {
          fetchData('');
          toggleModel();
        }}
      >
        <Icon.Edit className="feather" /> {text}
      </button>
      <PopupModel
        show={show}
        toggleModel={toggleModel}
        loading={loading}
        query_results={query_results}
        fetchData={fetchData}
      />
    </>
  );
};
interface ModelProps {
  show: boolean;
  loading: boolean;
  query_results: QueryStructure;
  toggleModel: () => void;
  fetchData: (query: string) => void;
}

const PopupModel: React.FC<ModelProps> = ({
  show,
  loading,
  query_results,
  toggleModel,
  fetchData,
}) => {
  const [sqlQuery, setsqlQuery] = useState<string>('select * from TABLE;');
  useEffect(() => {
    setsqlQuery('select * from TABLE;');
  }, [show]);

  const TableComponent = useMemo(() => {
    if (query_results && query_results.data.length) {
      return (
        <div className="results-div">
          <Table style={{width: '100%'}}>
            <TableHead style={{width: '100%', position: 'sticky', top: '0'}}>
              <TableRow style={{backgroundColor: '#63508b'}}>
                {Object.keys(query_results.data[0]).map((col, id) => (
                  <TableCell key={id} style={{color: 'white'}}>
                    {col}
                    <div>
                      <span className="badge badge-pill semtype semtype-enumeration">
                        {query_results.dtypes[id]}
                      </span>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {query_results.data.map((row, id) => (
                <TableRow key={id}>
                  {Object.values(row).map((val, id) => (
                    <TableCell key={id}>{val}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }
    return <div></div>;
  }, [query_results]);

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

              <div
                className="icon"
                onClick={() => setsqlQuery('select * from TABLE;')}
              >
                <Icon.RefreshCw className="feather" />
              </div>
              <div className="icon" onClick={() => setsqlQuery('')}>
                <Icon.XOctagon className="feather" />
              </div>
              <div className="run-btn" onClick={() => fetchData(sqlQuery)}>
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
            rows={5}
          />
          {!loading && query_results.data && (
            <span>Total {query_results.data.length} Rows Fetched</span>
          )}
        </div>
        {!loading &&
          !query_results.error &&
          query_results.data.length &&
          TableComponent}
        {query_results.error && !loading && <div>{query_results.message}</div>}
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
