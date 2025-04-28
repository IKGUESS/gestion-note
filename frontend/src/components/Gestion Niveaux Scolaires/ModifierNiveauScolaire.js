import React, { useState, useEffect } from 'react';
import niveauScolaireService from './NiveauScolaireService';
import niveauService from '../Gestion Niveaux/NiveauService';
import filierService from '../Gestion Filieres/FilierService';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import 'bootstrap/dist/css/bootstrap.min.css';

function ModifierNiveauScolaire(props) {
  const [codeFil, setCodeFil] = useState('');
  const [designation, setDesignation] = useState('');
  const [codeNiv, setCodeNiv] = useState('');
  const [codeNivSco, setCodeNivSco] = useState('');
  const [niveauOptions, setNiveauOptions] = useState([]);
  const [filierOptions, setFilierOptions] = useState([]);
  const history = useHistory();

  // Fetch niveau options
  useEffect(() => {
    niveauService.getNiveau().then((reponse) => {
      setNiveauOptions(reponse.data);
    });
  }, []);

  // Fetch filiere options
  useEffect(() => {
    filierService.getFilier().then((reponse) => {
      setFilierOptions(reponse.data);
    });
  }, []);

  // Fetch niveau scolaire data
  useEffect(() => {
    niveauScolaireService.getNiveauScolaireById(props.match.params.codeNivSco).then((res) => {
      const niveauScolaire = res.data;
      setCodeNivSco(niveauScolaire.codeNivSco);
      setDesignation(niveauScolaire.designation);
      setCodeNiv(niveauScolaire.filiere.niveau.codeNiv);
      setCodeFil(niveauScolaire.filiere.codeFil);
    });
  }, [props.match.params.codeNivSco]);

  // Form validation
  const validateForm = () => {
    const isValid = codeNivSco && designation && codeNiv && codeFil;
    if (!isValid) {
      toast.error('Veuillez remplir tous les champs.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    return isValid;
  };

  // Handle form submission
  const ModifierNiveauScolaire = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const niveauScolaire = {
        codeNivSco,
        designation,
        filiere: { codeFil, niveau: { codeNiv } },
      };
      niveauScolaireService.updateNiveauScolaire(niveauScolaire, props.match.params.codeNivSco).then(() => {
        toast.success('Niveau Scolaire modifié avec succès.', {
          position: toast.POSITION.TOP_CENTER,
        });
        history.replace('/interface-niveau-scolaire');
      });
    }
  };

  // Handle designation input change
  const changeDesignationHandler = (event) => {
    setDesignation(event.target.value);
  };

  // Handle cancel action
  const fonctionAnnuler = () => {
    history.replace('/interface-niveau-scolaire');
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
        <div
          className="row justify-content-center"
          style={{
            animation: 'slideIn 0.5s ease-in',
          }}
        >
          <div
            className="card col-md-7 col-lg-6"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '15px',
              padding: '2rem',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              border: '2px solid #4dabf7',
            }}
          >
            <h3
              className="text-center mb-4"
              style={{
                fontWeight: '600',
                background: 'linear-gradient(90deg, #4dabf7, #1a91ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Modifier Niveau Scolaire
            </h3>
            <div className="card-body">
              <form>
                <div className="form-group row mb-3">
                  <label
                    className="col-sm-4 col-form-label"
                    style={{
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Niveau :
                  </label>
                  <div className="col-sm-8">
                    <select
                      className="form-control"
                      id="Selector"
                      name="niveau"
                      value={codeNiv}
                      onChange={(e) => setCodeNiv(e.target.value)}
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #4dabf7',
                        padding: '0.5rem',
                        fontSize: '0.9rem',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                      onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                      aria-label="Sélectionner un niveau"
                    >
                      <option value="" disabled>
                        -- Sélectionnez un niveau --
                      </option>
                      {niveauOptions.map((niv) => (
                        <option key={niv.codeNiv} value={niv.codeNiv}>
                          {niv.designation}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label
                    className="col-sm-4 col-form-label"
                    style={{
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Filière :
                  </label>
                  <div className="col-sm-8">
                    <select
                      className="form-control"
                      id="Selectorfil"
                      name="filier"
                      value={codeFil}
                      onChange={(e) => setCodeFil(e.target.value)}
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #4dabf7',
                        padding: '0.5rem',
                        fontSize: '0.9rem',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                      onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                      aria-label="Sélectionner une filière"
                    >
                      <option value="" disabled>
                        -- Sélectionnez une filière --
                      </option>
                      {filierOptions.map((fil) => (
                        <option key={fil.codeFil} value={fil.codeFil}>
                          {fil.designation}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label
                    className="col-sm-4 col-form-label"
                    style={{
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      transition: 'color 0.3s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Code Niv Scolaire :
                  </label>
                  <div className="col-sm-8">
                    <input
                      placeholder="Code du Niv Scolaire"
                      className="form-control"
                      value={codeNivSco}
                      readOnly
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #4dabf7',
                        padding: '0.5rem',
                        fontSize: '0.9rem',
                        backgroundColor: '#f1f3f5',
                        color: '#6c757d',
                        cursor: 'not-allowed',
                      }}
                      aria-label="Code du niveau scolaire"
                    />
                  </div>
                </div>
                <div className="form-group row mb-4">
                  <label
                    className="col-sm-4 col-form-label"
                    style={{
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Designation :
                  </label>
                  <div className="col-sm-8">
                    <input
                      placeholder="Designation"
                      className="form-control"
                      value={designation}
                      onChange={changeDesignationHandler}
                      required
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #4dabf7',
                        padding: '0.5rem',
                        fontSize: '0.9rem',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                      onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                      aria-label="Designation du niveau scolaire"
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-sm-12 d-flex justify-content-end">
                    <button
                      className="btn"
                      onClick={ModifierNiveauScolaire}
                      style={{
                        width: '120px',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '2px solid #4dabf7',
                        color: '#343a40',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        fontWeight: '500',
                        marginRight: '1rem',
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
                      aria-label="Enregistrer les modifications"
                    >
                      Enregistrer
                    </button>
                    <button
                      className="btn"
                      onClick={fonctionAnnuler}
                      style={{
                        width: '120px',
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
                      aria-label="Annuler les modifications"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
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
          .form-control.is-invalid {
            border-color: #e63946;
            background-image: none;
          }
          .form-control.is-valid {
            border-color: #1a91ff;
            background-image: none;
          }
        `}
      </style>
    </div>
  );
}

export default ModifierNiveauScolaire;