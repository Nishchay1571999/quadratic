import { provideCompletionItems, provideHover } from '@/quadratic-rust-client/quadratic_rust_client';
import Editor, { Monaco } from '@monaco-editor/react';
import monaco from 'monaco-editor';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { hasPermissionToEditFile } from '../../../actions';
import { editorInteractionStateAtom } from '../../../atoms/editorInteractionStateAtom';
import { pyrightWorker, uri } from '../../../web-workers/pythonLanguageServer/worker';
import { useCodeEditor } from './CodeEditorContext';
import { CodeEditorPlaceholder } from './CodeEditorPlaceholder';
import { FormulaLanguageConfig, FormulaTokenizerConfig } from './FormulaLanguageModel';
import {
  provideCompletionItems as provideCompletionItemsPython,
  provideHover as provideHoverPython,
  provideSignatureHelp as provideSignatureHelpPython,
} from './PythonLanguageModel';
import { QuadraticEditorTheme } from './quadraticEditorTheme';
import { useEditorCellHighlights } from './useEditorCellHighlights';
// TODO(ddimaria): leave this as we're looking to add this back in once improved
// import { useEditorDiagnostics } from './useEditorDiagnostics';
// import { Diagnostic } from 'vscode-languageserver-types';
import useEventListener from '@/hooks/useEventListener';
import { javascriptLibrary } from '@/web-workers/javascriptWebWorker/worker/javascript/javascriptLibrary';
import { typescriptLibrary } from '@/web-workers/javascriptWebWorker/worker/javascript/typescriptLibrary';
import { EvaluationResult } from '@/web-workers/pythonWebWorker/pythonTypes';
import { useEditorOnSelectionChange } from './useEditorOnSelectionChange';
import { useEditorReturn } from './useEditorReturn';

interface Props {
  editorContent: string | undefined;
  setEditorContent: (value: string | undefined) => void;
  closeEditor: (skipSaveCheck: boolean) => void;
  evaluationResult?: EvaluationResult;
  // TODO(ddimaria): leave this as we're looking to add this back in once improved
  // diagnostics?: Diagnostic[];
}

// need to track globally since monaco is a singleton
let registered = false;

export const CodeEditorBody = (props: Props) => {
  const { editorContent, setEditorContent, closeEditor, evaluationResult } = props;
  const editorInteractionState = useRecoilValue(editorInteractionStateAtom);
  const language = editorInteractionState.mode;
  const readOnly = !hasPermissionToEditFile(editorInteractionState.permissions);
  const [didMount, setDidMount] = useState(false);
  const [isValidRef, setIsValidRef] = useState(false);
  const { editorRef, monacoRef } = useCodeEditor();

  useEditorCellHighlights(isValidRef, editorRef, monacoRef, language);
  useEditorOnSelectionChange(isValidRef, editorRef, monacoRef, language);
  useEditorReturn(isValidRef, editorRef, monacoRef, language, evaluationResult);

  // TODO(ddimaria): leave this as we're looking to add this back in once improved
  // useEditorDiagnostics(isValidRef, editorRef, monacoRef, language, diagnostics);

  useEffect(() => {
    if (editorInteractionState.showCodeEditor) {
      // focus editor on show editor change
      editorRef.current?.focus();
      editorRef.current?.setPosition({ lineNumber: 0, column: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorInteractionState.showCodeEditor]);

  const runEditorAction = (e: CustomEvent<string>) => editorRef.current?.getAction(e.detail)?.run();
  useEventListener('run-editor-action', runEditorAction);
  const onMount = useCallback(
    (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;
      setIsValidRef(true);

      editor.focus();

      monaco.editor.defineTheme('quadratic', QuadraticEditorTheme);
      monaco.editor.setTheme('quadratic');

      // this needs to be before the register conditional below
      setDidMount(true);
      console.log(1);
      // Only register language once
      if (registered) return;
      console.log(2);
      monaco.languages.register({ id: 'Formula' });
      monaco.languages.setLanguageConfiguration('Formula', FormulaLanguageConfig);
      monaco.languages.setMonarchTokensProvider('Formula', FormulaTokenizerConfig);
      monaco.languages.registerCompletionItemProvider('Formula', {
        provideCompletionItems,
      });
      monaco.languages.registerHoverProvider('Formula', { provideHover });

      monaco.languages.register({ id: 'python' });

      monaco.languages.registerCompletionItemProvider('python', {
        provideCompletionItems: provideCompletionItemsPython,
        triggerCharacters: ['.', '[', '"', "'"],
      });

      monaco.languages.registerSignatureHelpProvider('python', {
        provideSignatureHelp: provideSignatureHelpPython,
        signatureHelpTriggerCharacters: ['(', ','],
      });
      monaco.languages.registerHoverProvider('python', { provideHover: provideHoverPython });

      // load the document in the python language server
      pyrightWorker?.openDocument({
        textDocument: { text: editorRef.current?.getValue() ?? '', uri, languageId: 'python' },
      });

      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        diagnosticCodesToIgnore: [1108, 1375, 1378],
      });
      monaco.editor.createModel(javascriptLibrary, 'javascript');
      monaco.editor.createModel(typescriptLibrary, 'typescript');
      console.log(3);
      registered = true;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setDidMount]
  );

  useEffect(() => {
    if (editorRef.current && monacoRef.current && didMount) {
      editorRef.current.addCommand(
        monacoRef.current.KeyCode.Escape,
        () => closeEditor(false),
        '!findWidgetVisible && !inReferenceSearchEditor && !editorHasSelection && !suggestWidgetVisible'
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeEditor, didMount]);

  useEffect(() => {
    return () => editorRef.current?.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100px',
        flex: '2',
      }}
    >
      <Editor
        height="100%"
        width="100%"
        language={language === 'Python' ? 'python' : language === 'Javascript' ? 'javascript' : undefined}
        value={editorContent}
        onChange={setEditorContent}
        onMount={onMount}
        options={{
          theme: 'light',
          readOnly,
          minimap: { enabled: true },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          scrollbar: {
            horizontal: 'hidden',
          },
          wordWrap: 'on',
        }}
      />
      {['Python', 'Javascript'].includes(language as string) && (
        <CodeEditorPlaceholder editorContent={editorContent} setEditorContent={setEditorContent} />
      )}
    </div>
  );
};
