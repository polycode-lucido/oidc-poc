import React from 'react';
import { useRouter } from 'next/router';
import Playground from '../../components/playground/Playground';

export default function ContentPlayground() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return null;

  return <Playground id={`${id}`} />;
}
