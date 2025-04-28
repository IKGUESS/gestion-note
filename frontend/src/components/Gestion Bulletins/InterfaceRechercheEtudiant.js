import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import etudiantService from '../Gestion Etudiants/EtudiantService';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function InterfaceRechercheEtudiant() {
  const history = useHistory();
  const [CINRecherche, setCINRecherche] = useState('');
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    setFormIsValid(CINRecherche !== '');
  }, [CINRecherche]);

  const rechercherEtudiantParCIN = () => {
    if (formIsValid) {
      etudiantService.getEtudiantById(CINRecherche).then(res => {
        const cinExists = res.data;
        if (cinExists.cin === CINRecherche) {
          history.push(`/gestion-bulletins-test/${CINRecherche}`);
        } else {
          toast.error(`Cet Etudiant avec CIN ${CINRecherche} n'existe pas dans la base de données.`, {
            position: toast.POSITION.TOP_CENTER
          });
        }
      });
    } else {
      toast.error('Veuillez remplir tous les champs.', {
        position: toast.POSITION.TOP_CENTER
      });
    }
  };

  const reinitialiserPage = () => {
    setCINRecherche('');
  };

  const Retour = () => {
    history.push('/interface-admin');
  };

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
        <h3
          className="text-center mb-4"
          style={{
            fontWeight: '600',
            background: 'linear-gradient(90deg, #4dabf7, #1a91ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Recherche d'Étudiant
        </h3>
        <div
          className="mb-4"
          style={{
            animation: 'slideIn 0.5s ease-in',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            padding: '1.5rem',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            border: '2px solid #4dabf7',
          }}
        >
          <div className="form-group d-flex align-items-center">
            <label
              htmlFor="search"
              style={{
                fontWeight: '500',
                color: '#343a40',
                marginRight: '1rem',
                fontSize: '0.9rem',
              }}
            >
              CIN :
            </label>
            <input
              type="text"
              className="form-control"
              id="search"
              placeholder="Entrez le CIN de l'étudiant"
              value={CINRecherche}
              onChange={(e) => setCINRecherche(e.target.value)}
              style={{
                width: '60%',
                borderRadius: '8px',
                border: '2px solid #4dabf7',
                padding: '0.5rem',
                fontSize: '0.9rem',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
              onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
              aria-label="Rechercher par CIN"
            />
            <button
              className="btn"
              onClick={rechercherEtudiantParCIN}
              disabled={!formIsValid}
              style={{
                backgroundColor: formIsValid ? 'rgba(255, 255, 255, 0.9)' : '#e9ecef',
                border: `2px solid ${formIsValid ? '#4dabf7' : '#adb5bd'}`,
                color: formIsValid ? '#343a40' : '#6c757d',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                marginLeft: '1rem',
                fontWeight: '500',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                animation: formIsValid ? 'pulse 2s infinite' : 'none',
                backdropFilter: 'blur(5px)',
                cursor: formIsValid ? 'pointer' : 'not-allowed',
              }}
              onMouseEnter={(e) => {
                if (formIsValid) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.borderColor = '#1a91ff';
                }
              }}
              onMouseLeave={(e) => {
                if (formIsValid) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#4dabf7';
                }
              }}
              aria-label="Rechercher l'étudiant"
            >
              Rechercher
            </button>
            <button
              className="btn"
              onClick={reinitialiserPage}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid #ff6b6b',
                color: '#343a40',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                marginLeft: '1rem',
                fontWeight: '500',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                animation: 'pulse 2s infinite',
                backdropFilter: 'blur(5px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.borderColor = '#e63946';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#ff6b6b';
              }}
              aria-label="Réinitialiser la recherche"
            >
              Réinitialiser
            </button>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button
            className="btn"
            onClick={Retour}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid #4dabf7',
              color: '#343a40',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontWeight: '500',
              width: '120px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
              animation: 'pulse 2s infinite',
              backdropFilter: 'blur(5px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
              e.currentTarget.style.borderColor = '#1a91ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#4dabf7';
            }}
            aria-label="Retour à l'interface admin"
          >
            Retour
          </button>
        </div>
      </div>
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
}

export default InterfaceRechercheEtudiant;