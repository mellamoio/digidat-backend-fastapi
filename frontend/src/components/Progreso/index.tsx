import { FaBriefcase } from 'react-icons/fa'
import type { Obra } from '../../types/obra'
import StatusBar from '../StatusBar'
import type { JSX } from 'react'
import { useSateliteActores } from '../../hooks/useUsuarios'

interface Estado {
    id: number
    bgColor: string
    textColor: string
    selectedColor: string
    numberColor: string
    icon?: JSX.Element
    number: number
    label: string
}

const ProgressBar: React.FC = () => {
    const { kpis, selectedId, setSelectedId, obrasFiltradas } =
        useSateliteActores()

    if (!obrasFiltradas || !Array.isArray(obrasFiltradas) || !kpis) {
        return null
    }

    const obrasValidas = obrasFiltradas.filter(
        (obra): obra is Obra => obra !== null && obra !== undefined
    )

    const estados: Estado[] = [
        {
            id: 0,
            bgColor: '#722AE9',
            textColor: '#ffffff',
            selectedColor: '#1c1c9b',
            numberColor: '#ffffff',
            icon: <FaBriefcase style={{ color: '#ffffff' }} />,
            number: kpis.totalObras,
            label: 'Proyectos en Total'
        },
        {
            id: 1,
            bgColor: '#ffffff',
            textColor: '#000000',
            selectedColor: '#c0c0c0',
            numberColor: '#7d7d7d',
            number: obrasValidas.filter((obra) => obra.estado_id === 1).length,
            label: 'Priorización'
        },
        {
            id: 2,
            bgColor: '#ffffff',
            textColor: '#000000',
            selectedColor: 'rgb(238, 203, 27)',
            numberColor: '#FFC667',
            number: obrasValidas.filter((obra) => obra.estado_id === 2).length,
            label: 'Actos Previos'
        },
        {
            id: 3,
            bgColor: '#ffffff',
            textColor: '#000000',
            selectedColor: '#2e7d32',
            numberColor: '#4CAF50',
            number: obrasValidas.filter((obra) => obra.estado_id === 3).length,
            label: 'Selección'
        },
        {
            id: 4,
            bgColor: '#ffffff',
            textColor: '#000000',
            selectedColor: '#5a189a',
            numberColor: '#9C27B0',
            number: obrasValidas.filter((obra) => obra.estado_id === 4).length,
            label: 'Ejecución'
        },
        {
            id: 5,
            bgColor: '#ffffff',
            textColor: '#000000',
            selectedColor: '#004bb5',
            numberColor: '#2196F3',
            number: obrasValidas.filter((obra) => obra.estado_id === 5).length,
            label: 'Emisión de CIPRL o CIPGN'
        }
    ]

    return (
        <StatusBar
            estados={estados}
            selectedId={selectedId!}
            setSelectedId={setSelectedId}
        />
    )
}

export default ProgressBar
