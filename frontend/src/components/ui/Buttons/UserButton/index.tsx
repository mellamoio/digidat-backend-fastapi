import { UserOutlined } from '@ant-design/icons';
import { AnchorButton } from "./index.styled";

interface UserButtonProps {
  onClick: () => void;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const UserButton: React.FC<UserButtonProps> = ({
  onClick,
  isHovered,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <AnchorButton
      onClick={onClick}
      $isHovered={isHovered}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <UserOutlined />
    </AnchorButton>
  );
};