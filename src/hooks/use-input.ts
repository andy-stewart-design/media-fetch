import { useCallback, useMemo, useState, type ChangeEvent } from "react";

type InputChangeEvent = ChangeEvent<HTMLInputElement>;

// ------------------------------------------------------
// Input: Number ----------------------------------------
// ------------------------------------------------------

export type NumberChangeAction = (event: InputChangeEvent | number) => void;

export interface DelegatedNumberProps {
  min: number;
  max: number;
  step: number;
}

export type UseNumberReturn = [
  number,
  NumberChangeAction,
  DelegatedNumberProps
];

type NumberSetupHook = (
  initialValue: number,
  min: number,
  max: number,
  step: number
) => UseNumberReturn;

export const useNumberInput: NumberSetupHook = (
  initialValue = 5,
  min = 0,
  max = initialValue * 2,
  step = 0.1
) => {
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback<NumberChangeAction>(function (event) {
    if (typeof event === "number") {
      setValue(event);
    } else {
      const { target } = event;

      if (!target) return;

      const newValueNumber = Number((target as HTMLInputElement).value);
      setValue(newValueNumber);
    }
  }, []);

  const delegatedProps = useMemo(() => {
    return { min, max, step };
  }, [min, max, step]);

  return [value, onChange, delegatedProps];
};

// ------------------------------------------------------
// Input: RadioGroup ------------------------------------
// ------------------------------------------------------

export type RadioGroupAction = (event: InputChangeEvent | string) => void;

export type UseRadioReturn = [string, RadioGroupAction];

type RadioSetupHook = (initialValue: string) => UseRadioReturn;

export const useRadio: RadioSetupHook = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback<RadioGroupAction>(function (event) {
    if (typeof event === "string") {
      setValue(event);
    } else {
      setValue(event.target.value);
    }
  }, []);

  return [value, onChange];
};
