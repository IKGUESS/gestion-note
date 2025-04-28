import React, { useState, useEffect } from 'react'
import inscreptionService from './InscreptionService'
import niveauService from '../Gestion Niveaux/NiveauService';
import filierService from '../Gestion Filieres/FilierService';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

function InterfaceInscreption() {
  const [cin, setCin] = useState('');
  const [codeNiv, setCodeNiv] = useState('');
  const [codeFil, setCodeFil] = useState('');
  const [prenom, setPrenom] = useState('');
  const [filierOptions, setFilierOptions] = useState([]);
  const [niveauOptions, setNiveauOptions] = useState([]);
  const [dateNaissance, setDateNaissance] = useState('');
  const [nom, setNom] = useState('');
  const [enable, setEnable] = useState(true);

  useEffect(() => {
    niveauService.getNiveau().then((reponse) => {
      setNiveauOptions(reponse.data);
    });
  }, []);
  
  useEffect(() => {   
    filierService.getFilierNiveau(codeNiv).then((reponse) => {
      setFilierOptions(reponse.data);
    });  
  }, [codeNiv]);

  const [formIsValid, setFormIsValid] = useState(false);
  useEffect(() => {
    setFormIsValid(
      cin !== '' && nom !== '' && prenom !== '' && dateNaissance !== '' &&
      codeFil !== '' && codeNiv !== ''
    );
  }, [cin, nom, prenom, dateNaissance, codeFil, codeNiv]);

  const saveInscreption = (e) => {
    e.preventDefault();
    if (formIsValid) {  
      let inscreption = { cin, nom, prenom, dateNaissance, filier: {codeFil: codeFil, niveau: {codeNiv: codeNiv}} };
      inscreptionService.createInscreption(inscreption).then(res => {
        toast.success('Inscription ajoutée avec succès.', {
          position: toast.POSITION.TOP_CENTER
        });
        history.replace(`/imprimer-inscription-test/${cin}`);
      });
    } else {
      toast.error('Veuillez remplir tous les champs.', {
        position: toast.POSITION.TOP_CENTER 
      });
    }
  } 

  function changeCinHandler(event) {
    setCin(event.target.value);
  }
  
  function changeNomHandler(event) {
    setNom(event.target.value);
  }
  
  function changePrenomHandler(event) {
    setPrenom(event.target.value);
  }
  
  function changeDateNaissanceHandler(event) {
    setDateNaissance(event.target.value);
  }
  
  const handleChange = (e) => {
    const codeNive2 = e.target.value;
    setCodeNiv(codeNive2);
    if (codeNive2 !== '') {
      filierService.getFilierNiveau(codeNive2).then((reponse) => {
        setFilierOptions(reponse.data);
      });
      setEnable(false);
    } else {
      setEnable(true);
    }
  }; 
  
  function changeCodeFil(e) {
    setCodeFil(e.target.value);
  }

  const history = useHistory();
  function HandlerAnnuler() {
    if (window.confirm("Voulez-vous vraiment annuler l'inscription ?")) { 
      history.replace('/interface-user'); 
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#e7f1ff',
        animation: 'fadeIn 1s ease-in',
        padding: '2rem 0',
      }}
    >
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
              Inscription
            </h3>
            <form onSubmit={saveInscreption}>
              {[
                {
                  label: 'CIN',
                  value: cin,
                  onChange: changeCinHandler,
                  type: 'text',
                  placeholder: 'Entrez CIN',
                  required: true,
                },
                {
                  label: 'Nom',
                  value: nom,
                  onChange: changeNomHandler,
                  type: 'text',
                  placeholder: 'Entrez le nom',
                  required: true,
                },
                {
                  label: 'Prénom',
                  value: prenom,
                  onChange: changePrenomHandler,
                  type: 'text',
                  placeholder: 'Entrez le prénom',
                  required: true,
                },
                {
                  label: 'Date naissance',
                  value: dateNaissance,
                  onChange: changeDateNaissanceHandler,
                  type: 'date',
                  required: true,
                },
                {
                  label: 'Niveau',
                  type: 'select',
                  onChange: handleChange,
                  options: [
                    { value: '', label: 'Sélectionner un niveau' },
                    ...niveauOptions.map((option) => ({
                      value: option.codeNiv,
                      label: option.designation,
                    })),
                  ],
                  required: true,
                },
                {
                  label: 'Filière',
                  type: 'select',
                  onChange: changeCodeFil,
                  options: [
                    { value: '', label: 'Sélectionner une filière' },
                    ...filierOptions.map((option) => ({
                      value: option.codeFil,
                      label: option.designation,
                    })),
                  ],
                  disabled: enable,
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
                        className={`form-control ${field.value === '' && !formIsValid ? 'is-invalid' : ''}`}
                        value={field.value}
                        onChange={field.onChange}
                        required={field.required}
                        disabled={field.disabled}
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
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={HandlerAnnuler}
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

export default InterfaceInscreption;