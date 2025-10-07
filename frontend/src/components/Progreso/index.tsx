import { FaBriefcase } from 'react-icons/fa'
import StatusBar from '../StatusBar'
import type { JSX } from 'react'
import React from 'react'

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
    const [selectedId, setSelectedId] = React.useState<number | undefined>(0)

    // Datos estáticos
    const estados: Estado[] = [
        {
            id: 0,
            bgColor: '#722AE9',
            textColor: '#ffffff',
            selectedColor: '#722AE9',
            numberColor: '#ffffff',
            icon: <FaBriefcase style={{ color: '#ffffff' }} />,
            number: 15,
            label: 'Proyectos en Total'
        },
        {
            id: 1,
            bgColor: '#ffffff',
            textColor: '#000000',
            selectedColor: '#c0c0c0',
            numberColor: '#7d7d7d',
            number: 3,
            label: 'Priorización'
        },
        {
            id: 2,
            bgColor: '#ffffff',
            textColor: '#000000',
            selectedColor: 'rgb(238, 203, 27)',
            numberColor: '#FFC667',
            number: 4,
            label: 'Actos Previos'
        },
        {
            id: 3,
            bgColor: '#ffffff',
            textColor: '#000000',
            selectedColor: '#2e7d32',
            numberColor: '#4CAF50',
            number: 3,
            label: 'Selección'
        },
        {
            id: 4,
            bgColor: '#ffffff',
            textColor: '#000000',
            selectedColor: '#5a189a',
            numberColor: '#9C27B0',
            number: 3,
            label: 'Ejecución'
        },
        {
            id: 5,
            bgColor: '#ffffff',
            textColor: '#000000',
            selectedColor: '#004bb5',
            numberColor: '#2196F3',
            number: 2,
            label: 'Emisión de CIPRL o CIPGN'
        }
    ]

    return (
        <StatusBar
          estados={estados}
          selectedId={selectedId} 
          setSelectedId={setSelectedId}
        />
    )
}

export default ProgressBar