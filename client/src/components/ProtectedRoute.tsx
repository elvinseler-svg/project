import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

interface Props {
  adminOnly?: boolean;
}

export default function ProtectedRoute({ adminOnly = false }: Props) {
  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);

  if (!token || !user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin')
    return <Navigate to="/ingredients" replace />;

  return <Outlet />;
}
