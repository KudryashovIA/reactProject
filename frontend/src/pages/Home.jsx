const Home = () => {
    return (
        <div className="home_page">
            <h1 className="page_title"></h1>
            <div className="catalog">
                {/* <электроника /> */}
                <div className="electronic">
                    <div className="electronic__container">
                            <h2 className="electronic__title">электронные компоненты</h2>
                            <a href="/electronics" 
                                className="electronic__card">
                                <div className="electronic__img"></div>
                                    <p className="electronic__text">датчик расстояния, цвета и нажатия, большой и средний сервомотор</p>    
                            </a>
                            
                    </div>
                </div>
                
                {/* <механика /> */}
                <div className="mechanic">
                    <div className="mechanic__container">
                            <h2 className="mechanic__title">механические компоненты</h2>
                            <a href="/mechanics" 
                                className="mechanic__card">
                                <div className="mechanic__img"></div>
                                    <p className="mechanic__text">балка, ось, рулевая тяга, соединительный штифт с выступом, угловая балка и т.д.</p>
                                
                            </a>
                            
                    </div>

                </div>
            </div>
        </div>
    )
}
export default Home