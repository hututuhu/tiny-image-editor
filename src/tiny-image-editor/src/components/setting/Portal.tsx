import React from 'react';
import ReactDOM from 'react-dom';

export interface IPortalProps {
  container?: Element;
  children?: React.ReactNode;
  onRendered?: () => void;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export default class Portal extends React.Component<IPortalProps, {}> {
  public container: null | Element = null;

  constructor(props: IPortalProps) {
    super(props);
    this.container = null;
    this.getContainer = this.getContainer.bind(this);
  }

  public componentDidMount() {
    this.container = this.props.container || document.body;
    this.forceUpdate(() => {
      if (this.props.onRendered) {
        this.props.onRendered();
      }
    });
  }

  public componentDidUpdate(prevProps: IPortalProps) {
    if (prevProps.container !== this.props.container) {
      this.container = this.props.container || null;
    }
  }

  public getContainer() {
    return this.container;
  }

  public render() {
    const { children } = this.props;
    return this.container && children
      ? ReactDOM.createPortal(children, this.container)
      : null;
  }
}
