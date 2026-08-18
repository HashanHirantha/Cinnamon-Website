import Hero from '../components/Hero';
import CinnamonStory from '../components/CinnamonStory';
import FeaturedProducts from '../components/FeaturedProducts';
import ProductCategories from '../components/ProductCategories';
import WhyCeylon from '../components/WhyCeylon';
import CinnamonJourney from '../components/CinnamonJourney';
import ProductShowcase from '../components/ProductShowcase';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';

const Home = () => {
    return (
        <main>
            <Hero />
            <CinnamonStory />
            <FeaturedProducts />
            <ProductCategories />
            <WhyCeylon />
            <CinnamonJourney />
            <ProductShowcase />
            <Testimonials />
            <CTASection />
        </main>
    );
};

export default Home;
