/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import { render, screen } from '@testing-library/react';
import sum from './components/sum';
import '@testing-library/jest-dom';
import Canvas from './components/Canvas';

it('adds 1 + 2 to equal 3', () => {
  const result = sum(1, 2);

  expect(result).toBe(3);
});

it('adds 1 + 2 as string to equal 3', () => {
  const result = sum('1', '2');

  expect(result).toBe(3);
});

describe('canvas', () => {
  it('draw img ', () => {
    render(<Canvas />);
    const test = screen.queryByTestId('testId');
    expect(test).toHaveTextContent('Circule');
  });
});
