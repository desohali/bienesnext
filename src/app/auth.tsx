import { useRouter } from 'next/navigation';
import React from 'react'
import { useSelector } from 'react-redux';

const Auth = ({ children }: any) => {

  const router = useRouter();

  const usuario = useSelector((state: any) => state.user.user);

  React.useEffect(() => {
    if (!usuario) {
      router.push('/login');
    }
  }, [usuario]);

  return children;
}

export default Auth;