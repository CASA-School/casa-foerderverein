"use client";

import { useState } from "react";
import * as Select from "@radix-ui/react-select";

type Option<T extends string> = { value: T; label: string; detail?: string };

export function ContactSelect<T extends string>({ id, name, label, value, options, onChange, hint, error, disabled = false }: {
  id: string;
  name: string;
  label: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  hint?: string;
  error?: string;
  disabled?: boolean;
}) {
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const description = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;

  return <div className="contact-field" data-field={name}>
    <label htmlFor={id}>{label}</label>
    <Select.Root name={name} value={value} onValueChange={next => onChange(next as T)} open={open} onOpenChange={setOpen} disabled={disabled}>
      <Select.Trigger ref={setTrigger} id={id} className="contact-select-trigger" aria-describedby={description} aria-invalid={!!error}>
        <Select.Value />
        <Select.Icon className="contact-select-chevron"><Chevron /></Select.Icon>
      </Select.Trigger>
      {/* Stay inside the native dialog's top layer, above its scrolling panel. */}
      <Select.Portal container={trigger?.closest("dialog")}>
        <Select.Content className="contact-select-content" position="popper" sideOffset={6} collisionPadding={20} onEscapeKeyDown={event => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
        }}>
          <Select.ScrollUpButton className="contact-select-scroll"><Chevron up /></Select.ScrollUpButton>
          <Select.Viewport className="contact-select-options">
            {options.map(option => <Select.Item key={option.value} value={option.value} textValue={option.label} className="contact-select-option" aria-describedby={option.detail ? `${id}-${option.value}-detail` : undefined}>
              <span className="contact-select-option-copy">
                <Select.ItemText>{option.label}</Select.ItemText>
                {option.detail && <span id={`${id}-${option.value}-detail`} className="contact-select-detail">{option.detail}</span>}
              </span>
              <Select.ItemIndicator className="contact-select-check"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 10 4 4 8-8" /></svg></Select.ItemIndicator>
            </Select.Item>)}
          </Select.Viewport>
          <Select.ScrollDownButton className="contact-select-scroll"><Chevron /></Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
    {hint && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}
    {error && <p className="field-error" id={`${id}-error`} role="alert">{error}</p>}
  </div>;
}

function Chevron({ up = false }: { up?: boolean }) {
  return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d={up ? "m5 12 5-5 5 5" : "m5 8 5 5 5-5"} /></svg>;
}
