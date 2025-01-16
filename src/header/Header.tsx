import React, { useState, useEffect } from 'react';
import { usePopper } from 'react-popper';
import { Constants } from '../utils';
import AddColumnHeader from './AddColumnHeader';
import DataTypeIcon from './DataTypeIcon';
import HeaderMenu from './HeaderMenu';

interface HeaderProps {
  column: {
    id: string | number;
    created: boolean;
    label: string;
    dataType: string;
    getResizerProps: () => any;
    getHeaderProps: () => any;
  };
  setSortBy: (columnId: string | number) => void;
  dataDispatch: React.Dispatch<any>;
}

const Header: React.FC<HeaderProps> = ({
  column: { id, created, label, dataType, getResizerProps, getHeaderProps },
  setSortBy,
  dataDispatch,
}) => {
  const [showHeaderMenu, setShowHeaderMenu] = useState<boolean>(created || false);
  const [headerMenuAnchorRef, setHeaderMenuAnchorRef] = useState<HTMLDivElement | null>(null);
  const [headerMenuPopperRef, setHeaderMenuPopperRef] = useState<HTMLDivElement | null>(null);
  const { styles, attributes } = usePopper(headerMenuAnchorRef, headerMenuPopperRef, {
    placement: 'bottom',
    strategy: 'absolute',
  });

  useEffect(() => {
    if (created) {
      setShowHeaderMenu(true);
    }
  }, [created]);

  function getHeader() {
    if (id === Constants.ADD_COLUMN_ID) {
      return (
        <AddColumnHeader
          dataDispatch={dataDispatch}
          getHeaderProps={getHeaderProps}
        />
      );
    }

    return (
      <>
        <div {...getHeaderProps()} className="th noselect d-inline-block">
          <div
            className="th-content"
            onClick={() => setShowHeaderMenu(true)}
            ref={setHeaderMenuAnchorRef}
          >
            <span className="svg-icon svg-gray icon-margin">
              <DataTypeIcon dataType={dataType} />
            </span>
            {label}
          </div>
          <div {...getResizerProps()} className="resizer" />
        </div>
        {showHeaderMenu && (
          <div className="overlay" onClick={() => setShowHeaderMenu(false)} />
        )}
        {showHeaderMenu && (
          <HeaderMenu
            label={label}
            dataType={dataType}
            popper={{ ...headerMenuPopperRef }}
            popperRef={setHeaderMenuPopperRef}
            dataDispatch={dataDispatch}
            setSortBy={setSortBy}
            columnId={id}
            setShowHeaderMenu={setShowHeaderMenu}
          />
        )}
      </>
    );
  }

  return getHeader();
}

export default Header;
