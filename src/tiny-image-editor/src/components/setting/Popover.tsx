/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import classNames from 'classnames';
import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';

import { Manager, Popper, Reference } from 'react-popper';
import { IDOMProps } from '../../constants';
import { removeNonHTMLProps } from '../../util';

import Portal from './Portal';

export type Placement =
  | 'auto'
  | 'auto-start'
  | 'auto-end'
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'left'
  | 'left-start'
  | 'left-end';

interface IArrowProps {
  arrowPlacement: string;
  backgroundColor?: string;
  children:React.ReactNode
}
export interface IPopoverProps extends IDOMProps {
  className?: string;
  popoverClassName?: string;
  style?: React.CSSProperties;
  popoverStyle?: React.CSSProperties;
  open?: boolean;
  placement?: Placement;
  positionFixed?: boolean;
  children: React.ReactNode;
  showArrow?: boolean;
  usePortal?: boolean;
  /** 自定义Portal容器节点 */
  portalContainer?: Element;
  content: React.ReactNode;
  modifiers?: Array<Object>;
  outlineColor?: string;
  backgroundColor?: string;
  trigger?: 'click' | 'focus' | 'hover';
  visible?: boolean;
  scheduleUpdate?: boolean;
  getPopoverRef?: (ref: React.RefObject<HTMLDivElement>) => void;
  onOpenChange?: (visible: boolean) => void;
  /** 点击空白区域，自动关闭popover */
  maskClosable?: boolean;
}


const ArrowWrapper =  (props:IArrowProps) => {
    return <div className='popper__arrow' style={{['border'+props.arrowPlacement+"-color"]:props.backgroundColor}}>{props.children}</div>
  }

