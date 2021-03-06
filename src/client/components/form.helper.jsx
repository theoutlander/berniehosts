import React, { Component } from "react";
import { Segment, Header, Form, Dropdown } from "semantic-ui-react";

class FormHelper {
  static handleChange = (props, data, header, e, { name, value }) => {
    props.onChange({
      ...data,
      [header]: value
    });
  };

  static renderInputs = (props, data, handleChange, FIELDS) => {
    // console.log(data);
    let inputs = FIELDS.map((f, i) => {
      if (Array.isArray(f)) {
        return (
          //   <Segment raised>
          <Form.Group key={i} widths="equal">
            {f.map(item =>
              FormHelper.renderInput(props, data, handleChange, item)
            )}
            {/* {f.map(item => this.renderInput(item))} */}
          </Form.Group>
          //   </Segment>
        );
      }

      return FormHelper.renderInput(props, data, handleChange, f);
    });

    // let list = [];

    // for (let i = 0; i < inputs.length; i++) {
    //   if (i % 2 === 0) {
    //     list.push(
    //       <Form.Group key={i} widths="equal">
    //         {inputs[i]}
    //         {inputs[i + 1]}
    //       </Form.Group>
    //     );
    //   }
    // }

    // return list;
    return inputs;
  };

  static renderTextArea({ header, readonly, handleChange, data }) {
    return (
      <Form.TextArea
        // fluid
        rows={8}
        key={header}
        label={header}
        // placeholder={}
        value={data[header]}
        onChange={!readonly ? handleChange.bind(this, header) : null}
        readOnly={readonly}
      />
    );
  }

  static renderTextInput({ header, readonly, handleChange, data }) {
    return (
      <Form.Input
        fluid
        key={header}
        label={header}
        // placeholder={}
        value={data[header]}
        onChange={!readonly ? handleChange.bind(this, header) : null}
        readOnly={readonly}
      />
    );
  }

  static renderOptions({ header, readonly, handleChange, data, options }) {
    const optionsArr = options.map(i => {
      return {
        key: i,
        value: i,
        text: i
      };
    });
    return (
      <Form.Dropdown
        fluid
        key={header}
        label={header}
        selection
        search
        options={optionsArr}
        onChange={!readonly ? handleChange.bind(this, header) : null}
        readOnly={readonly}
      />
    );
  }

  static renderInput = (
    props,
    data,
    handleChange,
    { header, hidden = false, readonly = false, type = "text", options, show }
  ) => {
    if (typeof data[header] === "undefined") {
      debugger;
    }

    if (show && data[show.header] !== show.value) {
      // console.log(show, data);
      return null;
    }

    if (hidden) {
      // IS this the best way to handle hidden?
      return null;
    }

    if (options) {
      // console.log(type + " changed to " + options);
      type = "options";
    }

    let attributes = { header, readonly, handleChange, hidden, options, data };
    switch (type) {
      case "textarea":
        return FormHelper.renderTextArea(attributes);
      case "options":
        return FormHelper.renderOptions(attributes);
      default:
        return FormHelper.renderTextInput(attributes);
    }
  };
}

export default FormHelper;
