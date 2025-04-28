// jest.setup.js
import '@testing-library/jest-dom'; // Add jest-dom matchers for better assertions
// jest.setup.js or similar setup file
global.HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    setLineDash: jest.fn(),
    scale: jest.fn(),
  });