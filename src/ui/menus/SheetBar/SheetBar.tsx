/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from '@mui/system';
import { SheetController } from '../../../grid/controller/sheetController';
import { colors } from '../../../theme/colors';
// import { Tab, Tabs } from '@mui/material';
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useLocalFiles } from '../../contexts/LocalFiles';
import { focusGrid } from '../../../helpers/focusGrid';
import { SheetBarTab } from './SheetBarTab';
import { ButtonGroup, ButtonUnstyled } from '@mui/material';
import { Sheet } from '../../../grid/sheet/Sheet';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface Props {
  sheetController: SheetController;
}

const ARROW_SCROLL_AMOUNT = 100;

export const SheetBar = (props: Props): JSX.Element => {
  const { sheetController } = props;

  // rename sheet
  const localFiles = useLocalFiles();
  const [isRenaming, setIsRenaming] = useState<number | false>(false);
  const onRenameSheet = useCallback(
    (name?: string) => {
      if (name) {
        sheetController.sheet.rename(name);
        localFiles.save();
      }
      setIsRenaming(false);
    },
    [localFiles, sheetController.sheet]
  );

  // activate sheet
  const [activeSheet, setActiveSheet] = useState(sheetController.current);

  // handle disabling left arrow and right arrow
  const [sheets, setSheets] = useState<HTMLDivElement | undefined>();
  const [leftArrow, setLeftArrow] = useState<HTMLElement | undefined>();
  const [rightArrow, setRightArrow] = useState<HTMLElement | undefined>();
  const leftRef = useCallback(
    (node: HTMLElement) => {
      setLeftArrow(node);
      if (!sheets || !node) return;
      const hide = sheets.scrollLeft === 0 || sheets.offsetWidth === sheets.scrollWidth;
      node.style.opacity = hide ? '0.25' : '1';
      node.style.cursor = hide ? 'auto' : 'pointer';
    },
    [sheets]
  );
  const rightRef = useCallback(
    (node: HTMLElement) => {
      setRightArrow(node);
      if (!sheets || !node) return;
      const hide =
        sheets.offsetWidth === sheets.scrollWidth ||
        Math.round(sheets.scrollLeft) === Math.round(sheets.scrollWidth - sheets.offsetWidth);
      node.style.opacity = hide ? '0.25' : '1';
      node.style.cursor = hide ? 'auto' : 'pointer';
    },
    [sheets]
  );
  const sheetsRef = useCallback(
    (node: HTMLDivElement) => {
      setSheets(node);
      if (!node) return;
      node.addEventListener('scroll', () => {
        if (leftArrow) {
          const hide = node.scrollLeft === 0 || node.offsetWidth === node.scrollWidth;
          leftArrow.style.opacity = hide ? '0.25' : '1';
          leftArrow.style.cursor = hide ? 'auto' : 'pointer';
        }
        if (rightArrow) {
          const hide =
            node.offsetWidth === node.scrollWidth ||
            Math.round(node.scrollLeft) === Math.round(node.scrollWidth - node.offsetWidth);
          rightArrow.style.opacity = hide ? '0.25' : '1';
          rightArrow.style.cursor = hide ? 'auto' : 'pointer';
        }
      });
    },
    [leftArrow, rightArrow]
  );

  // handle drag tabs
  const down = useRef<
    | { tab: HTMLElement; x: number; order: number; original: number; offset: number; id: string; actualOrder: number }
    | undefined
  >();
  const handlePointerDown = useCallback(
    (options: { event: React.PointerEvent<HTMLDivElement>; index: number; sheet: Sheet }) => {
      const { event, index, sheet } = options;
      setActiveSheet((prevState: number) => {
        if (prevState !== index) {
          sheetController.current = index;
          setActiveSheet(index);
          return index;
        }
        return prevState;
      });
      const tab = event.currentTarget;
      if (tab) {
        const rect = tab.getBoundingClientRect();
        down.current = {
          tab,
          x: event.clientX,
          order: sheet.order,
          original: sheet.order,
          actualOrder: sheet.order,
          offset: event.clientX - rect.left,
          id: sheet.id,
        };
      }
      event.preventDefault();
    },
    [sheetController]
  );

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (down.current) {
      event.stopPropagation();
      event.preventDefault();
      // store current tabs (except the dragging tab)
      const tabs: { rect: DOMRect; order: number; element: HTMLDivElement }[] = [];
      const tab = down.current.tab;
      down.current.tab.parentElement?.childNodes.forEach((node) => {
        if (node !== tab) {
          const element = node as HTMLDivElement;
          let order = element.getAttribute('data-order');
          if (order) {
            tabs.push({ rect: element.getBoundingClientRect(), order: parseInt(order), element });
          }
        }
      });

      // search for an overlap from the current tabs to replace its order
      const overlap = tabs.find((tab) => event.clientX >= tab.rect.left && event.clientX <= tab.rect.right);
      if (overlap) {
        const newOrder = overlap.order + (down.current.order <= overlap.order ? 1 : 0);

        // if (newOrder > down.current.order) {
        //   down.current.x = down.current.offset + event.clientX;
        // } else {
        //   down.current.x = down.current.offset + event.clientX - overlap.element.offsetWidth;
        // }
        down.current.actualOrder = newOrder - 0.5;
        // tab.style.order = newOrder.toString();
        down.current.order = newOrder;
        // down.current.tab.style.transform = '';
      }

      // otherwise transform the button so it looks like its moving
      else {
        down.current.tab.style.transform = `translateX(${event.clientX - down.current.x}px)`;
      }
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    if (down.current) {
      if (down.current.order !== down.current.original) {
        sheetController.reorderSheet(down.current.id, down.current.actualOrder);
      }
      down.current.tab.style.transform = '';
      down.current = undefined;
    }
  }, [sheetController]);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  return (
    <div
      className="sheet-tabs"
      style={{
        height: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.25rem',
        width: '100%',
        background: '#eeeeee',
        fontSize: '0.7rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          overflow: 'hidden visible',
        }}
      >
        <ButtonUnstyled
          style={{
            border: 'none',
            padding: '0 1rem',
            cursor: 'pointer',
          }}
          onClick={() => {
            sheetController.addSheet();
            setActiveSheet(sheetController.current);
          }}
        >
          +
        </ButtonUnstyled>
        <div
          ref={sheetsRef}
          style={{
            display: 'flex',
            flexShrink: '1',
            width: '100%',
            overflow: 'hidden visible',
          }}
          onWheel={(e) => {
            if (!sheets) return;
            if (e.deltaX) {
              sheets.scrollLeft += e.deltaX;
            }
          }}
        >
          {sheetController.sheets.map((sheet, index) => (
            <SheetBarTab
              key={index}
              onPointerDown={handlePointerDown}
              active={activeSheet === index}
              sheet={sheet}
              index={index}
            />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
        <ButtonUnstyled
          ref={leftRef}
          onClick={() => {
            if (sheets) {
              sheets.scrollLeft -= ARROW_SCROLL_AMOUNT;
            }
          }}
          style={{
            border: 'none',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ChevronLeft />
        </ButtonUnstyled>
        <ButtonUnstyled
          ref={rightRef}
          onClick={() => {
            if (sheets) {
              sheets.scrollLeft += ARROW_SCROLL_AMOUNT;
            }
          }}
          style={{
            border: 'none',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ChevronRight />
        </ButtonUnstyled>
      </div>
    </div>
  );
};
