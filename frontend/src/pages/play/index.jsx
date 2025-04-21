import { useParams } from "react-router";

export const PlayPage = () => {
  const { session_id } = useParams();
  return <div>`Play Page: ${session_id}`</div>;
};
