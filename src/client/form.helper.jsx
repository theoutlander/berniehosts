import React, { Component } from "react";
import { Segment, Header, Form, Divider } from "semantic-ui-react";

class FormHelper {
  static handleChange = (props, data, header, e, { name, value }) => {
    props.onChange({
      ...data,
      [header]: value
    });
  };

  static renderInputs = (props, data, handleChange, FIELDS) => {
    console.log(data);
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

  static renderInput = (
    props,
    data,
    handleChange,
    { header, readonly = false, type = "text" }
  ) => {
    if (typeof data[header] === "undefined") {
      debugger;
    }
    switch (type) {
      case "textarea":
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
      default:
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
  };
}

export default FormHelper;
