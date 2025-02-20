import { ButtonProps } from '@mui/material/Button';
import MuiButton from '@mui/material/Button';

const Button = ({ children, ...rest }: ButtonProps) => (
  <MuiButton variant="contained" color="primary" {...rest}>
    {children}
  </MuiButton>
);

export default Button;
