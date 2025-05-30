declare module 'react-input-mask' {
  import { InputHTMLAttributes } from 'react';

  export interface InputMaskProps extends InputHTMLAttributes<HTMLInputElement> {
    mask: string;
    maskChar?: string | null;
    formatChars?: { [key: string]: string };
    alwaysShowMask?: boolean;
    inputRef?: (el: HTMLInputElement | null) => void;
  }

  const InputMask: React.FC<InputMaskProps>;
  export default InputMask;
}