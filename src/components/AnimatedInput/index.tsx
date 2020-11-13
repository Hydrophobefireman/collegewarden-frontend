import {
  RefType,
  VNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
  ComponentChild,
  useRef,
} from "@hydrophobefireman/ui-lib";
import {
  errorCss,
  iconCSS,
  paperInput,
  wrapperCSS,
} from "./AnimatedInput.styles";

interface InputProps
  extends Omit<JSX.HTMLAttributes<HTMLInputElement>, "onInput" | "icon"> {
  id?: string;
  onInput(value: string): void;
  value?: string;
  wrapperClass?: string;
  labelText?: string;
  inputClass?: string | string[];
  inputProps?: JSX.HTMLAttributes;
  errorText?: string;
  $ref?: RefType<HTMLInputElement>;
  icon?: ComponentChild;
}

export function AnimatedInput(props: InputProps): VNode {
  const randomId = useMemo(() => Math.random().toString(36).substr(2), []);

  const {
    id = randomId,
    onInput: propOnInput,
    wrapperClass,
    labelText,
    inputClass,
    errorText,
    $ref,
    icon,
    ...rest
  } = props;

  const [value, setValue] = useState(props.value || "");
  const ref = useRef<HTMLInputElement>();
  const selectionRange = useRef<[number, number]>([0, 0]);
  $ref && ($ref.current = ref.current);
  useEffect(() => {
    setValue(props.value);
  }, [props.value]);
  useEffect(() => {
    const { current } = ref;
    if (!current) return;
    const [s, e] = selectionRange.current;
    current.setSelectionRange(s, e);
  }, [selectionRange.current]);
  function handleInput(e: JSX.TargetedKeyboardEvent<HTMLInputElement>): void {
    const val = (e.target as HTMLInputElement).value;
    setValue(val);
    const { current } = ref;
    current &&
      (selectionRange.current = [current.selectionStart, current.selectionEnd]);
    propOnInput && propOnInput(val);
  }
  //   active || errorText ? moveUp : moveDown
  const onInput = useCallback(handleInput, [propOnInput]);

  return (
    <div class={[wrapperCSS].concat(wrapperClass)}>
      {icon && <span class={iconCSS}>{icon}</span>}
      <input
        onInput={onInput}
        id={id}
        value={value}
        data-error={!!errorText}
        class={[paperInput].concat(inputClass)}
        ref={ref}
        data-should-focus={!!value}
        {...rest}
      />
      <label class={[errorText ? errorCss : null]} for={id}>
        {errorText || labelText}
      </label>
    </div>
  );
}
