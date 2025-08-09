import Nav from "./components/Nav";
import './WelcomePage.css';

function WelcomePage() {
  return (
    <div className="overall">
      <Nav />
      <div className="sect-container">
          <h1>Gink INNOVATION COLLEGE</h1>
          <div className="sect-imgs">
            <img src="/knowledge-hub/school-logo.png" alt="school logo" width="400px" />
            <img src="/knowledge-hub/school-structure.jpg" alt="school ediface" width="400px" />
          </div>
          <h1>60 years and counting...</h1>
          <div className="sect-text">
            <p>Gink Innovation College is a prestigious institution dedicated to providing quality education and fostering innovation. With a rich history spanning over 60 years, we have been at the forefront of academic excellence, nurturing the leaders of tomorrow.</p>
            <p>Our college is committed to creating a vibrant learning environment that encourages creativity, critical thinking, and personal growth. We offer a wide range of programs and extracurricular activities designed to empower students to reach their full potential.</p>
            <p>At Gink Innovation College, we believe in the power of education to transform lives and communities. Join us on this journey of discovery and innovation as we continue to shape the future of education.</p>
          </div>
        </div>
    </div>
  )
}

export default WelcomePage;