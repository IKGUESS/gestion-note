import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import niveauService from '../Gestion Niveaux/NiveauService';
import responsableService from './ResponsableService';
import filierService from '../Gestion Filieres/FilierService';
import { toast } from 'react-toastify';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import 'bootstrap/dist/css/bootstrap.min.css';

function ModifierAffectationResponsable(props) {
  const history = useHistory();
  const codeFilParam = props.match.params.codeFil;

  const [codeFil, setCodeFil] = useState('');
  const [designation, setDesignation] = useState('');
  const [codeNiv, setCodeNiv] = useState('');
  const [niveauDesignation, setNiveauDesignation] = useState('');
  const [cin, setCin] = useState('');
  const [responsables, setResponsables] = useState([]);
  const [statut, setStatut] = useState('');
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    niveauService.getNiveau().then((reponse) => {
      // Store niveaux for potential future use
    }).catch((err) => {
      console.error('Error fetching niveaux:', err);
      toast.error('Erreur lors du chargement des niveaux.', {
        position: toast.POSITION.TOP_CENTER,
      });
    });
  }, []);

  useEffect(() => {
    responsableService.getResponsable().then((reponse) => {
      setResponsables(reponse.data);
    }).catch((err) => {
      console.error('Error fetching responsables:', err);
      toast.error('Erreur lors du chargement des responsables.', {
        position: toast.POSITION.TOP_CENTER,
      });
    });
  }, []);

  useEffect(() => {
    filierService.getFilierById(codeFilParam).then((res) => {
      const filier = res.data;
      setCodeFil(filier.codeFil);
      setDesignation(filier.designation);
      setCodeNiv(filier.niveau?.codeNiv || '');
      setNiveauDesignation(filier.niveau?.designation || '');
      setStatut(filier.statut);
      setCin(filier.responsable?.cin || '');
    }).catch((err) => {
      console.error('Error fetching filière:', err);
      toast.error('Erreur lors du chargement de la filière.', {
        position: toast.POSITION.TOP_CENTER,
      });
    });
  }, [codeFilParam]);

  useEffect(() => {
    setFormIsValid(cin !== '');
  }, [cin]);

  const modifierFilier = (e) => {
    e.preventDefault();
    if (formIsValid) {
      const filier = {
        codeFil,
        designation,
        statut,
        responsable: { cin },
        niveau: { codeNiv },
      };
      filierService.updateFilier(filier, codeFilParam).then(() => {
        toast.success('Filière modifiée avec succès.', {
          position: toast.POSITION.TOP_CENTER,
        });
        history.replace('/interface-affectation-respo');
      }).catch((err) => {
        console.error('Error updating filière:', err);
        toast.error('Erreur lors de la modification de la filière.', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    } else {
      toast.error('Veuillez sélectionner un responsable.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const fonctionAnnuler = () => {
    history.replace('/interface-affectation-respo');
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
            <h3
              className="text-center mb-4"
              style={{
                fontWeight: '600',
                background: 'linear-gradient(90deg, #4dabf7, #1a91ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Affecter un Responsable
            </h3>
            <form onSubmit={modifierFilier}>
              {[
                {
                  label: 'Niveau',
                  value: niveauDesignation,
                  type: 'text',
                  placeholder: 'Niveau',
                  readOnly: true,
                  style: { backgroundColor: '#e9ecef', cursor: 'not-allowed' },
                },
                {
                  label: 'Code Niveau',
                  value: codeNiv,
                  type: 'text',
                  placeholder: 'Code Niveau',
                  readOnly: true,
                  style: { backgroundColor: '#e9ecef', cursor: 'not-allowed' },
                },
                {
                  label: 'Filière',
                  value: designation,
                  type: 'text',
                  placeholder: 'Désignation',
                  readOnly: true,
                  style: { backgroundColor: '#e9ecef', cursor: 'not-allowed' },
                },
                {
                  label: 'Code Filière',
                  value: codeFil,
                  type: 'text',
                  placeholder: 'Code Filière',
                  readOnly: true,
                  style: { backgroundColor: '#e9ecef', cursor: 'not-allowed' },
                },
                {
                  label: 'Responsable',
                  value: cin,
                  onChange: (e) => setCin(e.target.value),
                  type: 'select',
                  options: [
                    { value: '', label: 'Sélectionner un responsable' },
                    ...responsables.map((res) => ({
                      value: res.cin,
                      label: `${res.nom} ${res.prenom} (${res.cin})`,
                    })),
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
                    }}
                  >
                    {field.label} :
                  </label>
                  <div className="col-sm-9">
                    {field.type === 'select' ? (
                      <select
                        className={`form-control ${field.value === '' && !formIsValid ? 'is-invalid' : ''}`}
                        value={field.value}
                        onChange={field.onChange}
                        required={field.required}
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
                        className="form-control"
                        placeholder={field.placeholder}
                        value={field.value}
                        readOnly={field.readOnly}
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #4dabf7',
                          padding: '0.5rem',
                          fontSize: '0.9rem',
                          transition: 'border-color 0.3s ease',
                          ...field.style,
                        }}
                        aria-label={field.label}
                      />
                    )}
                    {field.type === 'select' && field.value === '' && !formIsValid && (
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

export default ModifierAffectationResponsable;