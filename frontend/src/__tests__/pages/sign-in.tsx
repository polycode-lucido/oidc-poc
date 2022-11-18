import React from 'react';

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignIn from '../../pages/sign-in';

test('Displays the sign in page according to snapshot', async () => {
  const { container } = render(<SignIn />);

  expect(container).toMatchSnapshot();
});
