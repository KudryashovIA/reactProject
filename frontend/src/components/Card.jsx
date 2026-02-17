import { useState } from "react"

const Card = ({
    image,
    title,
    description,
    buttonText,
    to,
    onClick,
}) => {
    const [imgError, setImgError] = useState(false)
    
    const handleImageError = () => {
        setImgError(true)
    }
    
    // Определяем источник изображения
    const imageSource = imgError || !image ? "/images/placeholder.png" : image
    
    const content = (
        <div className="card">
            <div className="photo">
                <img 
                    src={imageSource}
                    alt={title} 
                    loading="lazy" 
                    onError={handleImageError}
                />
            </div>
            <div className="content">
                <h2>{title}</h2>
                {description && <p className="description">{description}</p>}
                {buttonText && (
                    <button className="card__button" onClick={onClick}>
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    )
    
    if (to) {
        return (
            <a href={to} className="card_link">
                {content}
            </a>
        )
    }
    
    return content
}

export default Card