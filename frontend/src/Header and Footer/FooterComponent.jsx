import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaWhatsapp, FaInstagram, FaTwitter, FaLinkedin, FaMapMarkerAlt, FaMobileAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import logo from '../components/images/logoo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const FooterComponent = () => {
  const history = useHistory();

  const links = [
    { path: '/interface-user', label: 'Accueil' },
    { path: '/about', label: 'À propos' },
    { path: '/contact', label: 'Contact' },
    { path: '/interface-user', label: 'Deconnexion' },
  ];

  return (
    <footer
      style={{
        backgroundColor: '#e7f1ff',
        color: '#343a40',
        paddingTop: '4rem',
        paddingBottom: '3rem',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeIn 1s ease-in',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100px',
          background: 'url("data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(77,171,247,0.2)" fill-opacity="1" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,192C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>")',
          backgroundSize: 'cover',
          zIndex: 0,
        }}
      />
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <Row>
          {/* About Section */}
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h5
              className="mb-4 text-center"
              style={{
                fontWeight: '600',
                background: 'linear-gradient(90deg, #4dabf7, #1a91ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                borderBottom: '2px solid rgba(77, 171, 247, 0.3)',
                paddingBottom: '0.5rem',
              }}
            >
              À PROPOS DE NOUS
            </h5>
            <div className="text-center">
              <img
                src={logo}
                alt="ENSA Béni Mellal Logo"
                style={{
                  width: '120px',
                  height: 'auto',
                  marginBottom: '1rem',
                  transition: 'transform 0.3s ease, filter 0.3s ease',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.filter = 'drop-shadow(0 4px 8px rgba(77, 171, 247, 0.5))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))';
                }}
              />
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6', textAlign: 'justify' }}>
              L’École Nationale des Sciences Appliquées de Béni Mellal (ENSA-BM), créée en 2019, est une institution de l’Université Sultan Moulay Slimane (USMS). Membre du réseau ENSA-Maroc, elle forme des ingénieurs dans des domaines comme les énergies renouvelables, l’agroalimentaire et la transformation digitale, tout en proposant des formations continues pour professionnels.
            </p>
          </Col>

          {/* Contact Section */}
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h5
              className="mb-4 text-center"
              style={{
                fontWeight: '600',
                background: 'linear-gradient(90deg, #4dabf7, #1a91ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                borderBottom: '2px solid rgba(77, 171, 247, 0.3)',
                paddingBottom: '0.5rem',
              }}
            >
              CONTACTEZ-NOUS
            </h5>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '10px',
                padding: '1rem',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <p className="mb-3 d-flex align-items-center" style={{ fontSize: '0.85rem' }}>
                <FaMapMarkerAlt size={18} color="#4dabf7" style={{ marginRight: '0.75rem', transition: 'transform 0.3s ease' }} />
                ENSA de Béni Mellal, Campus universitaire Mghila, 23000 Béni Mellal
              </p>
              <p className="mb-3 d-flex align-items-center" style={{ fontSize: '0.85rem' }}>
                <FaEnvelope size={18} color="#4dabf7" style={{ marginRight: '0.75rem', transition: 'transform 0.3s ease' }} />
                <a
                  href="mailto:ensabm.contact@usms.ma"
                  style={{ color: '#343a40', textDecoration: 'none', transition: 'color 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#4dabf7';
                    e.currentTarget.previousSibling.style.transform = 'rotate(360deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#343a40';
                    e.currentTarget.previousSibling.style.transform = 'rotate(0)';
                  }}
                >
                  ensabm.contact@usms.ma
                </a>
              </p>
              <p className="mb-3 d-flex align-items-center" style={{ fontSize: '0.85rem' }}>
                <FaMobileAlt size={18} color="#4dabf7" style={{ marginRight: '0.75rem', transition: 'transform 0.3s ease' }} />
                <a
                  href="tel:+212523424360"
                  style={{ color: '#343a40', textDecoration: 'none', transition: 'color 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#4dabf7';
                    e.currentTarget.previousSibling.style.transform = 'rotate(360deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#343a40';
                    e.currentTarget.previousSibling.style.transform = 'rotate(0)';
                  }}
                >
                  (+212) 523 424 360
                </a>
              </p>
              <p className="mb-3 d-flex align-items-center" style={{ fontSize: '0.85rem' }}>
                <FaPhone size={18} color="#4dabf7" style={{ marginRight: '0.75rem', transition: 'transform 0.3s ease' }} />
                <a
                  href="tel:+212523424361"
                  style={{ color: '#343a40', textDecoration: 'none', transition: 'color 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#4dabf7';
                    e.currentTarget.previousSibling.style.transform = 'rotate(360deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#343a40';
                    e.currentTarget.previousSibling.style.transform = 'rotate(0)';
                  }}
                >
                  (+212) 523 424 361
                </a>
              </p>
            </div>
          </Col>

          {/* Useful Links Section */}
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h5
              className="mb-4 text-center"
              style={{
                fontWeight: '600',
                background: 'linear-gradient(90deg, #4dabf7, #1a91ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                borderBottom: '2px solid rgba(77, 171, 247, 0.3)',
                paddingBottom: '0.5rem',
              }}
            >
              LIENS UTILES
            </h5>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '10px',
                padding: '1rem',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <ul className="list-unstyled">
                {links.map((link) => (
                  <li key={link.label} className="mb-2">
                    <a
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                        history.push(link.path);
                      }}
                      style={{
                        color: '#343a40',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        display: 'block',
                        padding: '0.5rem',
                        transition: 'color 0.3s ease, transform 0.3s ease',
                        animation: 'slideIn 0.5s ease-in',
                        animationFillMode: 'both',
                        animationDelay: `${links.indexOf(link) * 0.1}s`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#4dabf7';
                        e.currentTarget.style.transform = 'translateX(10px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#343a40';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                      aria-label={link.label}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          {/* Social Media Section */}
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h5
              className="mb-4 text-center"
              style={{
                fontWeight: '600',
                background: 'linear-gradient(90deg, #4dabf7, #1a91ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                borderBottom: '2px solid rgba(77, 171, 247, 0.3)',
                paddingBottom: '0.5rem',
              }}
            >
              SUIVEZ-NOUS
            </h5>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '10px',
                padding: '1rem',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {[
                { href: 'https://www.facebook.com/ensabm1/', icon: <FaFacebook size={24} />, color: '#3b5998', label: 'Facebook' },
                { href: 'https://wa.me/212666666666', icon: <FaWhatsapp size={24} />, color: '#25D366', label: 'WhatsApp' },
                { href: 'https://instagram.com', icon: <FaInstagram size={24} />, color: '#e4405f', label: 'Instagram' },
                { href: 'https://twitter.com/EnsabmB', icon: <FaTwitter size={24} />, color: '#1da1f2', label: 'Twitter' },
                { href: 'https://www.linkedin.com/school/ensa-b%C3%A9ni-mellal/', icon: <FaLinkedin size={24} />, color: '#0077b5', label: 'LinkedIn' },
                { href: 'mailto:ensabm.contact@usms.ma', icon: <FaEnvelope size={24} />, color: '#e74c3c', label: 'Email' },
              ].map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    margin: '0.5rem',
                    color: social.color,
                    transition: 'transform 0.3s ease, filter 0.3s ease',
                    animation: 'pulse 2s infinite',
                    animationDelay: `${index * 0.2}s`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.3) rotate(10deg)';
                    e.currentTarget.style.filter = 'drop-shadow(0 2px 4px rgba(77, 171, 247, 0.5))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) rotate(0)';
                    e.currentTarget.style.filter = 'none';
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </Col>
        </Row>
        <div
          style={{
            borderTop: '1px solid rgba(77, 171, 247, 0.3)',
            marginTop: '2rem',
            paddingTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: '#343a40',
          }}
        >
          <p className="mb-0">
            © 2019 - {new Date().getFullYear()} École Nationale des Sciences Appliquées de Béni Mellal. Tous droits réservés.
          </p>
        </div>
      </Container>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </footer>
  );
};

export default FooterComponent;