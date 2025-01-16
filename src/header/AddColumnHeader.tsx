import PlusIcon from '../img/Plus';
import React from 'react';
import { ActionTypes, Constants } from '../utils';

interface AddColumnHeaderProps {
  getHeaderProps: () => any;
  dataDispatch: React.Dispatch<any>;
}

const AddColumnHeader: React.FC<AddColumnHeaderProps> = ({ getHeaderProps, dataDispatch }) => {
  return (
    <div {...getHeaderProps()} className="th noselect d-inline-block">
      <div
        className="th-content d-flex justify-content-center"
        onClick={() =>
          dataDispatch({
            type: ActionTypes.ADD_COLUMN_TO_LEFT,
            columnId: Constants.ADD_COLUMN_ID,
            focus: true,
          })
        }
      >
        <span className="svg-icon-sm svg-gray">
          <PlusIcon />
        </span>
      </div>
    </div>
  );
}

export default AddColumnHeader;
