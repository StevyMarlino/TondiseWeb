import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout, setLoading } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data.data.user, data.data.token);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      navigate('/');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      login(data.data.user, data.data.token);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      navigate('/');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
      navigate('/');
    },
  });

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};

export const useUser = () => {
  const { token, setUser } = useAuthStore();

  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const user = await authService.me();
      setUser(user);
      return user;
    },
    enabled: !!token,
  });
};
