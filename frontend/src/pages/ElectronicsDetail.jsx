import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import ScrollToTop from "../components/ScrollButton"
import ModalDetailElectronic from "../components/ModalDetailElectronic"

const ElectronicsDetail = () => {
    const { id } = useParams()
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedDevice, setSelectedDevice] = useState(null)

    useEffect(() => {
        axios
            .get(`/api/electronics/${id}`)
            .then((res) => {
                setData(res.data)
                setLoading(false)
            })
            .catch((err) => {
                setError(err.response?.data?.error || 'Ошибка загрузки')
                setLoading(false)
            })
    }, [id])

    const openModal = (device) => setSelectedDevice(device)
    const closeModal = () => setSelectedDevice(null)

    if (loading) return <p>Загрузка...</p>
    if (error) return <div className="container_error">{error}</div>
    if (!data.component) return <p>Компонент не найден</p>

    const { component, devices } = data

    return (
        <div className="container">
            <header>
                <a href="/electronics" className="backLink">← Назад к компонентам</a>
            </header>

            <h1>{component.name_detail}</h1>

            <h2>Устройства на базе этого компонента ({devices.length})</h2>

            <div className="device-cards">
                {devices.length === 0 ? (
                    <p className="empty">Пока нет устройств на базе этого компонента</p>
                ) : (
                    devices.map((dev) => (
                        <div className="device-card" key={dev.id}>
                            <div className="photo">
                                <img 
                                    src={dev.images || "/images/placeholder.png"} 
                                    alt={dev.name_device} 
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.onerror = null
                                        e.target.src = "/images/placeholder.png"
                                    }}
                                />
                            </div>
                            <div className="device-card__content">
                                <h3>{dev.name_device}</h3>
                                <p className="descripstion">{dev.parameters}</p>
                                <button
                                    className="device-card__button"
                                    onClick={() => openModal(dev)}
                                >
                                    Подробнее
                                </button>
                            </div>
                        </div>
                    ))
                )}
                <ScrollToTop />
            </div>

            {selectedDevice && (
                <ModalDetailElectronic
                device={selectedDevice}
                closeModal={closeModal}
                />
            )}
        </div>
    )
}
export default ElectronicsDetail