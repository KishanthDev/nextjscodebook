import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Page from './page';
import '@testing-library/jest-dom';

// Mock localStorage
const mockSettings = {
  bgColor: '#ff0000',
  iconColor: '#ffffff',
  dotsColor: '#0000ff',
};

beforeEach(() => {
  localStorage.clear();
});

test('renders the bubble with default settings when no localStorage', () => {
  render(<Page />);
  const svgIcon = screen.getByTestId('bubble-icon');
  expect(svgIcon).toBeInTheDocument();
});

test('loads settings from localStorage', () => {
  localStorage.setItem('bubbleSettings', JSON.stringify(mockSettings));
  render(<Page />);
  const bubble = screen.getByTestId('bubble-container');
  expect(bubble).toHaveStyle(`background-color: ${mockSettings.bgColor}`);
});

test('shows dots on hover and hides icon', () => {
  render(<Page />);
  const bubble = screen.getByTestId('bubble-container');
  fireEvent.mouseEnter(bubble);
  const dots = screen.getAllByTestId('bubble-dot');
  expect(dots.length).toBe(3);
  fireEvent.mouseLeave(bubble);
  expect(screen.getByTestId('bubble-icon')).toBeInTheDocument();
});
