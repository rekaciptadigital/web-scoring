import * as React from "react";
import _ from "lodash";
import stringUtil from "utils/stringUtil";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import { useFieldValidation } from "utils/hooks/field-validation";

import { Label } from "reactstrap";
import { Editor } from "react-draft-wysiwyg";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const TextEditor = ({
  name,
  id = stringUtil.createRandom(),
  label,
  value,
  onChange,
  readOnly,
  placeholder,
}) => {
  const [editorStateLocal, setEditorStateLocal] = React.useState();
  const { errors, handleFieldValidation } = useFieldValidation(name);

  const handleChange = (editorState) => {
    setEditorStateLocal(editorState);
    if (onChange) {
      onChange({
        key: name,
        value: editorState.getCurrentContent().hasText()
          ? draftToHtml(convertToRaw(editorState.getCurrentContent()))
          : "",
      });
    }
  };

  const handleBlur = () => {
    handleFieldValidation(value);
  };

  React.useEffect(() => {
    const contentBlock = htmlToDraft(value || "");
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setEditorStateLocal(editorState);
    }
  }, []);

  return (
    <div className={`${_.get(errors, name) ? "is-invalid" : ""}`}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Editor
        name={name}
        id={id}
        editorState={editorStateLocal}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={handleChange}
        readOnly={readOnly}
        placeholder={placeholder}
        onBlur={handleBlur}
      />

      {_.get(errors, name)?.map((message) => (
        <div className="invalid-feedback" key={message}>
          {message}
        </div>
      ))}
    </div>
  );
};

export default TextEditor;
