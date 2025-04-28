import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import inscreptionService from './InscreptionService';
import imgLogoEPG from '../images/logo.png';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function ImprimerInscriptionTest(props) {
  const [cin, setCin] = useState('');
  const [codeNiv, setCodeNiv] = useState('');
  const [codeFil, setCodeFil] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [nom, setNom] = useState('');

  const history = useHistory();
  const printRef = useRef();

  useEffect(() => {
    inscreptionService.getInscreptionById(props.match.params.cin).then(res => {
      let inscreption = res.data;
      setCin(inscreption.cin);
      setNom(inscreption.nom);
      setPrenom(inscreption.prenom);
      const dateNaissanceObj = new Date(inscreption.dateNaissance);
      const dateNaissanceISO = moment(dateNaissanceObj).format('YYYY-MM-DD');
      setDateNaissance(dateNaissanceISO);
      setCodeNiv(inscreption.filier.niveau.designation);
      setCodeFil(inscreption.filier.designation);
    });
  }, [props.match.params.cin]);

  const getCurrentDate = () => {
    return moment().format('D MMMM YYYY');
  };

  const getCurrentYear = () => {
    const currentYear = moment().format('YYYY');
    const nextYear = parseInt(currentYear, 10) + 1;
    return `${currentYear}/${nextYear}`;
  };

  function Retour() {
    history.replace('/interface-user');
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#e7f1ff',
      animation: 'fadeIn 1s ease-in',
      padding: '2rem 0',
    }}>
      <div ref={printRef}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '15px',
              padding: '2rem',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              border: '2px solid #4dabf7',
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                flexDirection: "column", 
                alignItems: "center",
                marginBottom: '2rem'
              }}>
                <img
                  src={imgLogoEPG}
                  alt="Logo"
                  style={{ 
                    marginBottom: "1rem", 
                    width: "35rem", 
                    height: '11rem',
                    objectFit: 'contain'
                  }}
                />
                <h3 style={{ 
                  marginBottom: 0,
                  fontWeight: '600',
                  background: 'linear-gradient(90deg, #4dabf7, #1a91ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Attestation d'inscription
                </h3>
              </div>

              <div style={{ 
                padding: '0 2rem',
                fontSize: '1.1rem'
              }}>
                {[
                  { label: "Mr (elle) :", value: `${prenom} ${nom}`, bold: true },
                  { label: "Né (e) le :", value: dateNaissance, bold: true },
                  { label: "CIN :", value: cin, bold: true },
                  { label: "Est inscrit(e) au titre de l'année d'étude :", value: getCurrentYear(), bold: true },
                  { label: "Niveau :", value: codeNiv, bold: true },
                  { label: "Filière :", value: codeFil, bold: true },
                ].map((item, index) => (
                  <div key={index} style={{ 
                    display: "flex", 
                    alignItems: "center",
                    marginBottom: '1.5rem',
                    borderBottom: '1px solid #e9ecef',
                    paddingBottom: '0.5rem'
                  }}>
                    <h5 style={{
                      marginRight: "1rem",
                      color: '#495057',
                      fontWeight: '500',
                      minWidth: 'max-content'
                    }}>{item.label}</h5>
                    <span style={{
                      marginLeft: "1rem",
                      fontWeight: item.bold ? '600' : '400',
                      color: '#212529'
                    }}>{item.value}</span>
                  </div>
                ))}

                <div style={{ 
                  display: "flex", 
                  justifyContent: "flex-end",
                  marginTop: '2rem',
                  borderTop: '1px solid #e9ecef',
                  paddingTop: '1rem'
                }}>
                  <h5 style={{ 
                    marginRight: "1rem",
                    color: '#495057',
                    fontWeight: '500'
                  }}>Fés le :</h5>
                  <span style={{
                    fontWeight: '600',
                    color: '#212529'
                  }}>{getCurrentDate()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        display: "flex", 
        justifyContent: "center",
        marginTop: '2rem',
        gap: '2rem'
      }}>
        <Button 
          onClick={() => window.print()}
          style={{
            width: '150px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid #4dabf7',
            color: '#343a40',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            fontWeight: '500',
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
        >
          Imprimer
        </Button>
        <Button
          onClick={Retour}
          style={{
            width: '150px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid #ff6b6b',
            color: '#343a40',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
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
        >
          Retour
        </Button>
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

export default ImprimerInscriptionTest;