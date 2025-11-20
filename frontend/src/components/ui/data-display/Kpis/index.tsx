import { LargeFontCard } from './index.styled'
import { DashboardScroll } from '../DashboardScroll'
import { Divider } from 'antd'
import { ItemQuantity } from '../ItemQuantity'
import { useObras } from '../../../../context/ObrasContext'

export const Kpis = () => {
    const { kpis } = useObras();

    return (
        <DashboardScroll>
            <LargeFontCard>
                <ItemQuantity
                    title="Obras por Impuestos en Total"
                    variant="regular"
                    total={kpis?.totalObras || 0}
                />
            </LargeFontCard>

            <Divider type="vertical" style={{ height: '200px', borderColor: '#dddddd' }} />

            <LargeFontCard>
                <ItemQuantity
                    title="Monto Total de Proyectos"
                    variant="money"
                    simbolo="S/."
                    total={kpis?.montoProyectos || 0}
                />
            </LargeFontCard>

            <Divider type="vertical" style={{ height: '200px', borderColor: '#dddddd' }} />

            <LargeFontCard>
                <ItemQuantity
                    title="Montos Pagados"
                    variant="money"
                    simbolo="S/."
                    total={kpis?.montoPagado || 0}
                />
            </LargeFontCard>

            <Divider type="vertical" style={{ height: '200px', borderColor: '#dddddd' }} />

            <LargeFontCard>
                <ItemQuantity
                    title="Montos Recuperados"
                    variant="money"
                    simbolo="S/."
                    total={kpis?.montoRecuperado || 0}
                />
            </LargeFontCard>
        </DashboardScroll>
    )
}

export default Kpis