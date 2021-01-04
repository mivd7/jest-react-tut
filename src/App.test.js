// import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { api } from './api';

//mock api so we don't need to call the real api
jest.mock('./api');

it('renders the correct content', () => {
  const { getByText, getByLabelText } = render(<App/>);

  getByText("TODOS");
  getByLabelText("What needs to be done?");
  getByText("Add #1");
});

it("allows items to be added to the server", async () => {
  const todoText = 'Learn async testing';
  api.createItem.mockResolvedValueOnce({ id: 123, text: todoText });

  const { getByText, getByLabelText } = render(<App/>);
  const input = getByLabelText("What needs to be done?");
  const button = getByText("Add #1");
  //simulate typing input text
  userEvent.type(input, todoText);
  //simulate pressing button
  userEvent.click(button);
  //assert whether simulated input is present
  waitFor(() => getByText(todoText));
  //assert that api has been called once
  expect(api.createItem).toHaveBeenCalledTimes(1);
  //assert that api has been called with correct arguments;
  expect(api.createItem).toHaveBeenCalledWith(
    "/items",
    //only assert text property from newItem object (exclude id)
    expect.objectContaining({ text: todoText })
  )
});