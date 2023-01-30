import { zkApi } from "@api/zkApi";
import BamInput from "@components/Form/BamInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToggle } from "@hooks/useToggle";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import { useDetailInRoom } from "@services/roomService";
import { useStoreDataRoom } from "@store/useStoreDataRoom";
import { LocalStorage } from "@utils/newLocalstorage";
import { useRouter } from "next/router";
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
  const [openBid, toggleBid] = useToggle(false);

  const { updateProofId } = useStoreDataRoom();

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
    onJoining(true);
    const payload = {
      room_id: roomId,
      email: formValues.email,
      private_code: formValues.code,
    };
    try {
      const proofId = await zkApi.joinRoom(payload);
      updateProofId(proofId);
      LocalStorage.set("proofId", proofId);
      LocalStorage.set("prevPayload", payload);
      toast.success("Join room successfully");
      toggleBid();
      toggle();
    } catch (e) {
      toast.error(e.message);
    } finally {
      onJoining(false);
    }

    // Promise.all([
    //   zkApi.joinRoom(payload),
    //   // zkApi.joinBidding({
    //   //   ...payload,
    //   //   bid_value: +formValues.bidValue,
    //   // }),
    // ])
    //   .then(async ([proofId, bid_data]) => {
    //     console.log("proofId", proofId);

    //     // updateBidData(bid_data);
    //     // const payload = {
    //     //   room_id: roomId,
    //     //   proof_id: proofId.proof,
    //     //   bid_data: {
    //     //     inputs: bid_data.inputs,
    //     //     proof: bid_data.proof,
    //     //   },
    //     //   encrypted_data: bid_data.fake_encrypted_data,
    //     // };
    //     // await zkApi.bidding(payload);
    //     toast.success("Join room successfully");
    //     // toggle();
    //   })
    //   .catch((e) => {
    //     toast.error(e.message);
    //   })
    //   .finally(() => {
    //     onJoining(false);
    //   });
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

            {/* <BamInput
              control={control}
              label="Value bid"
              name="bidValue"
              placeholder="Enter your value bid"
              rules={{ required: true }}
              error={errors.bidValue}
              autoFocus={true}
            /> */}

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

      <ModalBidding open={openBid} toggle={toggleBid} roomId={roomId} />
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

const ModalBidding = ({ open, toggle, roomId }) => {
  const [isBidding, setIsBidding] = useState(false);
  const { refetch } = useDetailInRoom();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{
    bidValue: number;
  }>({
    resolver: yupResolver(
      yup.object().shape({
        bidValue: yup.number().required(),
      })
    ),
    defaultValues: {},
    mode: "onChange",
  });

  const onBidding = async (formValues) => {
    setIsBidding(true);
    try {
      const prevPayload = LocalStorage.get("prevPayload");
      const proofId = LocalStorage.get("proofId");
      const bid_data = await zkApi.joinBidding({
        ...prevPayload,
        bid_value: +formValues.bidValue,
      });
      const payload = {
        room_id: roomId,
        proof_id: proofId.proof,
        bid_data: {
          inputs: bid_data.inputs,
          proof: bid_data.proof,
        },
        encrypted_data: bid_data.fake_encrypted_data,
      };
      await zkApi.bidding(payload);
      refetch();
      toast.success("Bidding successfully");
      toggle();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsBidding(false);
    }
  };

  return (
    <Modal open={open} onClose={toggle}>
      <Box>
        <Box sx={style}>
          <Typography variant="subtitle1">
            Bidding room:
            {roomId && roomId}
          </Typography>

          <BamInput
            control={control}
            label="Value bid"
            name="bidValue"
            placeholder="Enter your value bid"
            rules={{ required: true }}
            error={errors.bidValue}
            autoFocus={true}
          />

          <Box textAlign={"center"} mt={3}>
            <Button
              startIcon={
                isBidding && <CircularProgress size={20} color="secondary" />
              }
              variant="contained"
              type="submit"
              onClick={handleSubmit(onBidding)}
            >
              Bidding
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalJoinRoom;
