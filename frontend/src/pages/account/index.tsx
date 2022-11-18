import { useRouter } from 'next/router';
import React from 'react';
import { useLoginContext } from '../../lib/loginContext';

export default function Account() {
  const { user } = useLoginContext();
  const router = useRouter();

  React.useEffect(() => {
    if (user === null) {
      router.push('/sign-in');
    } else {
      router.replace('/account/profile');
    }
  }, [user, router]);

  return null;
}
