import CloseRoom from "@components/AppModal/CloseRoom";
import ModalAddWhiteList from "@components/AppModal/ModalAddWhiteList";
import ModalCreateRoom from "@components/AppModal/ModalCreateRoom";
import OpenRoom from "@components/AppModal/OpenRoom";
import UpdateDuration from "@components/AppModal/UpdateDuration";
import { useStoreModal } from "@store/useStoreModal";

const GlobalModal = () => {
  const {
    isOpenCreate,
    toggleOpenCreate,
    isOpenAddWhiteList,
    toggleOpenAddWhiteList,

    isOpenUpdateDurationTime,
    toggleOpenUpdateDurationTime,

    isOpenRoom,
    toggleOpenRoom,

    isCloseRoom,
    toggleCloseRoom,
  } = useStoreModal();
  return (
    <div>
      <ModalCreateRoom open={isOpenCreate} toggle={toggleOpenCreate} />
      <ModalAddWhiteList
        open={isOpenAddWhiteList}
        toggle={toggleOpenAddWhiteList}
      />

      <UpdateDuration
        open={isOpenUpdateDurationTime}
        toggle={toggleOpenUpdateDurationTime}
      />

      <OpenRoom open={isOpenRoom} toggle={toggleOpenRoom} />
      <CloseRoom open={isCloseRoom} toggle={toggleCloseRoom} />

      {/* <ModalUserJoinRoom open={openJoinRoom} toggle={toggleJoinRoom} /> */}
    </div>
  );
};
export default GlobalModal;
