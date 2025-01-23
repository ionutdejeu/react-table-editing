import React, { useState, useEffect } from 'react';
import { Constants } from '../utils';
import AddColumnHeader from './AddColumnHeader';
import DataTypeIcon from './DataTypeIcon';
import { autoUpdate, useFloating } from '@floating-ui/react';

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
  const [showHeaderMenu, setShowHeaderMenu] = useState<boolean>(
    created || false
  );
  const [_, setHeaderMenuAnchorRef] = useState<HTMLDivElement | null>(null);
  const { floatingStyles, refs } = useFloating<HTMLButtonElement>({
    open: showHeaderMenu,
    onOpenChange: setShowHeaderMenu,
    middleware: [],
    whileElementsMounted: autoUpdate,
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
          <pre ref={refs} style={floatingStyles}>
            Header Menu
          </pre>
        )}
      </>
    );
  }

  return getHeader();
};

export default Header;
