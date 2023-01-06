import { useAccount } from "wagmi";
import AppListPlayer from "../components/AppListPlayer";
import AppFormBid from "../components/Form/AppFormBid";

const App = () => {
  const { address } = useAccount();

  if (!address) return null;

  return (
    <>
      <div
        style={{
          paddingTop: 100,
        }}
      >
        <AppFormBid />
      </div>
      index page
      <div>
        <AppListPlayer />
      </div>
    </>
  );
};

export default App;
