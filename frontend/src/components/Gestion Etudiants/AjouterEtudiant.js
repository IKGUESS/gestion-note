import React, { useState, useEffect } from 'react';
import etudiantService from './EtudiantService';
import filierService from '../Gestion Filieres/FilierService';
import niveauService from '../Gestion Niveaux/NiveauService';
import sectionFilierService from '../Gestion Sections Filieres/SectionFilierService';
import { toast } from 'react-toastify';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AjouterEtudiant() {
  const history = useHistory();

  const [cin, setCIN] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [nationalite, setNationalite] = useState('');
  const [ville, setVille] = useState('');
  const [sexe, setSexe] = useState('');
  const [statut, setStatut] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [codeFil, setFilier] = useState('');
  const [section, setSection] = useState('');
  const [filierOptions, setFilierOptions] = useState([]);
  const [niveauOptions, setNiveauOptions] = useState([]);
  const [codeNiv, setCodeNiv] = useState('');
  const [enable, setEnable] = useState(true);
  const [SectionsOptions, setSectionsOptions] = useState([]);

  useEffect(() => {
    niveauService.getNiveau().then((reponse) => {
      setNiveauOptions(reponse.data);
    });
  }, []);

  useEffect(() => {
    filierService.getFilierNiveau(codeNiv).then((reponse) => {
      setFilierOptions(reponse.data);
    });

    sectionFilierService.getAllSectionsByCodeFiliere(codeFil).then((reponse) => {
      setSectionsOptions(reponse.data);
    });
  }, [codeNiv, codeFil]);

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

  const [formIsValid, setFormIsValid] = useState(false);
  useEffect(() => {
    setFormIsValid(
      cin !== '' &&
      nom !== '' &&
      prenom !== '' &&
      dateNaissance !== '' &&
      telephone !== '' &&
      email !== '' &&
      nationalite !== '' &&
      ville !== '' &&
      sexe !== '' &&
      statut !== '' &&
      login !== '' &&
      password !== '' &&
      section !== '' &&
      codeFil !== '' &&
      codeNiv !== ''
    );
  }, [cin, nom, prenom, dateNaissance, telephone, email, nationalite, ville, sexe, statut, login, password, section, codeFil, codeNiv]);

  const saveEtudiant = async (evt) => {
    evt.preventDefault();
    if (formIsValid) {
      let etudiant = {
        cin,
        nom,
        prenom,
        dateNaissance,
        telephone,
        email,
        nationalite,
        ville,
        sexe,
        statut,
        login,
        password,
        filiere: { codeFil: codeFil, niveau: { codeNiv } },
        section: document.getElementById('SelectorSection').value,
      };
      etudiantService.getEtudiantById(cin).then((res) => {
        let cinExists = res.data;
        if (!cinExists.cin) {
          etudiantService.createEtudiant(etudiant).then(() => {
            toast.success('Etudiant ajouté avec succès.', {
              position: toast.POSITION.TOP_CENTER,
            });
            history.replace('/interface-etudiant');
          });
        } else {
          toast.error(`La CIN ${cin} existe déjà dans la base de données.`, {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });
    } else {
      toast.error('Veuillez remplir tous les champs.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const changeCINHandler = (event) => setCIN(event.target.value);
  const changeNomHandler = (event) => setNom(event.target.value);
  const changePrenomHandler = (event) => setPrenom(event.target.value);
  const changeNaissanceHandler = (event) => setDateNaissance(event.target.value);
  const changeTelephoneHandler = (event) => setTelephone(event.target.value);
  const changeEmailHandler = (event) => setEmail(event.target.value);
  const changeNationaliteHandler = (event) => setNationalite(event.target.value);
  const changeVilleHandler = (event) => setVille(event.target.value);
  const changeSexHandler = (event) => setSexe(event.target.value);
  const changeStatutHandler = (event) => setStatut(event.target.value);
  const changeLoginHandler = (event) => setLogin(event.target.value);
  const changePasswordHandler = (event) => setPassword(event.target.value);
  const changeSectionHandler = (event) => setSection(event.target.value);
  const changeCodeFil = (e) => setFilier(e.target.value);

  const fonctionAnnuler = () => {
    history.replace('/interface-etudiant');
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
              Ajouter un Étudiant
            </h3>
            <form onSubmit={saveEtudiant}>
              {[
                { label: 'CIN', value: cin, onChange: changeCINHandler, type: 'text', placeholder: 'CIN', required: true },
                { label: 'Nom', value: nom, onChange: changeNomHandler, type: 'text', placeholder: 'Nom', required: true },
                { label: 'Prénom', value: prenom, onChange: changePrenomHandler, type: 'text', placeholder: 'Prénom', required: true },
                { label: 'Date de naissance', value: dateNaissance, onChange: changeNaissanceHandler, type: 'date', placeholder: 'Date de naissance', required: true },
                { label: 'Téléphone', value: telephone, onChange: changeTelephoneHandler, type: 'text', placeholder: 'Téléphone', required: true },
                { label: 'Email', value: email, onChange: changeEmailHandler, type: 'email', placeholder: 'Email', required: true },
                { label: 'Nationalité', value: nationalite, onChange: changeNationaliteHandler, type: 'text', placeholder: 'Nationalité', required: true },
                { label: 'Ville', value: ville, onChange: changeVilleHandler, type: 'text', placeholder: 'Ville', required: true },
                {
                  label: 'Sexe',
                  value: sexe,
                  onChange: changeSexHandler,
                  type: 'select',
                  options: [
                    { value: '', label: 'Sélectionner le sexe' },
                    { value: 'Homme', label: 'Homme' },
                    { value: 'Femme', label: 'Femme' },
                  ],
                  required: true,
                },
                {
                  label: 'Statut',
                  value: statut,
                  onChange: changeStatutHandler,
                  type: 'select',
                  options: [
                    { value: '', label: 'Sélectionner le statut' },
                    { value: 'En cours', label: 'En cours' },
                    { value: 'Quitter', label: 'Quitter' },
                    { value: 'Termine', label: 'Terminé' },
                  ],
                  required: true,
                },
                { label: 'Login', value: login, onChange: changeLoginHandler, type: 'text', placeholder: 'Utilisateur', required: true },
                { label: 'Mot de passe', value: password, onChange: changePasswordHandler, type: 'password', placeholder: 'Mot de passe', required: true },
                {
                  label: 'Niveau',
                  value: codeNiv,
                  onChange: handleChange,
                  type: 'select',
                  options: [{ value: '', label: 'Sélectionner un niveau' }, ...niveauOptions.map((opt) => ({ value: opt.codeNiv, label: opt.designation }))],
                  id: 'Selector',
                  required: true,
                },
                {
                  label: 'Filière',
                  value: codeFil,
                  onChange: changeCodeFil,
                  type: 'select',
                  options: [{ value: '', label: 'Sélectionner une filière' }, ...filierOptions.map((opt) => ({ value: opt.codeFil, label: opt.designation }))],
                  id: 'Selectorfil',
                  disabled: enable,
                  required: true,
                },
                {
                  label: 'Section',
                  value: section,
                  onChange: changeSectionHandler,
                  type: 'select',
                  options: [{ value: '', label: 'Sélectionner une section' }, ...SectionsOptions.map((opt) => ({ value: opt.section.designation, label: opt.section.designation }))],
                  id: 'SelectorSection',
                  required: true,
                },
              ].map((field, index) => (
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
                        id={field.id}
                        disabled={field.disabled}
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
                        className={`form-control ${field.value === '' && !formIsValid ? 'is-invalid' : ''}`}
                        placeholder={field.placeholder}
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

export default AjouterEtudiant;