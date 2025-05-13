import { render, screen, fireEvent } from '@testing-library/react';
import BubbleComponent from './bubble';
import '@testing-library/jest-dom';

describe('BubbleComponent', () => {
  const defaultSettings = {
    bgColor: '#ffffff',
    iconColor: '#000000',
    dotsColor: '#ff0000',
  };


  it('updates color values when inputs are changed', () => {
    render(<BubbleComponent defaultSettings={defaultSettings} />);

    const bgInput = screen.getAllByPlaceholderText('#hex')[0] as HTMLInputElement;

    fireEvent.change(bgInput, { target: { value: '#123456' } });
    expect(bgInput.value).toBe('#123456');
  });

  it('saves settings to localStorage when Save button is clicked', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    render(<BubbleComponent defaultSettings={defaultSettings} />);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(setItemSpy).toHaveBeenCalledWith(
      'bubbleSettings',
      expect.any(String)
    );
  });
});
