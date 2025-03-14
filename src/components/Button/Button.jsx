import MuiButton from '@mui/material/Button';

const Button = ({ children, ...rest }) => (
  <MuiButton variant="contained" color="primary" {...rest}>
    {children}
  </MuiButton>
);

export default Button;
