import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderEtudiant from '../Header and Footer/HeaderEtudiant';
import FooterComponent from '../Header and Footer/FooterComponent';
import { useHistory } from 'react-router-dom';
import { FaBook, FaFileAlt, FaCalendarTimes } from 'react-icons/fa';

const InterfacePrincipaleEtudiants = () => {
  const history = useHistory();

  const navigations = [
    {
      path: '/consulter-notes-etud',
      icon: <FaBook />,
      label: 'Consulter Notes',
    },
    {
      path: '/releves-notes-etud',
      icon: <FaFileAlt />,
      label: 'Relevés de notes',
    },
    {
      path: '/consulter-absences-etud',
      icon: <FaCalendarTimes />,
      label: 'Consulter Absences',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#e7f1ff' }}>
      <HeaderEtudiant />
      <div className="container py-5">
        <h4
          className="text-center mb-5"
          style={{ fontWeight: '600', color: '#343a40', fontSize: '1.8rem' }}
        >
          Interface Étudiant - ENSA Béni Mellal
        </h4>
        <div className="row justify-content-center">
          {navigations.map((nav, index) => (
            <div
              key={nav.label}
              className="col-12 col-sm-6 col-md-4 mb-4"
              style={{
                animation: `slideIn 0.5s ease-in`,
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both',
              }}
            >
              <ButtonWithIcon
                icon={nav.icon}
                label={nav.label}
                borderColor="#4dabf7"
                hoverColor="#1a91ff"
                onClick={() => history.replace(nav.path)}
              />
            </div>
          ))}
        </div>
      </div>
      <FooterComponent />
      <style>
        {`
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

const ButtonWithIcon = ({ icon, label, borderColor, hoverColor, onClick }) => {
  return (
    <button
      className="text-center d-flex flex-column align-items-center justify-content-center"
      style={{
        width: '140px',
        height: '100px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease',
        cursor: 'pointer',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: `2px solid ${borderColor}`,
        animation: 'pulse 2s infinite',
        backdropFilter: 'blur(5px)',
        margin: '0 auto',
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
      aria-label={label}
    >
      <div style={{ fontSize: '1.8rem', color: '#343a40', marginBottom: '0.5rem' }}>
        {icon}
      </div>
      <span style={{ fontWeight: '500', color: '#343a40', fontSize: '0.85rem', lineHeight: '1.2' }}>
        {label}
      </span>
    </button>
  );
};

export default InterfacePrincipaleEtudiants;