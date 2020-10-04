import { fireEvent, screen, waitForDomChange } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import React from 'react';
import Routers from 'react-router-dom';
import App from '../App';
import mocks from './mocks';
import renderWithRouter from './renderWithRouter';

jest.mock(Routers, 'BrowserRouter').mockImplementation();

describe('/register', () => {
  test('should ', () => {

  });
});
