import { zkApi } from "@api/zkApi";
import BamInput from "@components/Form/BamInput";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import { Router, useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object().shape({
  code: yup.string().required(),
  email: yup.string().required(),
});

const ModalJoinRoom = ({ open, toggle, roomId }) => {
  const [joining, onJoining] = useState(false);
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{
    code: string;
    email: string;
  }>({
    resolver: yupResolver(schema),
    defaultValues: {
      code: "",
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (formValues) => {
    try {
      onJoining(true);
      const _payload = {
        room_id: roomId,
        email: formValues.email,
        private_code: formValues.code,
      };
      const _data = await zkApi.joinRoom(_payload);
      toast.success("Join room successfully");
      router.push(`/rooms/${roomId}`);
      console.log({ _data });
    } catch (e) {
    } finally {
      onJoining(false);
    }
  };
  return (
    <div>
      <Modal open={open} onClose={toggle}>
        <Box>
          <Box sx={style}>
            <Typography variant="subtitle1">
              Please enter private code to join the room:
              {roomId}
            </Typography>
            <BamInput
              control={control}
              label="Email"
              name="email"
              placeholder="Enter your email"
              rules={{ required: true }}
              error={errors.email}
              autoFocus={true}
            />

            <BamInput
              control={control}
              label="Code"
              name="code"
              placeholder="Enter code"
              rules={{ required: true }}
              error={errors.code}
              autoFocus={true}
            />

            <Box textAlign={"center"} mt={3}>
              <Button
                startIcon={
                  joining && <CircularProgress size={20} color="secondary" />
                }
                variant="contained"
                type="submit"
                onClick={handleSubmit(onSubmit)}
              >
                Join
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  color: "#fff",
  bgcolor: "background.paper",
  // border: "2px solid #000",
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

export default ModalJoinRoom;
