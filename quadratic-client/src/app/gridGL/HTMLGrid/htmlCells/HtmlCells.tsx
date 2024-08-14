import { useCallback } from 'react';
import './HtmlCells.css';
import { htmlCellsHandler } from './htmlCellsHandler';

// parent of htmlCells. Handled in htmlCells.ts
export const HtmlCells = () => {
  const divRef = useCallback((node: HTMLDivElement) => {
    htmlCellsHandler.attach(node);
  }, []);

  return (
    <div
      ref={divRef}
      style={{
        pointerEvents: 'none',
      }}
    />
  );
};
