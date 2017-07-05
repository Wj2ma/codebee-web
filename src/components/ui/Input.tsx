import './Input.scss';

import * as React from 'react';
import * as classnames from 'classnames';
import { omit, pick } from 'lodash';
import { Field, WrappedFieldProps } from 'redux-form';

interface InputProps extends React.HTMLProps<any> {
  label?: string;
  type?: string;
  float?: boolean;
  errorText?: string;
}

interface InputState {
  focused?: boolean;
  hasValue?: boolean;
}

function InputHOC(WrappedComponent: React.ComponentClass<React.HTMLProps<any>>): React.ComponentClass<InputProps> {
  return class extends React.Component<InputProps, InputState> {
    static defaultProps: InputProps = {
      label: '',
      type: 'text',
      float: true,
      value: '',
      errorText: ''
    };

    state: InputState = {
      focused: false,
      hasValue: false
    };

    componentWillMount() {
      this.updateValue(this.props.value);
    }

    componentWillReceiveProps(newProps: InputProps) {
      this.updateValue(newProps.value);
    }

    updateValue(value: any) {
      const hasValue = !!value;
      if (this.state.hasValue != hasValue)
        this.setState({ hasValue });
    }

    handleFocus = () => {
      this.setState({ focused: true });
      this.props.onFocus && this.props.onFocus.apply(arguments);
    };

    handleBlur = () => {
      this.setState({ focused: false });
      this.props.onBlur && this.props.onBlur.apply(arguments);
    };

    getClassNames() {
      return {
        'Input--focused': this.state.focused,
        'Input--has-value': this.state.hasValue,
        'Input--error': !!this.props.errorText
      };
    }

    render() {
      const { className, label, float, type, errorText } = this.props;
      const other = omit(this.props, 'className', 'label', 'float', 'errorText');

      const cssClass = classnames('Input', className, this.getClassNames());

      return (
        <div className={cssClass}>
          {label ? <label className="Input-label">{label}</label> : null }
          <div className="Input-input">
            <WrappedComponent {...other} type={type} onFocus={this.handleFocus} onBlur={this.handleBlur} />
          </div>
          <span className="Input-error">{errorText}</span>
        </div>
      );
    }
  } as any;
}

class InputBase extends React.Component<React.HTMLProps<any>> {
  render() {
    return <input {...this.props} />;
  }
}

class TextAreaBase extends React.Component<React.HTMLProps<any>> {
  render() {
    return <textarea {...this.props} />;
  }
}

/**
 * Redux Form Fields
 */
export const Input = InputHOC(InputBase);
export const TextArea = InputHOC(TextAreaBase);

const renderInputField = (props: InputProps & WrappedFieldProps<any>) => {
  const inputProps = pick(props, 'float', 'label', 'type');

  const { touched, error } = props.meta;
  const errorText: string = (touched && error) ? error : '';

  return <Input {...props.input} {...inputProps} disabled={props.disabled} errorText={errorText} />;
};

export const InputField = (props: InputProps) => <Field component={renderInputField} {...props} />;

const renderTextAreaField = (props: InputProps & WrappedFieldProps<any>) => {
  const inputProps = pick(props, 'float', 'label');

  const { touched, error } = props.meta;
  const errorText: string = (touched && error) ? error : '';

  return <TextArea {...props.input} {...inputProps} disabled={props.disabled} errorText={errorText} />;
};

export const TextAreaField = (props: InputProps) => <Field component={renderTextAreaField} {...props} />;

export default Input;
