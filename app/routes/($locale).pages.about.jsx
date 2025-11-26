export const meta = () => {
  return [{title: 'About Us - SpringTime Wishes'}];
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About SpringTime Wishes</h1>
        <p>Discover our story</p>
      </section>

      <section className="about-content">
        <div className="about-section">
          <h2>Our Story</h2>
          <p>
            SpringTime Wishes was founded with a passion for creating unique,
            handcrafted pieces that celebrate individuality and style...
          </p>
        </div>

        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            We believe in sustainable fashion that doesn't compromise on quality
            or design. Every piece is carefully crafted...
          </p>
        </div>

        <div className="about-section">
          <h2>Our Values</h2>
          <ul>
            <li>Sustainability</li>
            <li>Quality craftsmanship</li>
            <li>Unique designs</li>
            <li>Customer satisfaction</li>
          </ul>
        </div>
      </section>

      <section className="about-team">
        <h2>Meet the Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <img src="/images/team/member-1.jpg" alt="Team member" />
            <h3>Name</h3>
            <p>Founder & Designer</p>
          </div>
          {/* Más miembros del equipo */}
        </div>
      </section>
    </div>
  );
}
