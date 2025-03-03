import React from 'react';

function Slider() {
    return (
        <section className="slider mt-3">
            <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {[1, 2, 3, 4, 5].map((_, index) => (
                        <div key={index} style={{border : "0px"}} className={`carousel-item ${index === 0 ? 'active' : ''}`} data-bs-interval="5000">
                            <img
                                style={{ borderRadius: '20px', paddingLeft: '5px', paddingRight: '5px' }}
                                src={`/SL/ll${index + 1}.jpg`}
                                className="d-block w-100"
                                alt="Slide"
                            />
                        </div>
                    ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </section>
    );
}

export default Slider;
