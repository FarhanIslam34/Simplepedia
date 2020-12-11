import { render, screen, fireEvent } from '@testing-library/react';
import ButtonBar from './ButtonBar';

describe('ButtonBar tests', () => {
  const handler = jest.fn();

  beforeEach(() => {
    handler.mockReset();
  });

  test('only shows the Add button if editing is not set', () => {
    render(<ButtonBar handleClick={handler} />);

    expect(screen.queryByRole('button', { name: 'Add' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Edit' })
    ).not.toBeInTheDocument();
  });

  test('only shows the Add button if editing is not allowed', () => {
    render(<ButtonBar allowEdit={false} handleClick={handler} />);

    expect(screen.queryByRole('button', { name: 'Add' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Edit' })
    ).not.toBeInTheDocument();
  });

  test('shows all  buttons if editing is allowed', () => {
    render(<ButtonBar allowEdit={true} handleClick={handler} />);

    expect(screen.queryByRole('button', { name: 'Add' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  test('add button returns correct action', () => {
    render(<ButtonBar allowEdit={true} handleClick={handler} />);

    fireEvent.click(screen.queryByRole('button', { name: 'Add' }));

    expect(handler).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith('add');
  });

  test('edit button returns correct action', () => {
    render(<ButtonBar allowEdit={true} handleClick={handler} />);
    fireEvent.click(screen.queryByRole('button', { name: 'Edit' }));

    expect(handler).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith('edit');
  });
});

describe('ButtonBar delete button tests [exceeds]', () => {
  const handler = jest.fn();

  beforeEach(() => {
    handler.mockReset();
  });

  test('does not show delete if editing is not set', () => {
    render(<ButtonBar handleClick={handler} />);

    expect(screen.queryByRole('button', { name: 'Add' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Edit' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Delete' })
    ).not.toBeInTheDocument();
  });

  test('does not show delete if editing is not allowed', () => {
    render(<ButtonBar allowEdit={false} handleClick={handler} />);

    expect(
      screen.queryByRole('button', { name: 'Delete' })
    ).not.toBeInTheDocument();
  });

  test('shows delete if editing is allowed', () => {
    render(<ButtonBar allowEdit={true} handleClick={handler} />);

    expect(
      screen.queryByRole('button', { name: 'Delete' })
    ).toBeInTheDocument();
  });

  test('delete button returns correct action', () => {
    render(<ButtonBar allowEdit={true} handleClick={handler} />);

    fireEvent.click(screen.queryByRole('button', { name: 'Delete' }));

    expect(handler).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith('delete');
  });
});
