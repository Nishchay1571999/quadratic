import { debugWebWorkers, debugWebWorkersMessages } from '@/debugFlags';
import { JsCodeResult, JsGetCellResponse } from '@/quadratic-core-types';
import type { CoreJavascriptGetCells, CoreJavascriptMessage, JavascriptCoreMessage } from '../javascriptCoreMessages';
import { javascript } from './javascript/javascript';

class JavascriptCore {
  private coreMessagePort?: MessagePort;
  private id = 0;
  private waitingForResponse: Record<number, Function> = {};

  init(messagePort: MessagePort) {
    this.coreMessagePort = messagePort;
    this.coreMessagePort.onmessage = this.handleMessage;

    if (debugWebWorkers) console.log('[javascriptCore] initialized');
  }

  private send(message: JavascriptCoreMessage) {
    if (!this.coreMessagePort) throw new Error('coreMessagePort not initialized');
    this.coreMessagePort.postMessage(message);
  }

  private handleMessage = async (e: MessageEvent<CoreJavascriptMessage>) => {
    if (debugWebWorkersMessages) console.log(`[javascriptCore] message: ${e.data.type}`);

    switch (e.data.type) {
      case 'coreJavascriptRun':
        javascript.run(e.data);
        return;
    }

    if (e.data.id !== undefined) {
      const response = this.waitingForResponse[e.data.id];
      if (response) {
        response(e.data);
        delete this.waitingForResponse[e.data.id];
        return;
      } else {
        console.error(`[javascriptCore] no response for id ${e.data.id}`);
      }
    }

    console.warn("[javascriptCore] didn't handle message", e.data);
  };

  sendJavascriptResults(transactionId: string, results: JsCodeResult) {
    this.send({
      type: 'javascriptCoreResults',
      transactionId,
      results,
    });
  }

  sendGetCells(
    transactionId: string,
    x: number,
    y: number,
    w: number,
    h: number,
    sheet?: string,
    lineNumber?: number
  ): Promise<JsGetCellResponse[] | undefined> {
    return new Promise((resolve) => {
      const id = this.id++;
      this.waitingForResponse[id] = (message: CoreJavascriptGetCells) => resolve(message.cells);
      this.send({ type: 'javascriptCoreGetCells', transactionId, id, x, y, w, h, sheet, lineNumber });
    });
  }
}

export const javascriptCore = new JavascriptCore();
