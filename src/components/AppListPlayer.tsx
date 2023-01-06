import { Col, Empty, Row, Skeleton, Table, Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { useAccount } from "wagmi";
import { useToggle } from "../hooks/useToggle";
import { useStorageData } from "../store/useStorageData";
import { useGetPlayers } from "../web3/useGetListPlayer";

const AppListPlayer = () => {
  /* 
    1. GET totalUsersBidding
    2. GET getUserByIndex -> address user
    3. CHECK user bid bidHashes[user] --yes-> bidHash ---no-> bidHash = bid(bidValue);
    4. CHECK user have reveal bidValues[user] -> bidValue ---no-> revealBid(proofBid, bidValue);
  */

  const { isConnected } = useAccount();
  const { biddingOpen, biddingEnd } = useStorageData();

  if (!isConnected) return <div>please connect wallet</div>;

  if (!biddingOpen && !biddingEnd) return null;
  return <DashBoardContent />;
};

interface DataType {
  key: string;
  address: string | unknown;
  bidHash: string | number | unknown;
  bidValue: string | number | unknown;
  tags: string[];
}

const DashBoardContent = () => {
  const [open, onToggle] = useToggle(false);

  const { loading } = useGetPlayers();
  const { dataList, totalRevealed } = useStorageData();

  const handleCancel = () => {
    onToggle();
  };

  const handleOk = async () => {
    // const tx = await zkBidInstance?.bid(dataBid.proofBid, dataBid.hash);
    // toast.promise(tx.wait().finally(onToggle), {
    //   loading: "Loading",
    //   success: "Got the data",
    //   error: "Error when fetching",
    // });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      render: (stt) => <small>{stt}</small>,
    },

    {
      title: "Auctioneer",
      dataIndex: "address",
      key: "bid hash",
      render: (address) => <small>{address}</small>,
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "Not Ready") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Bid Value",
      dataIndex: "bidValue",
      key: "bid value",
      sorter: (a: any, b: any) =>
        !!+a.bidValue ? +a.bidValue - +b.bidValue : 0,
      render: (value) => {
        return (
          <small>
            {!!+value ? +value : <Tag color="processing">Waiting reveal</Tag>}
          </small>
        );
      },
    },
  ];

  if (!dataList) return null;

  return (
    <>
      <Row justify={"space-between"}>
        <Col md={12}>
          <Typography>
            <Typography.Title className="font-game">
              Total Auctioneer: {+dataList?.length}
            </Typography.Title>
          </Typography>
        </Col>

        <Col
          md={12}
          style={{
            textAlign: "right",
          }}
        >
          <Typography>
            <Typography.Title className="font-game">
              Revealed: {totalRevealed} / {+dataList?.length}
            </Typography.Title>
          </Typography>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={dataList.length > 0 ? dataList : []}
        locale={{
          emptyText: loading ? <Skeleton active={true} /> : <Empty />,
        }}
      />
    </>
  );
};
export default AppListPlayer;
