import React from 'react';
import { useHistory } from 'react-router-dom';
import { FaUserPlus, FaUsers } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import FooterComponent from '../../Header and Footer/FooterComponent';

const InterfacePrincipaleEtudiant = () => {
  const history = useHistory();

  function addEtudiant() {
    history.replace('/ajouter-etudiant');
  }

  function consulterEtudiant() {
    history.replace('/consulter-etudiant');
  }

  const navigations = [
    {
      icon: <FaUserPlus />,
      label: 'Ajouter Étudiant',
      onClick: addEtudiant,
    },
    {
      icon: <FaUsers />,
      label: 'Consulter Étudiant',
      onClick: consulterEtudiant,
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#e7f1ff',
        animation: 'fadeIn 1s ease-in',
      }}
    >
      <HeaderAdmin />
      <div className="container py-5">
        <h4
          className="text-center mb-5"
          style={{ fontWeight: '600', color: '#343a40', fontSize: '1.8rem' }}
        >
          Gestion des Étudiants - ENSA Béni Mellal
        </h4>
        <div className="row justify-content-center">
          {navigations.map((nav, index) => (
            <div
              key={nav.label}
              className="col-6 col-md-4 col-lg-3 mb-4"
              style={{
                animation: `slideIn 0.5s ease-in`,
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both',
              }}
            >
              <ButtonWithoutImage
                icon={nav.icon}
                title={nav.label}
                borderColor="#4dabf7"
                hoverColor="#1a91ff"
                onClick={nav.onClick}
              />
            </div>
          ))}
        </div>
      </div>

      <FooterComponent />
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
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

const ButtonWithoutImage = ({ icon, title, borderColor, hoverColor, onClick }) => {
  return (
    <button
      className="text-center d-flex flex-column align-items-center justify-content-center"
      style={{
        width: '140px',
        height: '100px',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease',
        cursor: 'pointer',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: `2px solid ${borderColor}`,
        margin: '0 auto',
        animation: 'pulse 2s infinite',
        backdropFilter: 'blur(5px)',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
        e.currentTarget.style.borderColor = hoverColor;
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
        e.currentTarget.style.animation = 'none';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.borderColor = borderColor;
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        e.currentTarget.style.animation = 'pulse 2s infinite';
      }}
      aria-label={title}
    >
      <div style={{ fontSize: '1.8rem', color: '#343a40', marginBottom: '0.5rem' }}>
        {icon}
      </div>
      <span style={{ fontWeight: '500', color: '#343a40', fontSize: '0.85rem', lineHeight: '1.2' }}>
        {title}
      </span>
    </button>
  );
};

export default InterfacePrincipaleEtudiant;