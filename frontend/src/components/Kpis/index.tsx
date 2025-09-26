import { LargeFontCard } from './index.styled'
import { DashboardScroll } from '../DashboardScroll'
import { Divider } from 'antd'
import { ItemQuantity } from '../ItemQuantity'
import { useEffect, useState } from 'react'
import { message } from 'antd'
import { useSateliteActores } from '../../hooks/useUsuarios'

export const DashboardTodos = () => {
    const { kpis, empresaId, obrasFiltradas } = useSateliteActores()
    const [montoPagado, setMontoPagado] = useState<number>(0)
    const [montoRecuperado, setMontoRecuperado] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const cargarPagos = async () => {
            if (!empresaId || !obrasFiltradas || obrasFiltradas.length === 0) {
                setMontoPagado(0)
                setMontoRecuperado(0)
                return
            }

            setLoading(true)
            try {
                const obrasValidas = obrasFiltradas.filter(
                    (obra: undefined): obra is NonNullable<typeof obra> =>
                        obra !== undefined
                )
                if (obrasValidas.length === 0) {
                    setMontoPagado(0)
                    setMontoRecuperado(0)
                    return
                }

                const totales = obrasFiltradas.reduce(
                    (acc: { total_pagado: any; total_recuperado: any }, item: { monto_pagado: any; monto_recuperado: any }) => {
                        acc.total_pagado += item.monto_pagado || 0
                        acc.total_recuperado += item.monto_recuperado || 0
                        return acc
                    },
                    { total_pagado: 0, total_recuperado: 0 }
                )
                setMontoPagado(totales.total_pagado)
                setMontoRecuperado(totales.total_recuperado)
            } catch (error: any) {
                message.error('No se pudieron cargar los datos de pagos.')
                setMontoPagado(0)
                setMontoRecuperado(0)
            } finally {
                setLoading(false)
            }
        }

        cargarPagos()
    }, [empresaId, obrasFiltradas])

    if (!kpis) {
        return null
    }

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
                    title="Montos de Proyectos"
                    variant="money"
                    simbolo="S/."
                    total={kpis.montoProyectos}
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
