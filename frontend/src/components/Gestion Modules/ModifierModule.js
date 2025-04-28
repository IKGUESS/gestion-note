import React, { useState, useEffect } from 'react';
import moduleService from './ModuleService';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import 'bootstrap/dist/css/bootstrap.min.css';

function ModifierModule(props) {
  const history = useHistory();

  const [codeNivSco, setCodeNivSco] = useState('');
  const [codeNiv, setCodeNiv] = useState('');
  const [codeFil, setCodeFil] = useState('');
  const [nomMod, setNomMod] = useState('');
  const [codeMod, setCodeMod] = useState('');
  const [nbTps, setNbTps] = useState('');
  const [nbControles, setNbControles] = useState('');
  const [nbExams, setNbExams] = useState('');
  const [coeffTps, setCoeffTps] = useState('');
  const [coeffControles, setCoeffControles] = useState('');
  const [coeffExams, setCoeffExams] = useState('');

  const [niveau, setNiveau] = useState([]);
  const [filiere, setFiliere] = useState([]);
  const [niveauScolaire, setNiveauScolaire] = useState([]);

  // Fetch module data
  useEffect(() => {
    moduleService.getModuleById(props.match.params.codeMod).then((res) => {
      let module = res.data;
      setCodeMod(module.codeMod);
      setNomMod(module.nomMod);
      setNbTps(module.nbTps);
      setNbControles(module.nbControles);
      setNbExams(module.nbExams);
      setCoeffTps(module.coeffTps);
      setCoeffControles(module.coeffControles);
      setCoeffExams(module.coeffExams);
      setNiveauScolaire(module.niveauScolaire);
      setFiliere(module.niveauScolaire.filiere);
      setNiveau(module.niveauScolaire.filiere.niveau);
    });
  }, [props.match.params.codeMod]);

  // Form validation
  const validateForm = () => {
    return (
      codeMod !== '' &&
      nomMod !== '' &&
      document.getElementById('Selector').value !== '' &&
      document.getElementById('Selectorfil').value !== '' &&
      document.getElementById('Selectore').value !== '' &&
      nbTps !== '' &&
      nbControles !== '' &&
      nbExams !== '' &&
      coeffTps !== '' &&
      coeffControles !== '' &&
      coeffExams !== ''
    );
  };

  // Handle form submission
  const ModifierModule = (e) => {
    e.preventDefault();
    if (validateForm()) {
      let module = {
        codeMod,
        nomMod,
        nbTps,
        nbControles,
        nbExams,
        coeffTps,
        coeffControles,
        coeffExams,
        niveauScolaire: {
          codeNivSco,
          filiere: { codeFil, niveau: { codeNiv } },
        },
      };
      moduleService.updateModule(module, props.match.params.codeMod).then((res) => {
        window.alert('Module modifié avec succès.');
        history.replace('/interface-module');
      });
    } else {
      toast.error('Veuillez remplir tous les champs.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  // Input change handlers
  function changeNomModHandler(event) {
    setNomMod(event.target.value);
  }
  function changeNbTpsHandler(event) {
    setNbTps(event.target.value);
  }
  function changeNbCntrlsHandler(event) {
    setNbControles(event.target.value);
  }
  function changeNbExamsHandler(event) {
    setNbExams(event.target.value);
  }
  function changeCoeffTpsHandler(event) {
    setCoeffTps(event.target.value);
  }
  function changeCoeffCntrlsHandler(event) {
    setCoeffControles(event.target.value);
  }
  function changeCoeffExamsHandler(event) {
    setCoeffExams(event.target.value);
  }

  // Handle cancel action
  const fonctionAnnuler = () => {
    setCodeNiv('');
    history.replace('/interface-module');
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
          className="row"
          style={{
            animation: 'slideIn 0.5s ease-in',
          }}
        >
          <div
            className="card col-md-7 offset-md-2 offset-md-3 col-lg-6"
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
              Modifier Module
            </h3>
            <div className="card-body">
              <form>
                <div className="form-group row mb-3">
                  <label
                    className="col-sm-3 col-form-label"
                    style={{
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Niveau :
                  </label>
                  <div className="col-sm-9">
                    <select
                      className="form-control"
                      id="Selector"
                      placeholder="Niveau"
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
                      <option disabled>-- Sélectionnez un niveau --</option>
                      <option value={niveau.codeNiv}>{niveau.designation}</option>
                    </select>
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label
                    className="col-sm-3 col-form-label"
                    style={{
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Filière :
                  </label>
                  <div className="col-sm-9">
                    <select
                      className="form-control"
                      id="Selectorfil"
                      placeholder="Filier"
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
                      <option disabled>-- Sélectionnez une Filière --</option>
                      <option value={filiere.codeFil}>{filiere.designation}</option>
                    </select>
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label
                    className="col-sm-3 col-form-label"
                    style={{
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Niveau Scolaire :
                  </label>
                  <div className="col-sm-9">
                    <select
                      className="form-control"
                      id="Selectore"
                      placeholder="NiveauScolaire"
                      name="NiveauScolaire"
                      value={codeNivSco}
                      onChange={(e) => setCodeNivSco(e.target.value)}
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #4dabf7',
                        padding: '0.5rem',
                        fontSize: '0.9rem',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                      onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                      aria-label="Sélectionner un niveau scolaire"
                    >
                      <option disabled>-- Sélectionnez un niveau scolaire --</option>
                      <option value={niveauScolaire.codeNivSco}>{niveauScolaire.designation}</option>
                    </select>
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label
                    className="col-sm-3 col-form-label"
                    style={{
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Code Module :
                  </label>
                  <div className="col-sm-9">
                    <input
                      placeholder="Code Module"
                      className="form-control"
                      value={codeMod}
                      readOnly
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #4dabf7',
                        padding: '0.5rem',
                        fontSize: '0.9rem',
                        backgroundColor: 'rgba(241, 243, 245, 0.8)',
                        color: '#6c757d',
                        cursor: 'not-allowed',
                      }}
                      aria-label="Code du module"
                    />
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label
                    className="col-sm-3 col-form-label"
                    style={{
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Nom Module :
                  </label>
                  <div className="col-sm-9">
                    <input
                      placeholder="Nom Module"
                      className="form-control"
                      value={nomMod}
                      onChange={changeNomModHandler}
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
                      aria-label="Nom du module"
                    />
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label
                    className="col-sm-3 col-form-label"
                    style={{
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Nb Tps :
                  </label>
                  <div className="col-sm-9">
                    <input
                      placeholder="Nombre Tps"
                      className="form-control"
                      value={nbTps}
                      onChange={changeNbTpsHandler}
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
                      aria-label="Nombre de travaux pratiques"
                    />
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label
                    className="col-sm-3 col-form-label"
                    style={{
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Nb Cntrls :
                  </label>
                  <div className="col-sm-9">
                    <input
                      placeholder="Nombre Control"
                      className="form-control"
                      value={nbControles}
                      onChange={changeNbCntrlsHandler}
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
                      aria-label="Nombre de contrôles"
                    />
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label
                    className="col-sm-3 col-form-label"
                    style={{
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Nb Exams :
                  </label>
                  <div className="col-sm-9">
                    <input
                      placeholder="Nombre Exams"
                      className="form-control"
                      value={nbExams}
                      onChange={changeNbExamsHandler}
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
                      aria-label="Nombre d'examens"
                    />
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label
                    className="col-sm-3 col-form-label"
                    style={{
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Coeff Tps :
                  </label>
                  <div className="col-sm-9">
                    <input
                      placeholder="Coeff Tps"
                      className="form-control"
                      value={coeffTps}
                      onChange={changeCoeffTpsHandler}
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
                      aria-label="Coefficient des travaux pratiques"
                    />
                  </div>
                </div>
                <div className="form-group row mb-3">
                  <label
                    className="col-sm-3 col-form-label"
                    style={{
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Coeff Cntrls :
                  </label>
                  <div className="col-sm-9">
                    <input
                      placeholder="Coeff Controles"
                      className="form-control"
                      value={coeffControles}
                      onChange={changeCoeffCntrlsHandler}
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
                      aria-label="Coefficient des contrôles"
                    />
                  </div>
                </div>
                <div className="form-group row mb-4">
                  <label
                    className="col-sm-3 col-form-label"
                    style={{
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    Coeff Exams :
                  </label>
                  <div className="col-sm-9">
                    <input
                      placeholder="CoeffExams"
                      className="form-control"
                      value={coeffExams}
                      onChange={changeCoeffExamsHandler}
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
                      aria-label="Coefficient des examens"
                    />
                  </div>
                </div>
                <br />
                <div className="form-group row">
                  <div className="col-sm-5 offset-sm-8 d-flex justify-content-end">
                    <button
                      className="btn"
                      onClick={ModifierModule}
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
                      onClick={() => fonctionAnnuler()}
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

export default ModifierModule;