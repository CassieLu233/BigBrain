import { useParams } from "react-router";

export const SessionPage = () => {
  const { session_id } = useParams();
  return <div>`Session Page: ${session_id}`</div>;
};
