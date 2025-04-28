import { React, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import dateInscriptionService from '../Gestion Inscription/DateInsciprtionService';
import { useHistory } from 'react-router-dom';
import { Navbar, Nav, Button, Modal } from 'react-bootstrap';
import imgBtnGestionAdmins from '../images/interface_admin.png';
import imgBtnGestionRespos from '../images/interface_responsable.png';
import imgBtnGestionProfs from '../images/interface_prof.png';
import imgBtnGestionEtudiants from '../images/interface_etudiant.png';
import logoEnsaBm from '../images/logo.png';

function InterfaceUser(props) {
  const history = useHistory();
  const [showGuide, setShowGuide] = useState(false);

  const handleShowGuide = () => setShowGuide(true);
  const handleCloseGuide = () => setShowGuide(false);

  function lienInterfaceAdmins() {
    history.replace('/loginAdmin');
  }

  function lienInterfaceResponsables() {
    history.replace('/loginResponsable');
  }

  function lienInterfaceProfs() {
    history.replace('/loginProfesseur');
  }

  function lienInterfaceEtudiants() {
    history.replace('/loginEtudiant');
  }

  function lienInterfaceInscription() {
    history.replace('/interface-inscription');
  }

  const [dateInscreption, setDateInscription] = useState('');

  useEffect(() => {
    dateInscriptionService.getDateById(36).then(res => {
      let date = res.data;
      const dateNaissanceObj = new Date(date.dateInscreption);
      const dateNaissanceISO = moment(dateNaissanceObj).format('DD/MM/YYYY');
      setDateInscription(dateNaissanceISO);
    });
  }, []);

  const today = moment().format('YYYY-MM-DD');
  const inscriptionDate = moment(dateInscreption, 'DD/MM/YYYY');
  const showInscrireMaintenant = moment(today).isBefore(inscriptionDate);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e7f1ff' }}>
      {/* Navbar with glass effect */}
      <Navbar
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          animation: 'fadeIn 1s ease-in',
          padding: '1rem 0',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
        }}
        expand="lg"
        sticky="top"
      >
        <div className="container">
          <Navbar.Brand className="d-flex align-items-center">
            <img
              src={logoEnsaBm}
              alt="Logo ENSA BM"
              style={{ 
                width: '250px', 
                height: 'auto', 
                marginRight: '0.5rem',
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
              }}
            />
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Button
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderColor: '#4dabf7',
                color: '#4dabf7',
                fontSize: '1.1rem',
                padding: '0.5rem 1.5rem',
                borderRadius: '25px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
              }}
              onClick={handleShowGuide}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4dabf7';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.color = '#4dabf7';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
              }}
            >
              Guide d'utilisation
            </Button>
          </Nav>
        </div>
      </Navbar>

      {/* Modal with animation */}
      <Modal
        show={showGuide}
        onHide={handleCloseGuide}
        centered
        style={{
          animation: 'zoomIn 0.3s ease',
        }}
      >
        <Modal.Header closeButton style={{ backgroundColor: '#4dabf7', color: '#fff' }}>
          <Modal.Title>Guide d'utilisation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 style={{ color: '#4dabf7' }}>Bienvenue dans le guide d'utilisation de l'application ENSA Béni Mellal</h5>
          <p>
            Cette application permet de gérer les inscriptions et d'accéder aux interfaces des différents utilisateurs :
          </p>
          <ul>
            <li><strong>Admins :</strong> Gérer les paramètres globaux et les utilisateurs.</li>
            <li><strong>Responsables :</strong> Superviser les inscriptions et les cours.</li>
            <li><strong>Professeurs :</strong> Gérer les notes et les cours.</li>
            <li><strong>Étudiants :</strong> Consulter les notes et s'inscrire.</li>
          </ul>
          <p>
            Cliquez sur le bouton correspondant à votre rôle pour accéder à votre interface. Pour plus d'informations, contactez le support technique.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{
              backgroundColor: '#ffca2c',
              borderColor: '#ffca2c',
              color: '#343a40',
              transition: 'transform 0.3s ease',
            }}
            onClick={handleCloseGuide}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '3rem 0',
        }}
      >
        <div className="container text-center">
          <h4 style={{ fontWeight: '600', color: '#343a40', fontSize: '1.8rem', marginBottom: '2rem' }}>
            École Nationale des Sciences Appliquées de Béni Mellal
          </h4>
        </div>

        {showInscrireMaintenant && (
          <div
            className="text-center mt-4"
            style={{
              maxWidth: '600px',
              backgroundColor: '#4dabf720',
              padding: '1rem',
              borderRadius: '10px',
              animation: 'fadeIn 1s ease-in',
            }}
          >
            <h6
              onClick={lienInterfaceInscription}
              style={{
                cursor: 'pointer',
                color: '#4dabf7',
                fontWeight: '500',
                transition: 'color 0.3s ease, transform 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#1a91ff';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#4dabf7';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Dernière date d'inscription : {dateInscreption}. Inscrivez-vous maintenant !
            </h6>
          </div>
        )}

        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-6 col-md-3 mb-4">
              <div
                onClick={lienInterfaceAdmins}
                style={{
                  animation: 'slideIn 0.5s ease-in',
                  animationDelay: '0s',
                  animationFillMode: 'both',
                }}
              >
                <ButtonWithImage imageUrl={imgBtnGestionAdmins} title="Admins" borderColor="#4dabf7" hoverColor="#1a91ff" />
              </div>
            </div>
            <div className="col-6 col-md-3 mb-4">
              <div
                onClick={lienInterfaceResponsables}
                style={{
                  animation: 'slideIn 0.5s ease-in',
                  animationDelay: '0.1s',
                  animationFillMode: 'both',
                }}
              >
                <ButtonWithImage imageUrl={imgBtnGestionRespos} title="Responsables" borderColor="#ffca2c" hoverColor="#ffda6b" />
              </div>
            </div>
            <div className="col-6 col-md-3 mb-4">
              <div
                onClick={lienInterfaceProfs}
                style={{
                  animation: 'slideIn 0.5s ease-in',
                  animationDelay: '0.2s',
                  animationFillMode: 'both',
                }}
              >
                <ButtonWithImage imageUrl={imgBtnGestionProfs} title="Professeurs" borderColor="#4dabf7" hoverColor="#1a91ff" />
              </div>
            </div>
            <div className="col-6 col-md-3 mb-4">
              <div
                onClick={lienInterfaceEtudiants}
                style={{
                  animation: 'slideIn 0.5s ease-in',
                  animationDelay: '0.3s',
                  animationFillMode: 'both',
                }}
              >
                <ButtonWithImage imageUrl={imgBtnGestionEtudiants} title="Étudiants" borderColor="#ffca2c" hoverColor="#ffda6b" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
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
          @keyframes zoomIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}

const ButtonWithImage = ({ imageUrl, title, borderColor, hoverColor }) => {
  return (
    <div
      className="text-center"
      style={{
        width: '180px',
        height: '200px',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        cursor: 'pointer',
        backgroundColor: '#fff',
        border: `2px solid ${borderColor}`,
        margin: '0 auto',
        animation: 'pulse 2s infinite',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
        e.currentTarget.style.borderColor = hoverColor;
        e.currentTarget.style.animation = 'none';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.borderColor = borderColor;
        e.currentTarget.style.animation = 'pulse 2s infinite';
      }}
    >
      <img
        src={imageUrl}
        alt={title}
        style={{ width: '100%', height: '70%', objectFit: 'cover', borderRadius: '15px 15px 0 0' }}
      />
      <div style={{ padding: '0.75rem', fontWeight: '500', color: '#343a40', backgroundColor: `${borderColor}20` }}>
        {title}
      </div>
    </div>
  );
};

export default InterfaceUser;