import React from 'react';
import Slider from '../Slider';
import ProductList from '../ProductList';
import Footer from '../Footer';

function Home() {
    return (
        <div>
            <Slider />
            <ProductList apiUrl={'http://localhost:5195/GetData/GetAllProduct?PageNumber=1'} />
        </div>
    );
}

export default Home;
