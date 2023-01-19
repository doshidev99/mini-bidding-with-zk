import { zkApi } from "@api/zkApi";
import BamInput from "@components/Form/BamInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object().shape({
  roomId: yup.number().required("Room ID is required"),
});

const CloseRoom = ({ open, toggle }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{
    roomId: number;
  }>({
    resolver: yupResolver(schema),
    defaultValues: {
      roomId: null,
    },
    mode: "onChange",
  });

  const onSubmit = async (formValues) => {
    try {
      await zkApi.closeRoom({
        room_id: +formValues.roomId,
      });
      toast.success("Room closed successfully");
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <Modal open={open} onClose={toggle}>
        <Box sx={style}>
          <Typography textAlign={"center"} pb={2} variant="subtitle1">
            Close room bidding
          </Typography>

          <BamInput
            control={control}
            name="roomId"
            placeholder="Enter your room"
            label="roomId"
            rules={{ required: true }}
            error={errors.roomId}
            autoFocus={true}
          />

          <Box pt={2} textAlign="right">
            <Button
              variant="outlined"
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              <Typography>Close</Typography>
            </Button>
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

export default CloseRoom;
