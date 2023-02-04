import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, CircularProgress } from "@mui/material";
import { authService } from "@services/auth0Service";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { useToggle } from "../../hooks/useToggle";
import BamInput from "./BamInput";

export const FormLogin = () => {
  const schema = yup.object().shape({
    username: yup.string().required(),
    password: yup
      .string()
      .required()
      .test(
        "password",
        "Password must be at least 6 characters",
        (value) => value.length > 6
      ),
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<{
    username: string;
    password: string;
  }>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  const [isLoading, toggle, onClose] = useToggle();
  const onSubmit = (formValues) => {
    console.log({ formValues });

    toggle();
    authService
      .loginWithUser({
        username: formValues.username,
        password: formValues.password,
      })
      .catch((err) => {
        onClose();
        toast.error(err?.error_description || "Login failed");
      });
  };

  console.log({ errors });

  return (
    <Box
      sx={{
        margin: "0 auto",
        width: 400,
        background: "#001E3C",
        borderRadius: 5,
        padding: 5,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <BamInput
          control={control}
          label="Username"
          name="username"
          rules={{ required: true }}
          error={errors.username}
          autoFocus={true}
        />

        <BamInput
          control={control}
          label="Password"
          name="password"
          type="password"
          rules={{ required: true }}
          error={errors.password}
          autoFocus={true}
        />

        <Box textAlign={"center"} mt={3}>
          <Button
            startIcon={
              isLoading && <CircularProgress size={20} color="secondary" />
            }
            variant="contained"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            login
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
