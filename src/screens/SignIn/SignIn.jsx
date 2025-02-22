import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Typography, Container, Paper } from '@mui/material';

import InputField from '../../components/Input/Input';
import Button from '../../components/Button/Button';

import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { toast, ToastContainer } from 'react-toastify';

const schema = yup.object().shape({
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup.string().required("Senha é obrigatória"),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { login, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    } 
  }, [navigate, token]);

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Login feito com sucesso');

      setTimeout(() => navigate('/dashboard'), 1000);

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('' + error, {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{
        backgroundColor: "#00b4d8", 
        height: "100vh", 
        width: "100vw", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        padding: 2,
        margin: 0,
      }}
    >
      <ToastContainer />
      <Paper elevation={2} sx={{ p: 4, mt: 8, borderRadius: 2, backgroundColor: "#caf0f8", width: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="E-mail"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <InputField
            label="Senha"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button type="submit" fullWidth>
            Entrar
          </Button>
          <Typography variant="body2" align="center" mt={2}>
            Ainda não possui uma conta?{' '}
            <Typography 
              variant='subtitle2'
              component='span'
              sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 'bold' }}
              onClick={() => navigate('/register')}
            >
              Clique aqui
            </Typography>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;