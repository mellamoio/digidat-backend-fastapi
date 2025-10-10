import { ContainerIcon } from "./index.styled"

interface Props {
    checked?: boolean
    handleClick?: () => void
}
export const CheckboxIcon = ({ checked, handleClick }: Props) => {
    return (
        <ContainerIcon width="16px" height="16px" backgroundColor={'white'} onClick={handleClick} >
            {
                checked ?
                    <svg width="16" height="16" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.22222 7.33333L8.13889 3.41667L7.36111 2.63889L4.22222 5.77778L2.63889 4.19444L1.86111 4.97222L4.22222 7.33333ZM1.11111 10C0.805556 10 0.543981 9.8912 0.326389 9.67361C0.108796 9.45602 0 9.19444 0 8.88889V1.11111C0 0.805556 0.108796 0.543981 0.326389 0.326389C0.543981 0.108796 0.805556 0 1.11111 0H8.88889C9.19444 0 9.45602 0.108796 9.67361 0.326389C9.8912 0.543981 10 0.805556 10 1.11111V8.88889C10 9.19444 9.8912 9.45602 9.67361 9.67361C9.45602 9.8912 9.19444 10 8.88889 10H1.11111Z" fill="#2E2EDA" />
                    </svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill={checked ? 'white' : '#C4C4C4'}><path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" /></svg>
            }
        </ContainerIcon>
    )
}