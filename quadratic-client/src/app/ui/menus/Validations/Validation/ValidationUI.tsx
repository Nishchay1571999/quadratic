/* eslint-disable @typescript-eslint/no-unused-vars */
import { Checkbox } from '@/shared/shadcn/ui/checkbox';
import { ValidationData } from './useValidationData';
import { Button } from '@/shared/shadcn/ui/button';
import { Input } from '@/shared/shadcn/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/shadcn/ui/select';
import { FocusEvent, useCallback, useEffect, useRef } from 'react';
import { Textarea } from '@/shared/shadcn/ui/textarea';
import { cn } from '@/shared/shadcn/utils';

interface CheckboxProps {
  label: string;
  value: boolean;
  changeValue: (checked: boolean) => void;
}

export const ValidationUICheckbox = (props: CheckboxProps) => {
  const { label, value: showDropdown, changeValue: changeDropDown } = props;

  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={label} checked={showDropdown} onCheckedChange={changeDropDown} />
      <label htmlFor={label} className="cursor-pointer text-sm font-medium">
        {label}
      </label>
    </div>
  );
};

interface InputProps {
  label?: string;
  value: string;
  error?: string;
  disabled?: boolean;

  // used to update whenever the input loses focus
  onChange?: (value: string) => void;

  // used to update whenever the input is changed (ie, a character is changes within the input box)
  onInput?: (value: string) => void;

  footer?: string | JSX.Element;
  height?: string;
  placeholder?: string;
}

export const ValidationInput = (props: InputProps) => {
  const { label, value, onChange, onInput, footer, height, placeholder, error, disabled } = props;
  const ref = useRef<HTMLInputElement>(null);

  const onBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.currentTarget.value);
      }
    },
    [onChange]
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.value = value;
    }
  }, [value]);

  return (
    <div>
      {label && <div className={disabled ? 'opacity-50' : ''}>{label}</div>}
      <div>
        <div className={cn('flex w-full items-center space-x-2', error ? 'border border-red-500' : '')}>
          <Input
            ref={ref}
            onBlur={onBlur}
            onInput={onInput ? (e) => onInput(e.currentTarget.value) : undefined}
            style={{ height }}
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
        {footer && <div className="text-xs">{footer}</div>}
        {error && <div className="text-xs text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export const ValidationTextArea = (props: InputProps) => {
  const { label, value, onChange, onInput, footer, height, placeholder, disabled } = props;
  const ref = useRef<HTMLTextAreaElement>(null);

  const onBlur = useCallback(
    (e: FocusEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e.currentTarget.value);
      }
    },
    [onChange]
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.value = value;
    }
  }, [value]);

  return (
    <div>
      {label && <div className={disabled ? 'opacity-50' : ''}>{label}</div>}
      <div>
        <Textarea
          ref={ref}
          onBlur={onChange ? onBlur : undefined}
          onInput={onInput ? (e) => onInput(e.currentTarget.value) : undefined}
          style={{ height }}
          placeholder={placeholder}
          disabled={disabled}
        />
        {footer && <div className="text-xs">{footer}</div>}
      </div>
    </div>
  );
};

export const ValidationMoreOptions = (props: { validationData: ValidationData }) => {
  const { moreOptions, toggleMoreOptions } = props.validationData;

  return <Button onClick={toggleMoreOptions}>{moreOptions ? 'Hide' : 'Show'} Messages</Button>;
};

interface DropdownProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string | JSX.Element }[];
  disabled?: boolean;
}

export const ValidationDropdown = (props: DropdownProps) => {
  const { label, value, onChange, options, disabled } = props;

  return (
    <div>
      {label && <div className={disabled ? 'opacity-50' : ''}>{label}</div>}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className="select-none"
          onClick={(e) => {
            // this is needed to avoid selecting text when clicking the dropdown
            e.preventDefault();
          }}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
