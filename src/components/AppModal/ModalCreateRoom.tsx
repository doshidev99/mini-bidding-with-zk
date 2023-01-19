import { zkApi } from "@api/zkApi";
import BamInput from "@components/Form/BamInput";
import UnstyledInputBasic from "@components/Form/CustomInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToggle } from "@hooks/useToggle";
import { Button, CircularProgress, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRoomService } from "@services/roomService";
import { randomInfo } from "@utils/generatorData";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required(),
  info: yup.object().shape({
    description: yup.string().required(),
    website: yup.string().required(),
    phone: yup.string().required(),
  }),
});

const ModalCreateRoom = ({ open, toggle }) => {
  const { refetch } = useRoomService();

  const [submitting, onSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<{
    name: string;
    info: {
      description: string;
      website: string;
      phone: string;
    };
  }>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: randomInfo().name,
      info: {
        description: randomInfo().description,
        website: randomInfo().website,
        phone: randomInfo().phone,
      },
    },
    mode: "onChange",
  });

  const onSubmit = async (formValues) => {
    try {
      onSubmitting(true);
      const payload = {
        ...formValues,
        visibility: "private",
        bid_type: "only_once",
        duration_time: 30,
      };
      const _data = await zkApi.createRoom(payload);
      refetch();
      toast.success(`Create room ${_data.id} successfully`);
      toggle();
    } catch (e) {
    } finally {
      onSubmitting(false);
    }
  };

  return (
    <div>
      <Modal open={open} onClose={toggle}>
        <Box>
          <Box sx={style}>
            <Typography variant="subtitle1">
              Please fill info room below
            </Typography>
            <BamInput
              control={control}
              label="Room name"
              name="name"
              placeholder="Enter your room name"
              value={randomInfo().name}
              rules={{ required: true }}
              error={errors.name}
              autoFocus={true}
            />

            <BamInput
              control={control}
              label="Website"
              name="info.website"
              placeholder="Enter your room's website"
              rules={{ required: true }}
              value={randomInfo().website}
              error={errors.info?.website}
              autoFocus={true}
            />

            <BamInput
              control={control}
              label="Phone number"
              name="info.phone"
              placeholder="Enter your room's phone number"
              value={randomInfo().phone}
              rules={{ required: true }}
              error={errors.info?.phone}
              autoFocus={true}
            />

            <UnstyledInputBasic
              label="Description"
              value={randomInfo().description}
              onChange={(e) => setValue("info.description", e.target.value)}
            />

            <Box textAlign={"center"} mt={3}>
              <Button
                startIcon={
                  submitting && <CircularProgress size={20} color="secondary" />
                }
                variant="outlined"
                type="submit"
                onClick={handleSubmit(onSubmit)}
              >
                Create room
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

export default ModalCreateRoom;
