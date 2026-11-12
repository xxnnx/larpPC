import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import ZonesSection from "../../components/Zones/ZonesSection";
import Gallery from "../../components/Gallery/Gallery";
import Booking from "../../components/Booking/Booking";
import PopularGames from "../../components/PopularGames/PopularGames";
import Footer from "../../components/Footer/Footer";


function Home(){
    return(
        <>
            <Header/>
            <Hero/>
            <ZonesSection />
            <Gallery />
            <PopularGames />
            <Booking />
            <Footer />
        
        </>
    );
}

export default Home