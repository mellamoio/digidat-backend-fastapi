import { Tooltip } from 'antd'

interface Props {
    list: string[]
}
export const TooltipList = ({ list }: Props) => {
    return list.length > 1 ? (
        <Tooltip placement="top" title={list.join(', ')}>
            <span>{list.length}</span>
        </Tooltip>
    ) : (
        <p>{list.join(', ')}</p>
    )
}
