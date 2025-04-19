import { useDispatch, useSelector } from 'react-redux';
import { loginUserThunk } from '../services/api/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.auth);

  const login = (userData) => {
    dispatch(loginUserThunk(userData));
  };

  return { user, loading, error, login };
};

export default useAuth;
