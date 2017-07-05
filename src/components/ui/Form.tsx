import './Form.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { reduxForm, FormProps, SubmissionError } from 'redux-form';
import * as classnames from 'classnames';

import LinearProgress from './LinearProgress';
import FormMessage from './FormMessage';
import FormButtons from './FormButtons';

export type Props<P = {}> = P & FormProps<any, any, any> & React.HTMLAttributes<any>;

export default class Form<P> extends React.Component<Props<P>> {
  static defaultProps = {
    submitting: false
  };

  disabled() {
    const { invalid, submitting } = this.props;
    return invalid || submitting;
  }

  render() {
    const { className, handleSubmit, pristine, invalid, submitting, error, children } = this.props;
    const disabled = this.disabled();

    const cssClass = classnames('Form', className);

    const inputs: React.ReactChild[] = [];
    let buttons: React.ReactChild | null = null;
    React.Children.forEach(children, (child: any, i) => {
      if (child.type == FormButtons) {
        buttons = React.cloneElement(child, { disabled });
      } else {
        inputs.push(React.cloneElement(child, { key: i, disabled: submitting }));
      }
    });

    return (
      <form className={cssClass} onSubmit={handleSubmit} autoComplete="off">
        {inputs}
        {buttons}
        <FormMessage type="Error">{(!submitting && error) ? error : undefined}</FormMessage>
        <LinearProgress className="Form-progress" enabled={submitting} />
      </form>
    );
  }
}
