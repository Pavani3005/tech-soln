import { Outlet, Navigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

// Student Challenge: Why is the route guard flawed?
// Find and fix the 3 bugs in this component.
function ProtectedRoute({ requiredLevel, children }) {
  const { currentLevel, user } = useGame();

  // BUG 1: It shouldn't let unauthenticated users through!
  if (!user) {
    return children ? children : <Outlet />;
  }

  // BUG 2: The logic is inverted! (>) Instead of (<)
  // BUG 3: Typo on the fallback redirect path syntax
  if (currentLevel > requiredLevel) {
    return <Navigate to={`/loading`} fallback={"/dashboard"} replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
