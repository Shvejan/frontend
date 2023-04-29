import * as Icon from 'react-feather';
import React, {useState} from 'react';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import './ModelStyles.css';

const SqlModel: React.FC = () => {
  const [show, setshow] = useState<boolean>(true);
  const text = 'Run SQL';

  const toggleModel = () => {
    console.log('toggeling model');
    setshow(prev => !prev);
  };

  return (
    <>
      <button className="btn btn-sm btn-outline-primary" onClick={toggleModel}>
        <Icon.Edit className="feather" /> {text}
      </button>
      <PopupModel show={show} toggleModel={toggleModel} />
    </>
  );
};
interface ModelProps {
  show: boolean;
  toggleModel: () => void;
}

const PopupModel: React.FC<ModelProps> = ({show, toggleModel}) => {
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
        <div className="results-div">No Results</div>
      </div>
    </Modal>
  );
};

export default SqlModel;
