import { zkApi } from "@api/zkApi";
import BamInput from "@components/Form/BamInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CircularProgress, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useDetailInRoom } from "@services/roomService";
import { useStoreDataInRoom } from "@store/useStoreDataInRoom";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object().shape({
  duration_time: yup.number().required("Duration time is required"),
});

const UpdateDuration = ({ open, toggle }) => {
  const { query } = useRouter();
  const { refetch } = useDetailInRoom();

  const { currentRoom } = useStoreDataInRoom();

  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{
    duration_time: number;
  }>({
    resolver: yupResolver(schema),
    defaultValues: {},
    mode: "onChange",
  });

  const onSubmit = async (formValues) => {
    try {
      setIsLoading(true);
      await zkApi.updateDuration({
        room_id: +query.id,
        duration_time: +formValues.duration_time,
      });

      refetch();
      toast.success("Update duration time successfully");
      // await zkApi.getResultByRoom({ room_id: +formValues.roomId });
      toggle();
    } catch (e) {
      toast.error(e.message);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Modal open={open} onClose={toggle}>
        <Box sx={style}>
          <Typography textAlign={"center"} pb={2} variant="subtitle1">
            Update duration
            <Typography fontSize={"13px"}>
              Current Duration : {currentRoom?.duration_time * 1000}s
            </Typography>
          </Typography>

          <BamInput
            control={control}
            name="duration_time"
            placeholder="new duration time..."
            label="New duration"
            rules={{ required: true }}
            error={errors.duration_time}
            autoFocus={true}
          />

          <Box pt={2} textAlign="right">
            <Button
              variant="outlined"
              type="submit"
              onClick={handleSubmit(onSubmit)}
              startIcon={isLoading && <CircularProgress size={20} />}
            >
              <Typography>Submit</Typography>
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

export default UpdateDuration;
