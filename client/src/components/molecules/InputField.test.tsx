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
});

