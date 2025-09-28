import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('disables when loading and shows spinner', () => {
    render(<Button loading>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toBeDisabled();
    // Spinner is a styled span; ensure it exists
    const spinner = btn.querySelector('span');
    expect(spinner).toBeTruthy();
  });

  it('applies linkDanger variant classes', () => {
    render(<Button variant="linkDanger">Delete</Button>);
    const btn = screen.getByRole('button', { name: 'Delete' });
    expect(btn.className).toContain('text-rose-600');
  });
});
