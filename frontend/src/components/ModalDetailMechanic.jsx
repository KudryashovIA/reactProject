const ModalDetailMechanic =(props)=>{
    const {
        part,
        onClose,
    }=props
    return(
        <div className="modal" onClick={onClose}>
            <div className="modal__content" onClick={(e)=>e.stopPropagation()}>
                <span className="modal__close" onClick={onClose}>
                    &times;
                </span>

                <img
                id="modal-photo"
                src={part.photo || '/images/placeholder.png'}
                alt={part.name_detail}
                className="modal__image"
                onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/images/placeholder.png"
                }}
                />
                <div className="modal__content_container">
                    <h2>{part.name_detail}</h2>
                    <p>{part.description}</p>
                    <div className="modal-links">
                    {part.stl && (
                        <a href={part.stl} className="download-btn" download>
                        Скачать STL
                        </a>
                        )}
                    {part.m3d && (
                        <a href={part.m3d} className="download-btn" download>
                        Скачать M3D
                        </a>
                    )}
                    </div>
                </div>
            </div>
        </div> )
}
export default ModalDetailMechanic