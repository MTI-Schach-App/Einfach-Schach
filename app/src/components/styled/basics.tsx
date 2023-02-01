import styled from "@emotion/styled";
import { TextField } from "@mui/material";

export const ValidationTextField = styled(TextField)({
    '& input:valid + fieldset': {
      borderColor: 'green',
      borderWidth: 2,
      borderRadius: 20,
    },
    '& input:invalid + fieldset': {
      borderColor: 'red',
      borderWidth: 2,
      borderRadius: 20,
    },
    '& input:valid:focus + fieldset': {
      borderLeftWidth: 6,
      borderRadius: 20,
      padding: '4px !important', // override inline-style
    },
  });