import { useRef, useState, useEffect } from "react";
import { Typography, Tooltip } from "antd";
const { Text } = Typography;

export const OverflowAwareText = ({ children, ...props }) => {
  const ref = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setIsOverflow(el.scrollWidth > el.clientWidth);
  }, [children]);

  return (
    <Tooltip title={isOverflow ? children : ""}>
      <Text
        ref={ref}
        {...props}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          ...props.style,
        }}
      >
        {children}
      </Text>
    </Tooltip>
  );
};
