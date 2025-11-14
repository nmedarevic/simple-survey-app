import type { InputHTMLAttributes } from 'react';
import Label from '../atoms/Label';
import Input from '../atoms/Input';


interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const InputField = ({ label, id, ...props }: InputFieldProps) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
};

export default InputField;

