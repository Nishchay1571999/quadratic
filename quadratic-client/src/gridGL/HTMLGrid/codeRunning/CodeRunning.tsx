import { events } from '@/events/events';
import { sheets } from '@/grid/controller/Sheets';
import { MultiplayerUser } from '@/web-workers/multiplayerWebWorker/multiplayerTypes';
import { CodeRun, PythonStateType } from '@/web-workers/pythonWebWorker/pythonClientMessages';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import './CodeRunning.css';

interface Code {
  sheetId: string;
  sessionId?: string;
  left: string;
  top: string;
  color: string;
  alpha: number;
}

const CIRCULAR_PROGRESS_SIZE = 14;
const WAITING_EXECUTION_ALPHA = 0.5;

export const CodeRunning = () => {
  const [playerCode, setPlayerCode] = useState<Code[]>([]);

  // update player's code runs
  useEffect(() => {
    const updatePythonState = (_state: PythonStateType, current?: CodeRun, awaitingExecution?: CodeRun[]) => {
      const code: Code[] = [];
      if (current) {
        const rectangle = sheets.sheet.getCellOffsets(current.sheetPos.x, current.sheetPos.y);
        code.push({
          sheetId: current.sheetPos.sheetId,
          left: `${rectangle.x + rectangle.width / 2 - CIRCULAR_PROGRESS_SIZE / 2}px`,
          top: `${rectangle.y + rectangle.height / 2 - CIRCULAR_PROGRESS_SIZE / 2}px`,
          color: 'black',
          alpha: 1,
        });
      }
      awaitingExecution?.forEach((cell) => {
        const rectangle = sheets.sheet.getCellOffsets(cell.sheetPos.x, cell.sheetPos.y);
        code.push({
          sheetId: cell.sheetPos.sheetId,
          left: `${rectangle.x + rectangle.width / 2 - CIRCULAR_PROGRESS_SIZE / 2}px`,
          top: `${rectangle.y + rectangle.height / 2 - CIRCULAR_PROGRESS_SIZE / 2}px`,
          color: 'black',
          alpha: WAITING_EXECUTION_ALPHA,
        });
      });
      setPlayerCode(code);
    };
    events.on('pythonState', updatePythonState);
  }, []);

  // update multiplayer's code runs
  const [multiplayerCode, setMultiplayerCode] = useState<Code[]>([]);
  useEffect(() => {
    const updateMultiplayerUsers = (multiplayerUsers: MultiplayerUser[]) => {
      if (multiplayerUsers?.length === 0) return;
      const sheet = sheets.sheet;
      const code: Code[] = [];
      multiplayerUsers.forEach((user) => {
        user.parsedCodeRunning.forEach((cell, index) => {
          if (cell.sheetId === sheet.id) {
            const rectangle = sheet.getCellOffsets(cell.x, cell.y);
            code.push({
              sheetId: cell.sheetId,
              sessionId: user.session_id,
              left: `${rectangle.x + rectangle.width / 2 - CIRCULAR_PROGRESS_SIZE / 2}px`,
              top: `${rectangle.y + rectangle.height / 2 - CIRCULAR_PROGRESS_SIZE / 2}px`,
              color: user.colorString,
              alpha: index === 0 ? 1 : WAITING_EXECUTION_ALPHA,
            });
          }
        });
      });
      setMultiplayerCode(code);
    };
    events.on('multiplayerUpdate', updateMultiplayerUsers);

    const updateMultiplayerCodeRunning = (multiplayerUser: MultiplayerUser) => {
      // remove all code runs from user if they are not running any code
      if (multiplayerUser.parsedCodeRunning.length === 0) {
        setMultiplayerCode((prev) => prev.filter((code) => code.sessionId !== multiplayerUser.session_id));
      } else {
        const sheet = sheets.sheet;
        const code: Code[] = [];
        multiplayerUser.parsedCodeRunning.forEach((cell, index) => {
          if (cell.sheetId === sheet.id) {
            const rectangle = sheet.getCellOffsets(cell.x, cell.y);
            code.push({
              sheetId: cell.sheetId,
              left: `${rectangle.x + rectangle.width / 2 - CIRCULAR_PROGRESS_SIZE / 2}px`,
              top: `${rectangle.y + rectangle.height / 2 - CIRCULAR_PROGRESS_SIZE / 2}px`,
              color: multiplayerUser.colorString,
              alpha: index === 0 ? 1 : WAITING_EXECUTION_ALPHA,
            });
          }
        });
        setMultiplayerCode((prev) => [
          ...prev.filter((code) => code.sessionId !== multiplayerUser.session_id),
          ...code,
        ]);
      }
    };
    events.on('multiplayerCodeRunning', updateMultiplayerCodeRunning);

    return () => {
      events.on('multiplayerUpdate', updateMultiplayerUsers);
      events.off('multiplayerCodeRunning', updateMultiplayerCodeRunning);
    };
  }, [playerCode?.length]);

  return (
    <div className="code-running-container">
      {[...playerCode, ...multiplayerCode].map((code, index) => (
        <CircularProgress
          color={code.color === 'black' ? 'primary' : undefined}
          size={`${CIRCULAR_PROGRESS_SIZE}px`}
          key={index}
          sx={{ position: 'absolute', left: code.left, top: code, color: code.color }}
        />
      ))}
    </div>
  );
};
