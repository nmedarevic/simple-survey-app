import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputField from './InputField';

describe('InputField', () => {
  it('renders the label and input correctly', () => {
    render(<InputField label="Email" id="email" />);
    
    const label = screen.getByText('Email');
    const input = screen.getByLabelText('Email');
    
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('associates label with input using htmlFor and id', () => {
    render(<InputField label="Username" id="username" />);
    
    const label = screen.getByText('Username');
    const input = screen.getByLabelText('Username');
    
    expect(label).toHaveAttribute('for', 'username');
    expect(input).toHaveAttribute('id', 'username');
  });

  it('passes additional input props correctly', () => {
    render(
      <InputField
        label="Password"
        id="password"
        type="password"
        placeholder="Enter password"
        required
      />
    );
    
    const input = screen.getByLabelText('Password');
    
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('placeholder', 'Enter password');
    expect(input).toBeRequired();
  });

  it('handles value prop', () => {
    render(<InputField label="Name" id="name" value="John Doe" readOnly />);
    
    const input = screen.getByLabelText('Name') as HTMLInputElement;
    
    expect(input.value).toBe('John Doe');
  });

  it('handles onChange event', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    
    render(
      <InputField
        label="Email"
        id="email"
        onChange={handleChange}
      />
    );
    
    const input = screen.getByLabelText('Email');
    await user.type(input, 'test@example.com');
    
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalledTimes(17); // One call per character
  });

  it('handles disabled state', () => {
    render(<InputField label="Disabled Input" id="disabled" disabled />);
    
    const input = screen.getByLabelText('Disabled Input');
    
    expect(input).toBeDisabled();
  });

  it('accepts custom className prop', () => {
    render(
      <InputField
        label="Custom"
        id="custom"
        className="custom-class"
      />
    );
    
    const input = screen.getByLabelText('Custom');
    
    expect(input).toHaveClass('custom-class');
  });

  it('handles different input types', () => {
    const { rerender } = render(
      <InputField label="Text Input" id="text" type="text" />
    );
    
    let input = screen.getByLabelText('Text Input');
    expect(input).toHaveAttribute('type', 'text');
    
    rerender(<InputField label="Email Input" id="email" type="email" />);
    input = screen.getByLabelText('Email Input');
    expect(input).toHaveAttribute('type', 'email');
    
    rerender(<InputField label="Number Input" id="number" type="number" />);
    input = screen.getByLabelText('Number Input');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('handles onBlur event', async () => {
    const user = userEvent.setup();
    const handleBlur = jest.fn();
    
    render(
      <InputField
        label="Blur Test"
        id="blur"
        onBlur={handleBlur}
      />
    );
    
    const input = screen.getByLabelText('Blur Test');
    await user.click(input);
    await user.tab(); // Blur the input
    
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('handles onFocus event', async () => {
    const user = userEvent.setup();
    const handleFocus = jest.fn();
    
    render(
      <InputField
        label="Focus Test"
        id="focus"
        onFocus={handleFocus}
      />
    );
    
    const input = screen.getByLabelText('Focus Test');
    await user.click(input);
    
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('handles maxLength attribute', async () => {
    const user = userEvent.setup();
    
    render(
      <InputField
        label="Max Length"
        id="maxlength"
        maxLength={5}
      />
    );
    
    const input = screen.getByLabelText('Max Length') as HTMLInputElement;
    await user.type(input, '1234567890');
    
    expect(input.value).toBe('12345');
  });

  it('handles name attribute', () => {
    render(
      <InputField
        label="Name Attribute"
        id="name-attr"
        name="fieldName"
      />
    );
    
    const input = screen.getByLabelText('Name Attribute');
    
    expect(input).toHaveAttribute('name', 'fieldName');
  });

  it('handles autocomplete attribute', () => {
    render(
      <InputField
        label="Autocomplete"
        id="autocomplete"
        autoComplete="email"
      />
    );
    
    const input = screen.getByLabelText('Autocomplete');
    
    expect(input).toHaveAttribute('autocomplete', 'email');
  });

  it('renders with empty string value', () => {
    render(<InputField label="Empty" id="empty" value="" onChange={() => {}} />);
    
    const input = screen.getByLabelText('Empty') as HTMLInputElement;
    
    expect(input.value).toBe('');
  });
});

