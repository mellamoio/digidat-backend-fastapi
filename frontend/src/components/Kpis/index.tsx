import { LargeFontCard } from './index.styled'
import { DashboardScroll } from '../DashboardScroll'
import { Divider } from 'antd'
import { ItemQuantity } from '../ItemQuantity'

export const DashboardTodos = () => {
    // Datos estáticos para pruebas
    const montoPagado = 125000;
    const montoRecuperado = 87500;
    const loading = false;
    
    // Datos estáticos para los KPIs
    const kpis = {
        totalObras: 42,
        montoTotal: 1250000
    };

    return (
        <DashboardScroll>
            <LargeFontCard>
                <ItemQuantity
                    title="Obras por Impuestos en Total"
                    variant="regular"
                    total={kpis.totalObras}
                />
            </LargeFontCard>

            <Divider
                type="vertical"
                style={{ height: '100%', borderColor: '#dddddd' }}
            />

            <LargeFontCard>
                <ItemQuantity
                    title="Monto Total de Proyectos"
                    variant="money"
                    simbolo="S/."
                    total={kpis.montoTotal}
                />
            </LargeFontCard>

            <Divider
                type="vertical"
                style={{ height: '100%', borderColor: '#dddddd' }}
            />

            <LargeFontCard>
                <ItemQuantity
                    title="Montos Pagados"
                    variant="money"
                    simbolo="S/."
                    total={montoPagado}
                />
            </LargeFontCard>

            <Divider
                type="vertical"
                style={{ height: '100%', borderColor: '#dddddd' }}
            />

            <LargeFontCard>
                <ItemQuantity
                    title="Montos Recuperados"
                    variant="money"
                    simbolo="S/."
                    total={montoRecuperado}
                />
            </LargeFontCard>
        </DashboardScroll>
    )
}

export default DashboardTodos
