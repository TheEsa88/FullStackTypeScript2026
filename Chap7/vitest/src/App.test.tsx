import { test, expect } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import App from "./App";

test('renders learn react link', () => {
const { getByText } = render(<App />);
const linkElement = getByText(/get started/i);
expect(linkElement).toBeInTheDocument();
});