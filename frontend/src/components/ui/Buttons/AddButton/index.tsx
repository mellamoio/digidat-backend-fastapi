import { StyledButton } from "./index.styled";

interface Props {
  label: string;
  handleClick: () => void;
}


export const AddButton: React.FC<Props> = ({ label, handleClick }: Props) => {
    return (
        <StyledButton style={{

        }} onClick={handleClick}>
            {
                label
            }
        </StyledButton>
  );
};