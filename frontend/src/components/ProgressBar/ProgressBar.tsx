import { ProgressBarLine } from './ProgressBar.styled'
interface Props {
    value: number | null
}
export const ProgressBar = ({ value }: Props) => {
    return (
        <div
            className="progress progress-table"
            data-toggle="tooltip"
            title={value ? value + '% ' : 'Sin definir'}
        >
            <ProgressBarLine
                poder={value ?? 0}
                className="progress-bar"
                role="progressbar"
                aria-valuenow={value ?? 0}
                aria-valuemin={0}
                aria-valuemax={100}
            />
            <ProgressBarLine
                poder={0}
                className="progress-bar"
                role="progressbar"
                aria-valuenow={0}
                aria-valuemin={0}
                aria-valuemax={100}
            />
        </div>
    )
}