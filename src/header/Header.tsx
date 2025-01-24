import React, { useState, useEffect } from 'react';
import { Constants } from '../utils';
import AddColumnHeader from './AddColumnHeader';
import DataTypeIcon from './DataTypeIcon';
import {
  autoPlacement,
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import HeaderMenuFloating from './HeaderMenuFloating';
interface HeaderProps {
  column: {
    id: string | number;
    created: boolean;
    label: string;
    dataType: string;
    getResizerProps: () => any;
    getHeaderProps: () => any;
  };
  setSortBy: (sortBy: { id: string | number; desc: boolean }[]) => void;
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
  const floating = useFloating<HTMLDivElement>({
    open: showHeaderMenu,
    onOpenChange: setShowHeaderMenu,
    middleware: [
      offset(10),
      flip({ fallbackAxisSideDirection: 'end' }),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });
  const click = useClick(floating.context);
  const role = useRole(floating.context);
  const dismiss = useDismiss(floating.context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    //focus,
    dismiss,
    role,
  ]);

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
        <div
          {...getHeaderProps()}
          ref={floating.refs.setPositionReference}
          className="th noselect d-inline-block"
        >
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
          <div
            className="overlay"
            ref={floating.refs.setReference}
            onClick={() => setShowHeaderMenu(false)}
            {...getReferenceProps()}
          />
        )}
        {showHeaderMenu && (
          <FloatingFocusManager context={floating.context} modal={false}>
            <HeaderMenuFloating
              label={label}
              dataType={dataType}
              floating={floating}
              floatingProps={getFloatingProps}
              dataDispatch={dataDispatch}
              setSortBy={setSortBy}
              columnId={id}
              setShowHeaderMenu={setShowHeaderMenu}
            />
          </FloatingFocusManager>
        )}
      </>
    );
  }

  return getHeader();
};

export default Header;