const Popover = (props: IPopoverProps) => {
  let popoverRef: React.RefObject<HTMLDivElement> = useRef(null);
  let targetRef: React.RefObject<HTMLDivElement> = useRef(null);
  const [open, setOpen] = useState<boolean | undefined>(props.open);
  const {
    className,
    style,
    children,
    trigger,
    visible,
    popoverClassName,
    popoverStyle,
    showArrow,
    content,
    placement,
    usePortal,
    portalContainer,
    positionFixed,
    modifiers,
    outlineColor,
    backgroundColor,
    scheduleUpdate,
    onOpenChange,
    maskClosable = true,
    ...restProps
  } = props;

  const domProps = removeNonHTMLProps(restProps, [
    'popoverClassName',
    'popoverStyle',
    'showArrow',
    'content',
    'usePortal',
    'positionFixed',
    'outlineColor',
    'backgroundColor',
    'getPopoverRef',
    'onOpenChange',
  ]);

  const handleOpenChange = (openState: boolean) => {
    if (onOpenChange) {
      onOpenChange(openState);
    }

    if (props.open !== undefined) {
      setOpen(props.open);
    } else {
      setOpen(openState);
    }
  };

  const handleClick = (e: any) => {
    if (!popoverRef || !targetRef) return;
    if (
      (popoverRef as any).current?.contains(e.target as HTMLDivElement) ||
      (targetRef as any).current?.contains(e.target as HTMLDivElement)
    ) {
      return;
    }
    if (maskClosable) {
      handleOpenChange(false);
    }
  };

  const mouseEnter = () => {
    const { open, onOpenChange } = props;
    if (open !== undefined && onOpenChange === undefined) return;

    if (trigger === 'hover') {
      handleOpenChange(true);
    }
  };

  const mouseLeave = () => {
    const { open, onOpenChange } = props;
    if (open !== undefined && onOpenChange === undefined) return;
    if (trigger === 'hover') {
      handleOpenChange(false);
    }
  };

  const handleVisiblePopover = (e: SyntheticEvent) => {
    e.nativeEvent.stopImmediatePropagation();
    if (trigger === 'click') {
      handleOpenChange(!open);
      return;
    }
    if (trigger === 'focus') {
      handleOpenChange(true);
    }
  };
  useEffect(() => {
    if (props.getPopoverRef) {
      props.getPopoverRef(popoverRef);
    }
  }, []);

  useEffect(() => {
    if (trigger === 'click' || trigger === 'focus') {
      document.body.addEventListener('click', handleClick, false);
    }
    return () => {
      document.body.removeEventListener('click', handleClick, false);
    };
  }, [maskClosable, props.open]);

  useEffect(() => {
    if (props.open !== undefined) {
      handleOpenChange(props.open);
    }
  }, [props.open]);

  /**
   * 渲染 popover 弹层
   */
  const renderPopper = () => {
    const strategy = positionFixed ? 'fixed' : 'absolute';
    const defaultModifiers = [
      {
        name: 'computeStyles',
        options: {
          gpuAcceleration: false, // true by default
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      },
    ];

    // 获取（placement）方向并把首字母设置成大写
    const direction = (placement?: string) => {
      if (placement) {
        return placement
          .split('-')[0]
          .toString()
          .replace(/^\S/, (s) => s.toUpperCase());
      }
    };

    // 设置popover的边框和（arrow）三角形的边框颜色
    const getOutlineColor = (type: string) => {
      if (type === 'content' && outlineColor) {
        return {
          borderColor: outlineColor,
        };
      }
      if (type === 'arrow' && outlineColor) {
        return {
          [`border${direction(placement)}Color`]: outlineColor,
        };
      }
    };

    // 设置popover的背景
    const getBackgroundColor = () => {
      if (backgroundColor) {
        return {
          color: '#fff',
          background: backgroundColor,
          // border: 'none',
        };
      }
    };

    // 动态设置三角的背景色
    const arrowPlacement = placement!.split('-')[0];

    const popperContent = open && (
      <Popper
        placement={placement}
        modifiers={[...defaultModifiers, ...(modifiers ? modifiers : [])]}
        strategy={strategy}
      >
        {({ ref, style, placement, arrowProps, update }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            if (open) {
              update();
            }
          }, [scheduleUpdate]);
          return (
            <div
              className={classNames('tie-popover__popper', popoverClassName, {
                'tie-popover__popper-background': backgroundColor,
              })}
              style={{
                ...style,
                ...popoverStyle,
                ...getOutlineColor('content'),
                ...getBackgroundColor(),
              }}
              ref={ref}
              // eslint-disable-next-line react/no-unknown-property
              x-placement={placement}
              onMouseEnter={mouseEnter}
              onMouseLeave={mouseLeave}
            >
              <div ref={popoverRef}>
                {open && (
                  <div className="tie-popover__content">
                    <span>{content}</span>
                  </div>
                )}
                {showArrow && (
                  <ArrowWrapper
                    arrowPlacement={arrowPlacement}
                    backgroundColor={backgroundColor}
                  >
                    <div
                      data-popper-arrow
                      className="tie-popper__arrow popper__arrow"
                      // eslint-disable-next-line react/no-unknown-property
                      x-arrow="true"
                      style={{
                        ...arrowProps.style,
                        ...getOutlineColor('arrow'),
                      }}
                      ref={arrowProps.ref}
                    />
                  </ArrowWrapper>
                )}
              </div>
            </div>
          );
        }}
      </Popper>
    );

    return usePortal ? (
      <Portal container={portalContainer}>{popperContent}</Portal>
    ) : (
      popperContent
    );
  };

  // 解决children为Button元素且禁用的时候鼠标事件失效的问题
  const getDisabledCompatibleChildren = (element: any) => {
    if (element.type.__BRICKS_BUTTON && element.props.disabled) {
      const displayStyle =
        element.props.style && element.props.style.display
          ? element.props.style.display
          : 'inline-block';
      const child = React.cloneElement(element, {
        style: {
          ...element.props.style,
          pointerEvents: 'none',
        },
      });
      return (
        <span style={{ display: displayStyle, cursor: 'not-allowed' }}>
          {child}
        </span>
      );
    }
    return element;
  };

  return (
    <>
      {visible ? (
        <div
          className={classNames('tie-popover', className)}
          {...(domProps as IDOMProps)}
          style={style}
        >
          <Manager>
            <Reference>
              {({ ref }) => (
                <div ref={targetRef} className="tie-popover__target">
                  <div ref={ref}>
                    {React.Children.map(children, (child) => {
                      let ele = child as React.ReactElement;
                      ele = getDisabledCompatibleChildren(ele);

                      if (trigger === 'click') {
                        return React.cloneElement(ele, {
                          onClick: (e: SyntheticEvent) => {
                            handleVisiblePopover(e);
                            ele.props.onClick && ele.props.onClick();
                          },
                        });
                      }

                      if (trigger === 'focus') {
                        return React.cloneElement(ele, {
                          onFocus: (e: SyntheticEvent) => {
                            handleVisiblePopover(e);
                            ele.props.onFocus && ele.props.onFocus();
                          },
                        });
                      }

                      if (trigger === 'hover') {
                        return React.cloneElement(ele, {
                          onMouseEnter: () => {
                            mouseEnter();
                            ele.props.onMouseEnter && ele.props.onMouseEnter();
                          },
                          onMouseLeave: () => {
                            mouseLeave();
                            ele.props.onMouseLeave && ele.props.onMouseLeave();
                          },
                        });
                      }
                      return ele;
                    })}
                  </div>
                </div>
              )}
            </Reference>
            {renderPopper()}
          </Manager>
        </div>
      ) : (
        children
      )}
    </>
  );
};

Popover.defaultProps = {
  visible: true,
  trigger: 'hover',
  placement: 'bottom',
  showArrow: true,
  usePortal: true,
  modifiers: [],
};

export default Popover;
