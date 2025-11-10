import Navbar from "../components/navbar"
import Content from "../components/Content"
import Footer from "../components/footer"


function LandingPage() {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        <main style={{ flexGrow: 1 }}>
          <Content />
        </main>
        {/* <Footer /> */}
      </div>
    </>
  );
}

export default LandingPage;
