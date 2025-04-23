import { useParams } from "react-router";

export const PlayPage = () => {
  const { sessionId } = useParams();
  return <div>`Play Page: ${sessionId}`</div>;
};
