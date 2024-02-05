import { Provider, Root, Trigger, Portal, Content, Arrow } from '@radix-ui/react-tooltip';
import { ComponentProps } from 'react';
import classes from './component.module.css';

export function TooltipRoot({ children }: ComponentProps<typeof Provider>) {
  return (
    <Provider delayDuration={0} skipDelayDuration={0}>
      <Root>{children}</Root>
    </Provider>
  );
}

// TRIGGER ----------------------------------------------------------------------

export function TooltipTrigger({
  children,
  asChild = true,
  ...delegated
}: ComponentProps<typeof Trigger>) {
  console.log({ delegated });

  return (
    <Trigger {...delegated} asChild={asChild}>
      {children}
    </Trigger>
  );
}

// Tooltip ----------------------------------------------------------------------

export function Tooltip({ children, className, ...delegated }: ComponentProps<typeof Content>) {
  return (
    <Portal>
      <Content {...delegated} className={`${classes.tooltip} ${className}`} sideOffset={5}>
        {children}
        <Arrow className={classes.arrow} />
      </Content>
    </Portal>
  );
}
