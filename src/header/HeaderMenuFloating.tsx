import React, { useEffect, useState } from 'react';
import ArrowUpIcon from '../img/ArrowUp';
import ArrowDownIcon from '../img/ArrowDown';
import ArrowLeftIcon from '../img/ArrowLeft';
import ArrowRightIcon from '../img/ArrowRight';
import TrashIcon from '../img/Trash';
import { grey } from '../colors';
import { ActionTypes, shortId } from '../utils';
import DataTypeIcon from './DataTypeIcon';
import {
  useDismiss,
  UseFloatingReturn,
  useFocus,
  useHover,
  useInteractions,
  UseInteractionsReturn,
} from '@floating-ui/react';
import FloatTypesMenu from './FloatTypesMenu';
interface HeaderMenuFloatingProps {
  label: string;
  dataType: string;
  columnId: string | number;
  setSortBy: (sortBy: { id: string | number; desc: boolean }[]) => void;
  floating: UseFloatingReturn;
  floatingProps: UseInteractionsReturn['getFloatingProps'];
  dataDispatch: React.Dispatch<any>;
  setShowHeaderMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderMenuFloating: React.FC<HeaderMenuFloatingProps> = ({
  label,
  dataType,
  columnId,
  setSortBy,
  floating,
  floatingProps,
  dataDispatch,
  setShowHeaderMenu,
}) => {
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const [header, setHeader] = useState<string>(label);

  const [showTypeMenu, setShowTypeMenu] = useState<boolean>(false);

  const onTypeMenuClose = () => {
    setShowTypeMenu(false);
    setShowHeaderMenu(false);
  };

  useEffect(() => {
    setHeader(label);
  }, [label]);

  useEffect(() => {
    if (inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  }, [inputRef]);

  const buttons = [
    {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        dataDispatch({
          type: ActionTypes.UPDATE_COLUMN_HEADER,
          columnId,
          label: header,
        });
        setSortBy([{ id: columnId, desc: false }]);
        setShowHeaderMenu(false);
      },
      icon: <ArrowUpIcon />,
      label: 'Sort ascending',
    },
    {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        dataDispatch({
          type: ActionTypes.UPDATE_COLUMN_HEADER,
          columnId,
          label: header,
        });
        setSortBy([{ id: columnId, desc: true }]);
        setShowHeaderMenu(false);
      },
      icon: <ArrowDownIcon />,
      label: 'Sort descending',
    },
    {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        dataDispatch({
          type: ActionTypes.UPDATE_COLUMN_HEADER,
          columnId,
          label: header,
        });
        dataDispatch({
          type: ActionTypes.ADD_COLUMN_TO_LEFT,
          columnId,
          focus: false,
        });
        setShowHeaderMenu(false);
      },
      icon: <ArrowLeftIcon />,
      label: 'Insert left',
    },
    {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        dataDispatch({
          type: ActionTypes.UPDATE_COLUMN_HEADER,
          columnId,
          label: header,
        });
        dataDispatch({
          type: ActionTypes.ADD_COLUMN_TO_RIGHT,
          columnId,
          focus: false,
        });
        setShowHeaderMenu(false);
      },
      icon: <ArrowRightIcon />,
      label: 'Insert right',
    },
    {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        dataDispatch({ type: ActionTypes.DELETE_COLUMN, columnId });
        setShowHeaderMenu(false);
      },
      icon: <TrashIcon />,
      label: 'Delete',
    },
  ];

  const handleColumnNameKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      dataDispatch({
        type: ActionTypes.UPDATE_COLUMN_HEADER,
        columnId,
        label: header,
      });
      setShowHeaderMenu(false);
    }
  };

  const handleColumnNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeader(e.target.value);
  };

  const handleColumnNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    dataDispatch({
      type: ActionTypes.UPDATE_COLUMN_HEADER,
      columnId,
      label: header,
    });
  };

  return (
    <div
      ref={floating.refs.setFloating}
      style={{ ...floating.floatingStyles, zIndex: 3 }}
      {...floatingProps()}
    >
      <div
        className="bg-white shadow-5 border-radius-md"
        style={{
          width: 240,
        }}
      >
        <div
          style={{
            paddingTop: '0.75rem',
            paddingLeft: '0.75rem',
            paddingRight: '0.75rem',
          }}
        >
          <div className="is-fullwidth" style={{ marginBottom: 12 }}>
            <input
              className="form-input is-fullwidth"
              ref={setInputRef}
              type="text"
              value={header}
              onChange={handleColumnNameChange}
              onBlur={handleColumnNameBlur}
              onKeyDown={handleColumnNameKeyDown}
            />
          </div>
          <span className="font-weight-600 font-size-75 color-grey-500 text-transform-uppercase">
            Property Type
          </span>
        </div>
        <div className="list-padding">
          <button
            className="sort-button"
            type="button"
            onMouseEnter={() => setShowTypeMenu(true)}
            onMouseLeave={() => setShowTypeMenu(false)}
          >
            <span className="svg-icon svg-text icon-margin">
              <DataTypeIcon dataType={dataType} />
            </span>
            <span className="text-transform-capitalize">{dataType}</span>
          </button>
          {showTypeMenu && (
            <FloatTypesMenu
              onClose={onTypeMenuClose}
              setShowTypeMenu={setShowTypeMenu}
              columnId={columnId}
              dataDispatch={dataDispatch}
            />
          )}
        </div>
        <div style={{ borderTop: `2px solid ${grey(200)}` }} />
        <div className="list-padding">
          {buttons.map(button => (
            <button
              type="button"
              className="sort-button"
              onMouseDown={button.onClick}
              key={shortId()}
            >
              <span className="svg-icon svg-text icon-margin">
                {button.icon}
              </span>
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderMenuFloating;
