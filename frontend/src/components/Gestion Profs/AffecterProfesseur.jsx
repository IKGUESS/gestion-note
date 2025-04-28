import React, { useState, useEffect } from 'react';
import niveauEtude from '../../services/NiveauEtude';
import professeurModuleService from '../../services/ProfesseurModuleService';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import professeurService from './ProfesseurService';
import sectionFilierService from '../Gestion Sections Filieres/SectionFilierService';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import 'bootstrap/dist/css/bootstrap.min.css';

function AffecterProfesseur(props) {
  const history = useHistory();
  const [cin, setCIN] = useState('');
  const [statut, setStatut] = useState('');
  const [codeMod, setCodeMod] = useState('');
  const identProf = props.match.params.cinProfMod;
  const codeModURL = props.match.params.ProfCodeMod;

  const [niveaux, setNiveaux] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [niveauxScolaires, setNiveauxScolaires] = useState([]);
  const [modules, setModules] = useState([]);
  const [SectionsOptions, setSectionsOptions] = useState([]);

  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    setFormIsValid(cin !== '' && statut !== '' && codeMod !== '');
  }, [cin, statut, codeMod]);

  useEffect(() => {
    if (identProf === '_aff' && codeModURL === '_aff') {
      return;
    } else {
      professeurModuleService.getProfsModulesByCIN(identProf, codeModURL).then((reponse) => {
        let detailsProfModule = reponse.data;
        setCIN(detailsProfModule.professeur.cin);
        setStatut(detailsProfModule.statut);
      });
    }
  }, [identProf, codeModURL]);

  useEffect(() => {
    niveauEtude.getNiveaux().then((reponse) => {
      setNiveaux(reponse.data);
    });
  }, []);

  const handleNiveauChange = (e) => {
    const selectedNiveauCode = e.target.value;
    niveauEtude.getFilieresByCodeNiveau(selectedNiveauCode).then((reponse) => {
      setFilieres(reponse.data);
      setNiveauxScolaires([]);
      setModules([]);
    });
  };

  const handleFiliereChange = (e) => {
    const selectedFiliereCode = e.target.value;
    niveauEtude.getNiveauxScolairesByCodeFiliere(selectedFiliereCode).then((reponse) => {
      setNiveauxScolaires(reponse.data);
    });
    sectionFilierService.getAllSectionsByCodeFiliere(selectedFiliereCode).then((reponse) => {
      setSectionsOptions(reponse.data);
    });
  };

  const handleNiveauScolaireChange = (e) => {
    const selectedNiveauScolaireCode = e.target.value;
    niveauEtude.getModulesByCodeNivSco(selectedNiveauScolaireCode).then((reponse) => {
      setModules(reponse.data);
      setCodeMod('');
    });
  };

  const changeCINHandler = (event) => setCIN(event.target.value);
  const changeStatutHandler = (event) => setStatut(event.target.value);

  const saveDetailsProfModule = (evt) => {
    evt.preventDefault();
    if (identProf === '_aff' && codeModURL === '_aff') {
      if (formIsValid) {
        let detailProfMod = {
          statut,
          professeur: { cin: cin },
          module: { codeMod: codeMod },
          section: document.getElementById('SelectorSection').value,
        };
        professeurService.getProfesseurById(cin).then((res) => {
          let cinExists = res.data;
          if (cinExists.cin === cin) {
            professeurModuleService.ajouterProfModule(detailProfMod).then(() => {
              toast.success('Details Professeur Module ajouté avec succès.', {
                position: toast.POSITION.TOP_CENTER,
              });
              history.replace('/interface-affecter-prof');
            });
          } else {
            toast.error(`La CIN ${cin} n'existe pas dans la base de données.`, {
              position: toast.POSITION.TOP_CENTER,
            });
          }
        });
      } else {
        toast.error('Veuillez remplir tous les champs.', {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } else {
      let detailProfMod = { statut };
      professeurModuleService.updateProfModule(identProf, codeModURL, detailProfMod).then(() => {
        toast.success('Details Professeur Module mis à jour avec succès.', {
          position: toast.POSITION.TOP_CENTER,
        });
        history.replace('/interface-affecter-prof');
      });
    }
  };

  const fonctionAnnuler = () => {
    history.replace('/interface-affecter-prof');
  };

  const getTitle = () => {
    if (identProf === '_aff' && codeModURL === '_aff') {
      return (
        <h3
          className="text-center mb-4"
          style={{
            fontWeight: '600',
            background: 'linear-gradient(90deg, #4dabf7, #1a91ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Affecter Professeur
        </h3>
      );
    } else {
      return (
        <h3
          className="text-center mb-4"
          style={{
            fontWeight: '600',
            background: 'linear-gradient(90deg, #4dabf7, #1a91ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Modifier L'Affectation
        </h3>
      );
    }
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
        <div className="row justify-content-center">
          <div
            className="col-md-8 col-lg-7"
            style={{
              animation: 'slideIn 0.5s ease-in',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '15px',
              padding: '2rem',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              border: '2px solid #4dabf7',
            }}
          >
            {getTitle()}
            <form onSubmit={saveDetailsProfModule}>
              {[
                {
                  label: 'CIN',
                  value: cin,
                  onChange: changeCINHandler,
                  type: 'text',
                  placeholder: 'Entrez CIN',
                  required: true,
                  readOnly: identProf !== '_aff',
                },
                {
                  label: 'Niveau',
                  type: 'select',
                  onChange: handleNiveauChange,
                  options: [
                    { value: '', label: 'Sélectionner un niveau' },
                    ...niveaux.map((niveau) => ({
                      value: niveau.codeNiv,
                      label: niveau.designation,
                    })),
                  ],
                  readOnly: identProf !== '_aff',
                  required: true,
                },
                {
                  label: 'Filière',
                  type: 'select',
                  onChange: handleFiliereChange,
                  options: [
                    { value: '', label: 'Sélectionner une filière' },
                    ...filieres.map((filiere) => ({
                      value: filiere.codeFil,
                      label: filiere.designation,
                    })),
                  ],
                  readOnly: identProf !== '_aff',
                  required: true,
                },
                {
                  label: 'Niveau Scolaire',
                  type: 'select',
                  onChange: handleNiveauScolaireChange,
                  options: [
                    { value: '', label: 'Sélectionner un niveau scolaire' },
                    ...niveauxScolaires.map((niveauScolaire) => ({
                      value: niveauScolaire.codeNivSco,
                      label: niveauScolaire.designation,
                    })),
                  ],
                  readOnly: identProf !== '_aff',
                  required: true,
                },
                {
                  label: 'Module',
                  type: 'select',
                  value: codeMod,
                  onChange: (e) => setCodeMod(e.target.value),
                  options: [
                    { value: '', label: 'Sélectionner un module' },
                    ...modules.map((module) => ({
                      value: module.codeMod,
                      label: module.nomMod,
                    })),
                  ],
                  readOnly: identProf !== '_aff',
                  required: true,
                },
                {
                  label: 'Section',
                  type: 'select',
                  id: 'SelectorSection',
                  name: 'section',
                  options: [
                    { value: '', label: 'Sélectionner une section' },
                    ...SectionsOptions.map((option) => ({
                      value: option.section.designation,
                      label: option.section.designation,
                    })),
                  ],
                  readOnly: identProf !== '_aff',
                  required: true,
                },
                {
                  label: 'Statut',
                  type: 'select',
                  value: statut,
                  onChange: changeStatutHandler,
                  options: [
                    { value: '', label: 'Sélectionner le statut' },
                    { value: 'En cours', label: 'En cours' },
                    { value: 'Terminé', label: 'Terminé' },
                  ],
                  required: true,
                },
              ].map((field) => (
                <div className="form-group row mb-3" key={field.label}>
                  <label
                    className="col-sm-3 col-form-label"
                    style={{
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      transition: 'color 0.3s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {field.label} :
                  </label>
                  <div className="col-sm-9">
                    {field.type === 'select' ? (
                      <select
                        id={field.id}
                        name={field.name}
                        className={`form-control ${field.value === '' && !formIsValid ? 'is-invalid' : ''}`}
                        value={field.value}
                        onChange={field.onChange}
                        required={field.required}
                        readOnly={field.readOnly}
                        disabled={field.readOnly}
                        aria-label={`Sélectionner ${field.label.toLowerCase()}`}
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #4dabf7',
                          padding: '0.5rem',
                          fontSize: '0.9rem',
                          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                        onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                      >
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        className={`form-control ${field.value === '' && !formIsValid ? 'is-invalid' : ''}`}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={field.onChange}
                        required={field.required}
                        readOnly={field.readOnly}
                        disabled={field.readOnly}
                        aria-label={field.label}
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #4dabf7',
                          padding: '0.5rem',
                          fontSize: '0.9rem',
                          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                        onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                      />
                    )}
                    {field.value === '' && !formIsValid && (
                      <div className="invalid-feedback">Ce champ est requis.</div>
                    )}
                  </div>
                </div>
              ))}
              <div className="form-group row mt-4">
                <div className="col-sm-12 text-center">
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      width: '120px',
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
                    aria-label="Enregistrer l'affectation"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
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
                      marginLeft: '1rem',
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
                    aria-label="Annuler"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </form>
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
        `}
      </style>
    </div>
  );
}

export default AffecterProfesseur;