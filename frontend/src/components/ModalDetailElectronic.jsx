const ModalDetailElectronic = (props)=>{
    const {
        device,
        closeModal,
    } = props
    return(
        <div className="modal" onClick={closeModal}>
            <div className="modal__content" onClick={(e) => e.stopPropagation()}>
                <span className="modal__close" onClick={closeModal}>
                    &times;
                </span>
                <img 
                    src={device?.images || "/images/placeholder.png"}
                    alt={device?.name_device}
                    className='modal__image'
                    onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/images/placeholder.png"
                    }}
                />
                <div className="modal__content_container">
                    <h2>{device?.name_device}</h2>
                    <p className="modal__description">
                        {device?.parameters || 'Нет описания'}
                    </p>
                    <p className="modal__price">
                        Цена: {device?.price ? `${device?.price} ₽` : '-'}
                    </p>
                    <button className="modal__button"><a href={device?.url_ozon}  target="_blank" rel="noopener noreferrer" >купить</a></button>
                </div>
            </div>
        </div>
    )
}
export default ModalDetailElectronic