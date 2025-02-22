import { TextField, Box } from '@mui/material';

const InputField = ({ label, type, error, helperText, ...rest }) => (
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