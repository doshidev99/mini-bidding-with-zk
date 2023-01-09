import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useToggle } from "../../hooks/useToggle";
import { useZkFunction } from "../../hooks/useZkFunction";
import BamInput from "./BamInput";

export const FormCreateSession = () => {
  const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    roomID: yup.number().required("Room ID is required"),
    privateCode: yup.string().required("Code is required"),
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<{
    username: string;
    roomID: number;
    privateCode: string;
  }>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      roomID: 0,
      privateCode: "",
    },
    mode: "onChange",
  });

  const [loading, toggleLoading] = useToggle(false);
  const { onCreateSession } = useZkFunction();
  const onSubmit = async (payload: any) => {
    toggleLoading();
    await onCreateSession({
      username: payload.username,
      roomID: payload.roomID,
      privateCode: payload.privateCode,
    });
    toggleLoading();
  };

  return (
    <Box
      sx={{
        margin: "0 auto",
        width: 400,
        background: "rgb(42, 53, 87)",
        borderRadius: 5,
        padding: 5,
      }}
    >
      <form>
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
            name="username"
            label="username"
            rules={{ required: true }}
            error={errors.username}
            placeholder="user name"
            autoFocus={true}
          />
          <BamInput
            control={control}
            name="roomID"
            label="roomID"
            rules={{ required: true }}
            error={errors.roomID}
            placeholder="Room ID"
            autoFocus={true}
          />
          <BamInput
            control={control}
            name="privateCode"
            label="code"
            rules={{ required: true }}
            error={errors.privateCode}
            placeholder="Code room"
            autoFocus={true}
          />

          <Box textAlign={"center"} mt={3}>
            <Button
              startIcon={loading && <CircularProgress size={20} />}
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
              }}
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              Create Session
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};
