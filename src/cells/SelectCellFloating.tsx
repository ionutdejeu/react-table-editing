import React, { useEffect, useState } from 'react';
import Badge from '../Badge';
import { grey } from '../colors';
import PlusIcon from '../img/Plus';
import { ActionTypes, randomColor } from '../utils';
import { useFloating } from '@floating-ui/react';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeading,
  PopoverTrigger,
} from '../float/Popover';

interface Option {
  label: string;
  backgroundColor: string;
}

interface SelectCellProps {
  initialValue: string;
  options: Option[];
  columnId: string;
  rowIndex: number;
  dataDispatch: React.Dispatch<any>;
}

const SelectCellFloating: React.FC<SelectCellProps> = ({
  initialValue,
  options,
  columnId,
  rowIndex,
  dataDispatch,
}) => {
  const [selectRef, setSelectRef] = useState<HTMLDivElement | null>(null);
  const [selectPop, setSelectPop] = useState<HTMLDivElement | null>(null);
  const [showSelect, setShowSelect] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addSelectRef, setAddSelectRef] = useState<HTMLInputElement | null>(
    null
  );

  const { refs } = useFloating({});

  const [value, setValue] = useState({ value: initialValue, update: false });

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
  }, [value, columnId, rowIndex, dataDispatch]);

  useEffect(() => {
    if (addSelectRef && showAdd) {
      addSelectRef.focus();
    }
  }, [addSelectRef, showAdd]);

  const getColor = (): string => {
    const match = options.find(option => option.label === value.value);
    return (match && match.backgroundColor) || grey(200);
  };

  const handleAddOption = () => {
    setShowAdd(true);
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if ((e.target as HTMLInputElement).value !== '') {
        dataDispatch({
          type: ActionTypes.ADD_OPTION_TO_COLUMN,
          option: (e.target as HTMLInputElement).value,
          backgroundColor: randomColor(),
          columnId,
        });
      }
      setShowAdd(false);
    }
  };

  const handleOptionBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value !== '') {
      dataDispatch({
        type: ActionTypes.ADD_OPTION_TO_COLUMN,
        option: e.target.value,
        backgroundColor: randomColor(),
        columnId,
      });
    }
    setShowAdd(false);
  };

  const handleOptionClick = (option: Option) => {
    setValue({ value: option.label, update: true });
    setShowSelect(false);
  };

  return (
    <>
      <Popover open={showSelect} onOpenChange={setShowSelect}>
        <PopoverTrigger onClick={() => setShowSelect(v => !v)}>
          <div className="cell-padding d-flex cursor-default align-items-center flex-1">
            {value.value && (
              <Badge value={value.value} backgroundColor={getColor()} />
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="Popover shadow-5 bg-white border-radius-md"
          style={{
            zIndex: 4,
            minWidth: 200,
            maxWidth: 320,
            maxHeight: 400,
            padding: '0.75rem',
            overflow: 'auto',
          }}
        >
          <PopoverHeading>Select</PopoverHeading>
          <PopoverDescription>
            <div
              className="d-flex flex-wrap-wrap"
              style={{ marginTop: '-0.5rem' }}
            >
              {options.map(option => (
                <div
                  key={option.label}
                  className="cursor-pointer mr-5 mt-5"
                  onClick={() => handleOptionClick(option)}
                >
                  <Badge
                    value={option.label}
                    backgroundColor={option.backgroundColor}
                  />
                </div>
              ))}
              {showAdd && (
                <div
                  className="mr-5 mt-5 bg-grey-200 border-radius-sm"
                  style={{
                    width: 120,
                    padding: '2px 4px',
                  }}
                >
                  <input
                    type="text"
                    className="option-input"
                    onBlur={handleOptionBlur}
                    ref={setAddSelectRef}
                    onKeyDown={handleOptionKeyDown}
                  />
                </div>
              )}
              <div
                className="cursor-pointer mr-5 mt-5"
                onClick={handleAddOption}
              >
                <Badge backgroundColor={grey(200)}>
                  <span className="svg-icon-sm svg-text">
                    <PlusIcon />
                  </span>
                </Badge>
              </div>
            </div>
          </PopoverDescription>
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default SelectCellFloating;
