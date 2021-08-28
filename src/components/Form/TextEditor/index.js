import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import _ from "lodash";
import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Label } from "reactstrap";
import stringUtil from "utils/stringUtil";

const TextEditor = ({
  name,
  id = stringUtil.createRandom(),
  label,
  value,
  onChange,
  error,
  readOnly,
}) => {
  const [editorState, setEditorState] = useState();
  const handleChange = e => {
    setEditorState(e);
    if (onChange)
      onChange({
        key: name,
        value: draftToHtml(convertToRaw(e.getCurrentContent())),
      });
  };

  useState(() => {
    const contentBlock = htmlToDraft(value || "");
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, []);

  return (
    <div className={`${_.get(error, name) ? "is-invalid" : ""}`}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Editor
        name={name}
        id={id}
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={handleChange}
        readOnly={readOnly}
      />
      {_.get(error, name)?.map(message => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default TextEditor;
