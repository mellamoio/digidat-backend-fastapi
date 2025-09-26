import { CheckboxIcon } from "../../Icons/CheckboxIcon";

interface CheckboxButtonProps {
    checked: boolean;
    onChange: () => void;
}

export const CheckboxButton = ({ checked, onChange }: CheckboxButtonProps) => {
    return (
        <span onClick={onChange} style={{ cursor: "pointer" }}>
            <CheckboxIcon checked={checked} />
        </span>
    );
};