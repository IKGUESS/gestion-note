import React, { useState, useEffect } from 'react';
import moduleService from './ModuleService';
import filierService from '../../components/Gestion Filieres/FilierService';
import niveauScolaireService from '../Gestion Niveaux Scolaires/NiveauScolaireService';
import { toast } from 'react-toastify';
import HeaderResponsable from '../../Header and Footer/HeaderResponsable';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function ModifierModuleRespo(props) {
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
  const [niveauOptions, setNiveauOptions] = useState([]);
  const [filierOptions, setFilierOptions] = useState([]);
  const [niveauScolaireOptions, setNiveauScolaireOptions] = useState([]);
  const [formIsValid, setFormIsValid] = useState(false);
  const [enableFiliere, setEnableFiliere] = useState(true);
  const [enableNiveauScolaire, setEnableNiveauScolaire] = useState(true);

  const cinRespo = localStorage.getItem('cinResponsable');

  // Charger les niveaux
  useEffect(() => {
    filierService.getAllFiliereByCinRespo(cinRespo).then((reponse) => {
      const filieresRespo = reponse.data;
      const niveauxRespo = filieresRespo.map((filiere) => filiere.niveau);
      setNiveauOptions(niveauxRespo);
    }).catch((err) => {
      console.error('Error fetching niveaux:', err);
      toast.error('Erreur lors du chargement des niveaux.', {
        position: toast.POSITION.TOP_CENTER,
      });
    });
  }, [cinRespo]);

  // Charger les filières en fonction du niveau sélectionné
  useEffect(() => {
    if (codeNiv) {
      filierService.getFilierNiveau(codeNiv).then((reponse) => {
        setFilierOptions(reponse.data);
        setEnableFiliere(false);
      }).catch((err) => {
        console.error('Error fetching filières:', err);
        toast.error('Erreur lors du chargement des filières.', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    } else {
      setEnableFiliere(true);
      setFilierOptions([]);
      setCodeFil('');
      setNiveauScolaireOptions([]);
      setCodeNivSco('');
      setEnableNiveauScolaire(true);
    }
  }, [codeNiv]);

  // Charger les niveaux scolaires en fonction de la filière sélectionnée
  useEffect(() => {
    if (codeFil) {
      niveauScolaireService.getNiveauScolaireByCodeFiliere(codeFil).then((reponse) => {
        setNiveauScolaireOptions(reponse.data);
        setEnableNiveauScolaire(false);
      }).catch((err) => {
        console.error('Error fetching niveaux scolaires:', err);
        toast.error('Erreur lors du chargement des niveaux scolaires.', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    } else {
      setEnableNiveauScolaire(true);
      setNiveauScolaireOptions([]);
      setCodeNivSco('');
    }
  }, [codeFil]);

  // Charger les données du module à modifier
  useEffect(() => {
    moduleService.getModuleById(props.match.params.codeMod).then((res) => {
      const module = res.data;
      setCodeMod(module.codeMod);
      setNomMod(module.nomMod);
      setNbTps(module.nbTps);
      setNbControles(module.nbControles);
      setNbExams(module.nbExams);
      setCoeffTps(module.coeffTps);
      setCoeffControles(module.coeffControles);
      setCoeffExams(module.coeffExams);
      setCodeNivSco(module.niveauScolaire?.codeNivSco || '');
      setCodeFil(module.niveauScolaire.filiere?.codeFil || '');
      setCodeNiv(module.niveauScolaire.filiere.niveau?.codeNiv || '');
    }).catch((err) => {
      console.error('Error fetching module:', err);
      toast.error('Erreur lors du chargement du module.', {
        position: toast.POSITION.TOP_CENTER,
      });
    });
  }, [props.match.params.codeMod]);

  // Validation du formulaire
  useEffect(() => {
    setFormIsValid(
      codeMod !== '' &&
      nomMod !== '' &&
      codeNiv !== '' &&
      codeFil !== '' &&
      codeNivSco !== '' &&
      nbTps !== '' &&
      nbControles !== '' &&
      nbExams !== '' &&
      coeffTps !== '' &&
      coeffControles !== '' &&
      coeffExams !== ''
    );
  }, [codeMod, nomMod, codeNiv, codeFil, codeNivSco, nbTps, nbControles, nbExams, coeffTps, coeffControles, coeffExams]);

  // Modifier le module
  const ModifierModule = (e) => {
    e.preventDefault();
    if (formIsValid) {
      const moduleData = {
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
      moduleService.updateModule(moduleData, props.match.params.codeMod)
        .then(() => {
          toast.success('Module modifié avec succès !', {
            position: toast.POSITION.TOP_CENTER,
          });
          history.replace('/interface-module-respo');
        })
        .catch((err) => {
          console.error('Error updating module:', err);
          toast.error('Erreur lors de la modification du module.', {
            position: toast.POSITION.TOP_CENTER,
          });
        });
    } else {
      toast.error('Veuillez remplir tous les champs.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  // Handlers
  const changeNomModHandler = (e) => setNomMod(e.target.value);
  const changeNbTpsHandler = (e) => setNbTps(e.target.value);
  const changeNbControlesHandler = (e) => setNbControles(e.target.value);
  const changeNbExamsHandler = (e) => setNbExams(e.target.value);
  const changeCoeffTpsHandler = (e) => setCoeffTps(e.target.value);
  const changeCoeffControlesHandler = (e) => setCoeffControles(e.target.value);
  const changeCoeffExamsHandler = (e) => setCoeffExams(e.target.value);
  const changeCodeNivHandler = (e) => {
    setCodeNiv(e.target.value);
    setCodeFil('');
    setCodeNivSco('');
  };
  const changeCodeFilHandler = (e) => {
    setCodeFil(e.target.value);
    setCodeNivSco('');
  };
  const changeCodeNivScoHandler = (e) => setCodeNivSco(e.target.value);

  const fonctionAnnuler = () => {
    history.replace('/interface-module-respo');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#e7f1ff',
        animation: 'fadeIn 1s ease-in',
      }}
    >
      <HeaderResponsable />
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
          Modifier un Module
        </h3>
        <div
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
          <h4
            className="text-center mb-4"
            style={{
              fontWeight: '500',
              color: '#343a40',
            }}
          >
            Formulaire de Modification
          </h4>
          <form onSubmit={ModifierModule}>
            {[
              {
                label: 'Niveau',
                value: codeNiv,
                onChange: changeCodeNivHandler,
                type: 'select',
                options: [
                  { value: '', label: 'Sélectionner un niveau' },
                  ...niveauOptions.map((niv) => ({
                    value: niv.codeNiv,
                    label: niv.designation,
                  })),
                ],
                required: true,
              },
              {
                label: 'Filière',
                value: codeFil,
                onChange: changeCodeFilHandler,
                type: 'select',
                options: [
                  { value: '', label: 'Sélectionner une filière' },
                  ...filierOptions
                    .filter((fil) => fil.responsable.cin === cinRespo)
                    .map((fil) => ({
                      value: fil.codeFil,
                      label: fil.designation,
                    })),
                ],
                required: true,
                disabled: enableFiliere,
              },
              {
                label: 'Niveau Scolaire',
                value: codeNivSco,
                onChange: changeCodeNivScoHandler,
                type: 'select',
                options: [
                  { value: '', label: 'Sélectionner un niveau scolaire' },
                  ...niveauScolaireOptions.map((nivSco) => ({
                    value: nivSco.codeNivSco,
                    label: nivSco.designation,
                  })),
                ],
                required: true,
                disabled: enableNiveauScolaire,
              },
              {
                label: 'Code Module',
                value: codeMod,
                type: 'text',
                placeholder: 'Code Module',
                readOnly: true,
                required: true,
              },
              {
                label: 'Nom Module',
                value: nomMod,
                onChange: changeNomModHandler,
                type: 'text',
                placeholder: 'Nom Module',
                required: true,
              },
              {
                label: 'Nb TPs',
                value: nbTps,
                onChange: changeNbTpsHandler,
                type: 'number',
                placeholder: 'Nombre de TPs',
                required: true,
              },
              {
                label: 'Nb Contrôles',
                value: nbControles,
                onChange: changeNbControlesHandler,
                type: 'number',
                placeholder: 'Nombre de Contrôles',
                required: true,
              },
              {
                label: 'Nb Examens',
                value: nbExams,
                onChange: changeNbExamsHandler,
                type: 'number',
                placeholder: 'Nombre d\'Examens',
                required: true,
              },
              {
                label: 'Coefficient TPs',
                value: coeffTps,
                onChange: changeCoeffTpsHandler,
                type: 'number',
                placeholder: 'Coefficient des TPs',
                required: true,
              },
              {
                label: 'Coefficient Contrôles',
                value: coeffControles,
                onChange: changeCoeffControlesHandler,
                type: 'number',
                placeholder: 'Coefficient des Contrôles',
                required: true,
              },
              {
                label: 'Coefficient Examens',
                value: coeffExams,
                onChange: changeCoeffExamsHandler,
                type: 'number',
                placeholder: 'Coefficient des Examens',
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
                  }}
                >
                  {field.label} :
                </label>
                <div className="col-sm-9">
                  {field.type === 'select' ? (
                    <select
                      className={`form-control ${field.value === '' && !formIsValid ? 'is-invalid' : ''}`}
                      id={
                        field.label === 'Niveau' ? 'Selector' :
                        field.label === 'Filière' ? 'Selectorfil' : 'Selectore'
                      }
                      value={field.value}
                      onChange={field.onChange}
                      required={field.required}
                      disabled={field.disabled}
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
                      readOnly={field.readOnly}
                      required={field.required}
                      aria-label={field.label}
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #4dabf7',
                        padding: '0.5rem',
                        fontSize: '0.9rem',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      onFocus={(e) => !field.readOnly && (e.target.style.borderColor = '#1a91ff')}
                      onBlur={(e) => !field.readOnly && (e.target.style.borderColor = '#4dabf7')}
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
                  aria-label="Enregistrer les modifications"
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

export default ModifierModuleRespo;