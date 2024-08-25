import React from "react";
import Editor, { OnChange, OnMount } from "@monaco-editor/react";

interface MonacoEditorProps {
  code: string;
  onChange: OnChange;
  theme: string; // Theme prop
}

class MonacoEditor extends React.Component<MonacoEditorProps> {
  handleEditorDidMount: OnMount = (editor, monaco) => {
    editor.focus();
  };

  render() {
    const { theme, code, onChange } = this.props;

    return (
      <Editor
        height="80vh"
        theme={theme} // Use the theme prop here
        defaultLanguage="sql"
        defaultValue={code}
        onChange={onChange}
        onMount={this.handleEditorDidMount}
      />
    );
  }
}

export default MonacoEditor;
