import React from 'react';

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUp from '../../pages/sign-up';

test('Displays the sign up page according to snapshot', async () => {
  const { container } = render(<SignUp />);

  expect(container).toMatchSnapshot();
});
