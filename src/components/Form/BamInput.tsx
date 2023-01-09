import { useTheme } from "@emotion/react";
import { styled } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Control, FieldValues, useController } from "react-hook-form";

export interface IBamInputProps {
  control: Control<FieldValues, any>;
  name: string;
  rules?: any;
  error?: any;
  label?: string;
  type?: string;
  placeholder?: string;
  endAdornment?: JSX.Element;
  tabIndex?: string;
}

export default function BamInput(props: any) {
  const theme: any = useTheme();
  const {
    control,
    name,
    rules,
    error,
    label,
    placeholder,
    type,
    endAdornment,
    value,
    disabled = false,
    autoFocus = false,
    tabIndex,
  } = props;

  const { field } = useController({
    control: control,
    defaultValue: "",
    name: name,
    rules: rules,
  });

  return (
    <BamInputStyle theme={theme}>
      {label && <label>{label}</label>}
      <FormControl fullWidth variant="outlined">
        <OutlinedInput
          onChange={field.onChange}
          type={type}
          error={error}
          placeholder={placeholder}
          autoComplete="off"
          endAdornment={endAdornment}
          disabled={disabled}
          autoFocus={autoFocus}
          tabIndex={tabIndex}
          defaultValue={value}
        />
      </FormControl>
    </BamInputStyle>
  );
}

const BamInputStyle = styled("div")(({ theme }: any) => {
  return {
    width: "100%",
    label: {
      display: "flex",
      fontSize: "1rem",
      lineHeight: "1.5rem",
      fontWeight: 400,
      color: theme.gray["80"],
      margin: "0 0 0.5rem",
    },

    input: {
      padding: "8px",
      "&[type=number]": {
        "-moz-appearance": "textfield",
      },
      "&::-webkit-outer-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
      "&::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
    },

    ".MuiFormControl-root": {
      ".MuiOutlinedInput-root": {
        backgroundColor: theme.bgElevation.surface,
        borderRadius: "0.75rem",

        ".MuiOutlinedInput-input": {
          padding: "0.75rem",
          fontSize: "1rem",
          lineHeight: "1.25rem",
          color: theme.gray["80"],

          "&::placeholder": {
            fontSize: "0.875rem",
            color: theme.bgElevation.bodyText,
          },
        },

        ".MuiOutlinedInput-notchedOutline": {
          borderColor: theme.bgElevation.textTop,
        },

        "&.Mui-focused": {
          ".MuiOutlinedInput-notchedOutline": {
            borderWidth: "1px",
            borderColor: theme.secondary["40"],
          },
        },

        "&.Mui-error": {
          ".MuiOutlinedInput-notchedOutline": {
            borderWidth: "1px",
            borderColor: theme.error["40"],
          },
        },
      },
    },
  };
});
