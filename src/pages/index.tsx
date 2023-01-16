import { zkApi } from "@api/zkApi";
import ModalCreateRoom from "@components/AppModal/ModalCreateRoom";
import BamInput from "@components/Form/BamInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToggle } from "@hooks/useToggle";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Skeleton,
  Typography,
} from "@mui/material";
import { useRoomService } from "@services/roomService";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  code: yup.string().required(),
  email: yup.string().required(),
});

const App = () => {
  const { data: roomList, isLoading } = useRoomService();
  const [open, toggle] = useToggle();
  const [openCreate, toggleCreate] = useToggle();
  const [joining, onJoining] = useToggle();

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

  const onSubmit = async (formValues, room_id) => {
    try {
      onJoining();
      const _payload = {
        room_id,
        email: formValues.email,
        private_code: formValues.code,
      };
      const _data = await zkApi.joinRoom(_payload);
      console.log({ _data });
    } catch (e) {
    } finally {
      onJoining();
    }
  };

  if (isLoading)
    return (
      <div className="grid">
        <Skeleton height={600} />
        <Skeleton height={600} />
      </div>
    );

  return (
    <div className="container">
      <Box textAlign={"right"}>
        <Button variant="outlined" color="secondary" onClick={toggleCreate}>
          Create room
        </Button>
      </Box>
      <div className="grid">
        {roomList.map((room) => {
          return (
            <Box key={room.id}>
              <div className="box-card">
                <div>
                  <div className="text-left">
                    <span
                      style={{
                        fontSize: 24,
                      }}
                    >
                      Room Id:
                    </span>{" "}
                    {room.id}
                    <br />
                  </div>
                </div>
                <div className="box-card__img">
                  <Image
                    src={"/assets/img/badge.svg"}
                    alt="Sismo"
                    width={200}
                    height={200}
                  />
                </div>
                <div className="text-center">{room.tree_name || "Name"}</div>

                <Box
                  sx={{
                    margin: "0 auto",
                    paddingTop: 4,
                  }}
                >
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={toggle}
                  >
                    Join room
                  </Button>
                </Box>
                <Box py={2} textAlign="center">
                  Create at:{" "}
                  <span>{new Date(room.created_at).toLocaleString()}</span>
                </Box>
              </div>

              <Modal open={open} onClose={toggle}>
                <Box>
                  <Box sx={style}>
                    <Typography variant="subtitle1">
                      Please enter private code to join the room
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
                          joining && (
                            <CircularProgress size={20} color="secondary" />
                          )
                        }
                        variant="contained"
                        type="submit"
                        onClick={handleSubmit((data) =>
                          onSubmit(data, room.id)
                        )}
                      >
                        Join
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Modal>
            </Box>
          );
        })}
      </div>

      {roomList.length == 0 && (
        <Typography textAlign={"center"} color="secondary ">
          Not have room this time
        </Typography>
      )}

      <ModalCreateRoom open={openCreate} toggle={toggleCreate} />
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

export default App;
