import React, { useEffect, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { ActionTypes } from '../utils';

interface NumberCellProps {
  initialValue: any;
  columnId: string;
  rowIndex: number;
  dataDispatch: React.Dispatch<any>;
}

interface ValueState {
  value: any;
  update: boolean;
}

const NumberCell: React.FC<NumberCellProps> = ({
  initialValue,
  columnId,
  rowIndex,
  dataDispatch,
}) => {
  const [value, setValue] = useState<ValueState>({
    value: initialValue,
    update: false,
  });

  const onChange = (e: ContentEditableEvent) => {
    setValue({ value: e.target.value, update: false });
  };

  const onBlur = () => {
    setValue(old => ({ value: old.value, update: true }));
  };

  useEffect(() => {
    setValue({ value: initialValue, update: false });
  }, [initialValue]);

  useEffect(() => {
    if (value.update) {
      dataDispatch({
        type: ActionTypes.UPDATE_CELL,
        columnId,
        rowIndex,
        value: value.value,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.update, columnId, rowIndex]);

  return (
    <ContentEditable
      html={(value.value && value.value.toString()) || ''}
      onChange={onChange}
      onBlur={onBlur}
      className="data-input text-align-right"
    />
  );
};

export default NumberCell;
