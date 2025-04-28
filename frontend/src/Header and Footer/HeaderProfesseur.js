import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { FaSignOutAlt, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import logo from '../components/images/logoo.png';
import professeurService from '../components/Gestion Profs/ProfesseurService';
import 'bootstrap/dist/css/bootstrap.min.css';

const HeaderProfesseur = () => {
  const cinProf = localStorage.getItem('cinProfesseur');
  const [professeur, setProfesseur] = useState(null);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (cinProf) {
      professeurService
        .getProfesseurById(cinProf)
        .then((response) => {
          setProfesseur(response.data);
        })
        .catch((err) => {
          console.error('Error fetching professeur:', err);
          // Silently fail, no error message
        });
    }
  }, [cinProf]);

  const handleLogout = () => {
    history.push('/interface-user');
  };

  const AccueilProf = () => {
    history.push('/interface-principale-professeur');
  };

  const handleShowAbout = () => setShowAboutModal(true);
  const handleCloseAbout = () => setShowAboutModal(false);

  const handleShowContact = () => setShowContactModal(true);
  const handleCloseContact = () => setShowContactModal(false);

  return (
    <>
      <nav
        className="navbar navbar-expand-lg"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          animation: 'fadeIn 1s ease-in',
          minHeight: '80px',
        }}
      >
        <div className="container">
          {/* Logo (Left) */}
          <a
            className="navbar-brand"
            href="/interface-principale-professeur"
            onClick={(e) => {
              e.preventDefault();
              AccueilProf();
            }}
          >
            <img
              src={logo}
              alt="ENSA Béni Mellal Logo"
              style={{
                width: '250px',
                height: 'auto',
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
              }}
            />
          </a>

          {/* Toggle Button for Mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation and User Info (Right) */}
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <div className="d-flex align-items-center">
              {/* User Info */}
              <div className="d-none d-lg-flex flex-column align-items-end me-3">
                {professeur ? (
                  <h5
                    style={{
                      color: '#343a40',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {professeur.nom || ''} {professeur.prenom || ''}, {professeur.cin || 'N/A'}
                  </h5>
                ) : (
                  <span style={{ color: '#343a40', fontSize: '0.9rem' }}>Chargement...</span>
                )}
              </div>

              {/* Navigation Links */}
              <div className="navbar-nav d-flex flex-row flex-lg-row align-items-center">
                <button
                  className="nav-link mx-2"
                  onClick={AccueilProf}
                  style={{
                    color: '#4dabf7',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#1a91ff';
                    e.currentTarget.style.backgroundColor = 'rgba(77, 171, 247, 0.1)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#4dabf7';
                    e.currentTarget.style.backgroundColor = 'none';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  aria-label="Retour à l'accueil professeur"
                >
                  Accueil
                </button>
                <button
                  className="nav-link mx-2"
                  onClick={handleShowContact}
                  style={{
                    color: '#4dabf7',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#1a91ff';
                    e.currentTarget.style.backgroundColor = 'rgba(77, 171, 247, 0.1)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#4dabf7';
                    e.currentTarget.style.backgroundColor = 'none';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  aria-label="Contact"
                >
                  Contact
                </button>
                <button
                  className="nav-link mx-2"
                  onClick={handleShowAbout}
                  style={{
                    color: '#4dabf7',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#1a91ff';
                    e.currentTarget.style.backgroundColor = 'rgba(77, 171, 247, 0.1)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#4dabf7';
                    e.currentTarget.style.backgroundColor = 'none';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  aria-label="À propos"
                >
                  À propos
                </button>
                <button
                  className="nav-link mx-2 d-flex align-items-center"
                  onClick={handleLogout}
                  style={{
                    color: '#ffca2c',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '25px',
                    backgroundColor: 'rgba(255, 202, 44, 0.1)',
                    border: '1px solid #ffca2c',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.backgroundColor = '#ffca2c';
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#ffca2c';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 202, 44, 0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  aria-label="Déconnexion"
                >
                  <FaSignOutAlt style={{ marginRight: '0.5rem' }} />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* About Modal */}
      <Modal
        show={showAboutModal}
        onHide={handleCloseAbout}
        centered
        style={{ animation: 'fadeIn 0.5s ease-in' }}
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(77, 171, 247, 0.3)',
          }}
        >
          <Modal.Title style={{ color: '#4dabf7', fontWeight: '600' }}>
            À Propos de l’ENSA Béni Mellal
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#343a40',
            fontSize: '1rem',
            lineHeight: '1.6',
          }}
        >
          <p>
            Fondée en 2019, l’ENSA Béni Mellal est une école d’ingénieurs publique rattachée à l’Université Sultan Moulay Slimane. Membre du réseau ENSA-Maroc, elle excelle dans la formation en énergies renouvelables, agroalimentaire et transformation digitale.
          </p>
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(77, 171, 247, 0.3)',
          }}
        >
          <Button
            variant="secondary"
            onClick={handleCloseAbout}
            style={{
              backgroundColor: '#6c757d',
              borderColor: '#6c757d',
              color: '#ffffff',
              borderRadius: '25px',
              padding: '0.5rem 1rem',
            }}
          >
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Contact Modal */}
      <Modal
        show={showContactModal}
        onHide={handleCloseContact}
        centered
        style={{ animation: 'fadeIn 0.5s ease-in' }}
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(77, 171, 247, 0.3)',
          }}
        >
          <Modal.Title style={{ color: '#4dabf7', fontWeight: '600' }}>
            Contactez-Nous
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#343a40',
            fontSize: '1rem',
            lineHeight: '1.6',
          }}
        >
          <p className="mb-2">
            <FaEnvelope style={{ marginRight: '0.5rem', color: '#4dabf7' }} />
            <a
              href="mailto:ensabm.contact@usms.ma"
              style={{ color: '#4dabf7', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              ensabm.contact@usms.ma
            </a>
          </p>
          <p className="mb-2">
            <FaInfoCircle style={{ marginRight: '0.5rem', color: '#4dabf7' }} />
            <a
              href="tel:+212523424300"
              style={{ color: '#4dabf7', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              (+212) 523 424 300
            </a>
          </p>
          <p className="mb-0">
            <FaInfoCircle style={{ marginRight: '0.5rem', color: '#4dabf7' }} />
            ENSA de Béni Mellal, Campus universitaire Mghila, 23000 Béni Mellal
          </p>
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(77, 171, 247, 0.3)',
          }}
        >
          <Button
            variant="secondary"
            onClick={handleCloseContact}
            style={{
              backgroundColor: '#6c757d',
              borderColor: '#6c757d',
              color: '#ffffff',
              borderRadius: '25px',
              padding: '0.5rem 1rem',
            }}
          >
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @media (max-width: 991px) {
            .navbar-nav {
              flex-direction: column;
              align-items: flex-start;
              padding: 1rem;
            }
            .nav-link {
              margin: 0.5rem 0;
            }
          }
        `}
      </style>
    </>
  );
};

export default HeaderProfesseur;