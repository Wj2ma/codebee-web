import './Icon.scss';

import * as React from 'react';
import * as classnames from 'classnames';
import { omit } from 'lodash';

interface IconProps extends React.HTMLAttributes<any> {
  iconSize?: 'Small' | 'Medium' | 'Large' | 'Huge';
}

interface MaterialIconProps extends IconProps {
  icon: string;
}

export default class Icon extends React.Component<IconProps, {}> {
  static defaultProps: IconProps = {
    iconSize: 'Small'
  };

  render() {
    const { className, children, iconSize } = this.props;
    const other = omit(this.props, 'className', 'iconSize');
    const cssClass = classnames('Icon', className, `Icon--${iconSize}`);
    return <div className={cssClass} {...other}>{children}</div>;
  }
}

export const MaterialIcon = (props: MaterialIconProps) => {
  const { icon } = props;
  const other = omit(props, 'icon');
  return (
    <Icon {...other}>
      <i className="material-icons">{icon}</i>
    </Icon>
  );
}
