import { Provider, Root, Trigger, Portal, Content, Arrow } from '@radix-ui/react-tooltip';
import { ComponentProps, ReactNode } from 'react';
import classes from './component.module.css';

export function TooltipRoot({ children }: ComponentProps<'div'>) {
  return (
    <Provider delayDuration={0} skipDelayDuration={0}>
      <Root>{children}</Root>
    </Provider>
  );
}

// TRIGGER ----------------------------------------------------------------------

interface TriggerProps {
  children: ReactNode;
  asChild?: boolean | undefined;
}

export function TooltipTrigger({ children, asChild = true, ...delegated }: TriggerProps) {
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
