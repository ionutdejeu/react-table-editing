import * as React from 'react';
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  offset,
  Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useId,
  useInteractions,
  useRole,
} from '@floating-ui/react';

import { cloneElement, isValidElement, useState } from 'react';

export const Main = () => {
  const [modal, setModal] = useState(true);

  return (
    <>
      <h1 className="text-5xl font-bold mb-8">Popover</h1>
      <div className="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4"></div>
    </>
  );
};
interface Props {
  render: (data: {
    close: () => void;
    labelId: string;
    descriptionId: string;
  }) => React.ReactNode;
  placement?: Placement;
  modal?: boolean;
  children?: React.ReactElement<HTMLElement>;
  bubbles?: boolean;
}

function PopoverComponent({
  children,
  render,
  placement,
  modal = true,
  bubbles = true,
}: Props) {
  const [open, setOpen] = useState(false);

  const nodeId = useFloatingNodeId();
  const { x, y, strategy, refs, context } = useFloating({
    nodeId,
    open,
    placement,
    onOpenChange: setOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context, {
      bubbles,
    }),
  ]);

  return (
    <FloatingNode id={nodeId}>
      {isValidElement(children) &&
        cloneElement(
          children,
          getReferenceProps({
            ref: refs.setReference,
            'data-open': open ? '' : undefined,
          } as React.HTMLProps<Element>)
        )}
      <FloatingPortal>
        {open && (
          <FloatingFocusManager
            context={context}
            modal={modal}
            children={
              <div
                className="bg-white border border-slate-900/10 shadow-md rounded px-4 py-6 bg-clip-padding"
                ref={refs.setFloating}
                style={{
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                }}
                aria-labelledby={labelId}
                aria-describedby={descriptionId}
                {...getFloatingProps()}
              >
                {render({
                  labelId,
                  descriptionId,
                  close: () => setOpen(false),
                })}
              </div>
            }
          ></FloatingFocusManager>
        )}
      </FloatingPortal>
    </FloatingNode>
  );
}

export function Popover(props: Props) {
  const parentId = useFloatingParentNodeId();

  // This is a root, so we wrap it with the tree
  if (parentId === null) {
    return (
      <FloatingTree>
        <PopoverComponent {...props} />
      </FloatingTree>
    );
  }

  return <PopoverComponent {...props} />;
}
