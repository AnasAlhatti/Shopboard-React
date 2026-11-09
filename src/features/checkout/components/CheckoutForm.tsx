import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../shared/ui/Button';
import { Field } from '../../../shared/ui/Field';
import { FieldLabel } from '../../../shared/ui/FieldLabel';
import { FieldError } from '../../../shared/ui/FieldError';
import { Input } from '../../../shared/ui/Input';
import { checkoutSchema, type CheckoutValues } from '../schemas/checkoutSchema';

interface CheckoutFormProps {
  onSubmit: (values: CheckoutValues) => Promise<void>;
  disabled: boolean;
}

const fields: {
  name: keyof CheckoutValues;
  label: string;
  autoComplete: string;
  type: string;
}[] = [
  { name: 'name', label: 'Full name', autoComplete: 'name', type: 'text' },
  {
    name: 'email',
    label: 'Email address',
    autoComplete: 'email',
    type: 'email',
  },
  {
    name: 'address',
    label: 'Street address',
    autoComplete: 'street-address',
    type: 'text',
  },
  { name: 'city', label: 'City', autoComplete: 'address-level2', type: 'text' },
  {
    name: 'postalCode',
    label: 'Postal code',
    autoComplete: 'postal-code',
    type: 'text',
  },
];

export function CheckoutForm({ onSubmit, disabled }: CheckoutFormProps) {
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
    },
  });
  async function submit(values: CheckoutValues) {
    try {
      await onSubmit(values);
    } catch (error) {
      form.setError('root', {
        message:
          error instanceof Error
            ? error.message
            : 'Unable to submit your order. Please try again.',
      });
    }
  }
  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(submit)}
      className="checkout-form"
    >
      <fieldset disabled={disabled || form.formState.isSubmitting}>
        <legend>Contact and delivery</legend>
        <p>
          Demo checkout. No payment is collected; delivery details are not
          saved.
        </p>
        {fields.map((item) => (
          <Controller
            key={item.name}
            name={item.name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`checkout-${item.name}`}>
                  {item.label}
                </FieldLabel>
                <Input
                  {...field}
                  id={`checkout-${item.name}`}
                  type={item.type}
                  autoComplete={item.autoComplete}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.error ? `checkout-${item.name}-error` : undefined
                  }
                />
                {fieldState.error && (
                  <FieldError id={`checkout-${item.name}-error`}>
                    {fieldState.error.message}
                  </FieldError>
                )}
              </Field>
            )}
          />
        ))}
        {form.formState.errors.root && (
          <FieldError>{form.formState.errors.root.message}</FieldError>
        )}
        <Button
          type="submit"
          disabled={disabled || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Placing order…' : 'Place order'}
        </Button>
      </fieldset>
    </form>
  );
}
