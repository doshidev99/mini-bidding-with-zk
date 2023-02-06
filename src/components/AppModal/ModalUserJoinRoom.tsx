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
import { useRoomService } from "@services/roomService";
import { useStoreDataRoom } from "@store/useStoreDataRoom";
import { useStoreProfile } from "@store/useStoreProfile";
import { LocalStorage } from "@utils/newLocalstorage";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object().shape({
  code: yup.string().required(),
  email: yup.string().required(),
  roomId: yup.number().required(),
});

const ModalUserJoinRoom = ({ open, toggle }) => {
  const router = useRouter();
  const [joining, onJoining] = useState(false);
  const [openBid, toggleBid] = useToggle(false);
  const { updateProofId } = useStoreDataRoom();
  const { refetch } = useRoomService();

  const { profile } = useStoreProfile();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{
    code: string;
    email: string;
    roomId: string;
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
      room_id: formValues.roomId,
      email: formValues.email,
      private_code: formValues.code,
    };
    try {
      const proofId = await zkApi.joinRoom(payload);
      const dataGuestSave = {
        [profile. id]: {
          [formValues.roomId]: {
            proofId,
            payload,
          },
        },
      };

      updateProofId(proofId);
      LocalStorage.set("dataGuestSave", dataGuestSave);
      refetch();
      toast.success("Join room successfully");
      toggle();
      router.push(`/guest-rooms/${formValues.roomId}`);
    } catch (e) {
      toast.error(e.message);
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

            <BamInput
              control={control}
              label="Room ID"
              name="roomId"
              placeholder="Enter room ID"
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

      <ModalUserBidding open={openBid} toggle={toggleBid} />
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

export const ModalUserBidding = ({ open, toggle }) => {
  const [isBidding, setIsBidding] = useState(false);
  const { profile } = useStoreProfile();
  const { query } = useRouter();
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
      const _roomHasInvites = LocalStorage.get("dataGuestSave");
      if (!_roomHasInvites) return;
      const _dataJoinRoomByProfile =
        _roomHasInvites[profile. id]?.[query?.id as string];
      const bid_data = await zkApi.joinBidding({
        ..._dataJoinRoomByProfile.payload,
        bid_value: +formValues.bidValue,
      });
      const payload = {
        room_id: +query.id,
        proof_id: _dataJoinRoomByProfile.proofId.proof,
        bid_data: {
          inputs: bid_data.inputs,
          proof: bid_data.proof,
        },
        encrypted_data: bid_data.fake_encrypted_data,
      };
      await zkApi.bidding(payload);
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
          <Typography variant="subtitle1">Bidding room:</Typography>

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

export default ModalUserJoinRoom;
