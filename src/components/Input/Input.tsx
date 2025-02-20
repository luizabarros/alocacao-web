import { TextField, Box } from '@mui/material';

interface InputFieldProps {
  label: string;
  type: string;
  error?: boolean;
  helperText?: string;
}

const InputField = ({ label, type, error, helperText, ...rest }: InputFieldProps) => (
  <Box mb={2}>
    <TextField
      fullWidth
      variant="outlined"
      label={label}
      type={type}
      error={error}
      helperText={helperText}
      {...rest}
    />
  </Box>
);

export default InputField;