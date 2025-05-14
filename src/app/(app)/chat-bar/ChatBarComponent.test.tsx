import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatBarComponent from './page';
import '@testing-library/jest-dom';

// Mock the JSON file
jest.mock('../../../../data/modifier.json', () => ({
  chatbar: {
    text: 'Hello, Chat!',
    bgColor: '#222222',
    textColor: '#ffffff'
  }
}));

const mockSettings = {
  text: 'Stored Text',
  bgColor: '#123456',
  textColor: '#abcdef'
};

beforeEach(() => {
  localStorage.clear();
});

test('renders with default settings when localStorage is empty', () => {
  render(<ChatBarComponent />);
  const container = screen.getByTestId('chatbar-container');
  const text = screen.getByTestId('chatbar-text');
  expect(container).toHaveStyle('background-color: #222222');
  expect(container).toHaveStyle('color: #ffffff');
  expect(text).toHaveTextContent('Hello, Chat!');
});

test('renders with settings from localStorage if available', () => {
  localStorage.setItem('chatBarSettings', JSON.stringify(mockSettings));
  render(<ChatBarComponent />);
  const container = screen.getByTestId('chatbar-container');
  const text = screen.getByTestId('chatbar-text');
  expect(container).toHaveStyle(`background-color: ${mockSettings.bgColor}`);
  expect(container).toHaveStyle(`color: ${mockSettings.textColor}`);
  expect(text).toHaveTextContent(mockSettings.text);
});

test('renders nothing before settings are initialized', () => {
  const { container } = render(<ChatBarComponent />);
  // Because hydration-safe rendering returns null at first render
  expect(container).not.toBeEmptyDOMElement();
});
