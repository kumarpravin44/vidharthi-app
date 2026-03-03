import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import HeroBanner from "../components/HeroBanner";
import Categories from "../components/Categories";
import BottomNav from "../components/BottomNav";

function Home() {
  return (
    <div>
      <Header />
      <div className="content">
      <SearchBar />
      <HeroBanner />
      <Categories />
      </div>
      <BottomNav />
    </div>
  );
}

export default Home;