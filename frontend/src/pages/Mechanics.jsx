import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card'
import ModalDetailMechanic from '../components/ModalDetailMechanic';

const Mechanics = ()=>{
    const [parts, setParts] = useState([])
    const [selectedPart, setSelectedPart] = useState(null)
    const [loging, setLoging] = useState(true)

    useEffect(()=>{
        axios
            .get('/api/mechanics')
            .then((res)=>{
                setParts(res.data)
                setLoging(false)
            })
            .catch((err)=>{
                console.log(err)
                setLoging(false)
            })
    },[])

    const openModal = (part)=> setSelectedPart(part)
    const closeModal = ()=> setSelectedPart(null)

    if (loging) return <p>Загрузка...</p>

    return (
        <div className="container">
            <header>
                <h1>Механические детали</h1>
                <a href="/" className="backLink">← На главную</a>
            </header>

            <main className="cards">
                {parts.length === 0 ?(
                    <p className="empty">Механические детали ещё не добавлены</p>
                ):(
                    parts.map((part)=>(
                        <Card
                            key={part.id}
                            image={part.photo || "/images/placeholder.png"}
                            title={part.name_detail}
                            buttonText="Подробнее"
                            onClick={()=>openModal(part)}
                        />
                    )))}
            </main>

            {selectedPart && (
                <ModalDetailMechanic part={selectedPart} onClose={closeModal} />
            )}
        </div>
    )

}
export default Mechanics