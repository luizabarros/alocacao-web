import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Typography, Container, Paper } from '@mui/material';
import InputField from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

interface IRegister {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .matches(/[0-9]/, "A senha deve conter pelo menos um número")
    .required("Senha é obrigatória"),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], "As senhas não coincidem")
    .required("Confirmação de senha é obrigatória"),
});

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: IRegister) => {
    try {
      await registerUser(data.email, data.password, data.name);
      toast.success('Cadastro feito com sucesso');
      
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      console.error('Erro ao realizar o cadastro:', error);
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
          Cadastro
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="Name"
            type="text"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
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
          <InputField
            label="Confirmar Senha"
            type="password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
          <Button type="submit" fullWidth>
            Cadastrar
          </Button>
          <Typography variant="body2" align="center" mt={2}>
            Voltar para o login?
            <Typography 
              ml={0.5}
              variant='subtitle2'
              component='span'
              sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 'bold' }}
              onClick={() => navigate('/')}
            >
              Entrar
            </Typography>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
