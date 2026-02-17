import { useState, useEffect } from "react";
import Card from "../components/Card";
import axios from "axios";
import ScrollToTop from "../components/ScrollButton";

const Electronics = () => {
const [components, setComponents] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
    axios
    .get("/api/electronics")
    .then((res) => {
        setComponents(res.data)
        setLoading(false)
    })
    .catch((err) => {
        setError("Не удалось загрузить компоненты")
        setLoading(false)
        console.error(err)
    });
}, []);


if (loading) return <p>Загрузка...</p>
if (error) return <div className="container_error">{error}</div>;
return (
    <section className="container">
    <header>
        <h1>Электронные компоненты</h1>
        <a href="/" className="backLink">
        ← На главную
        </a>
    </header>

    <main className="cards">
        {components.map((comp) => (
        <Card
            key={comp.id}
            to={`/electronics/${comp.id}`}
            image={comp.images || "/images/placeholder.png"}
            title={comp.name_detail}
            description={comp.description || "Нет описания"}
            buttonText="Подробнее"
        />
        ))}
        </main>
        < ScrollToTop />
    </section>
    );
};
export default Electronics;
