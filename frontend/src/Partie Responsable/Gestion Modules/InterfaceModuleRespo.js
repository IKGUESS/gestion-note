import React, { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moduleService from './ModuleService';
import filierService from '../../components/Gestion Filieres/FilierService';
import niveauScolaireService from '../Gestion Niveaux Scolaires/NiveauScolaireService';
import { toast } from 'react-toastify';
import { Pagination } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import _ from 'lodash';
import HeaderResponsable from '../../Header and Footer/HeaderResponsable';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function InterfaceModuleRespo() {
  const history = useHistory();

  const [codeNiv, setCodeNiv] = useState('');
  const [codeFil, setCodeFil] = useState('');
  const [codeNivSco, setCodeNivSco] = useState('');
  const [nomMod, setNomMod] = useState('');
  const [codeMod, setCodeMod] = useState('');
  const [nbTps, setNbTps] = useState('');
  const [nbControles, setNbControles] = useState('');
  const [nbExams, setNbExams] = useState('');
  const [coeffTps, setCoeffTps] = useState('');
  const [coeffControles, setCoeffControles] = useState('');
  const [coeffExams, setCoeffExams] = useState('');
  const [niveauScolaire, setNiveauScolaire] = useState([]);
  const [filierOptions, setFilierOptions] = useState([]);
  const [niveauOptions, setNiveauOptions] = useState([]);
  const [module, setModule] = useState([]);
  const [initialModule, setInitialModule] = useState([]);
  const [enable, setEnable] = useState(true);
  const [enable2, setEnable2] = useState(true);
  const [formIsValid, setFormIsValid] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const cinRespo = localStorage.getItem('cinResponsable');

  // Charger les niveaux
  useEffect(() => {
    filierService.getAllFiliereByCinRespo(cinRespo).then((reponse) => {
      const filieresRespo = reponse.data;
      const niveauxRespo = filieresRespo.map((filiere) => filiere.niveau);
      const uniqueNiveauxRespo = _.uniqBy(niveauxRespo, 'codeNiv');
      setNiveauOptions(uniqueNiveauxRespo);
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
      }).catch((err) => {
        console.error('Error fetching filières:', err);
        toast.error('Erreur lors du chargement des filières.', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    }
  }, [codeNiv]);

  // Charger les niveaux scolaires en fonction de la filière sélectionnée
  useEffect(() => {
    if (codeFil) {
      niveauScolaireService.getNiveauScolaireByCodeFiliere(codeFil).then((reponse) => {
        setNiveauScolaire(reponse.data);
      }).catch((err) => {
        console.error('Error fetching niveaux scolaires:', err);
        toast.error('Erreur lors du chargement des niveaux scolaires.', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    }
  }, [codeFil]);

  // Charger les modules
  useEffect(() => {
    moduleService.getModule().then((reponse) => {
      const modulesRespo = reponse.data.filter(
        (mod) => mod.niveauScolaire.filiere.responsable.cin === cinRespo
      );
      setModule(modulesRespo);
      setInitialModule(modulesRespo);
    }).catch((err) => {
      console.error('Error fetching modules:', err);
      toast.error('Erreur lors du chargement des modules.', {
        position: toast.POSITION.TOP_CENTER,
      });
    });
  }, [cinRespo]);

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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(module.length / itemsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const displayedModules = module.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Ajouter un module
  const saveModule = (e) => {
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
      moduleService.getModuleById(codeMod).then(() => {
        toast.error(`Le module ${codeMod} existe déjà dans la base de données.`, {
          position: toast.POSITION.TOP_CENTER,
        });
      }).catch((err) => {
        if (err.response?.status === 404) {
          moduleService.createModule(moduleData).then(() => {
            toast.success('Module ajouté avec succès !', {
              position: toast.POSITION.TOP_CENTER,
            });
            setModule([...module, moduleData]);
            setInitialModule([...initialModule, moduleData]);
            resetForm();
          }).catch((createErr) => {
            console.error('Error creating module:', createErr);
            toast.error('Erreur lors de l\'ajout du module.', {
              position: toast.POSITION.TOP_CENTER,
            });
          });
        } else {
          console.error('Error checking module existence:', err);
          toast.error('Erreur lors de la vérification du module.', {
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

  // Modifier un module
  const modifierModule = (codeMod) => {
    if (window.confirm('Voulez-vous vraiment mettre à jour ce Module ?')) {
      history.replace(`/modifier-module-respo/${codeMod}`);
    }
  };

  // Supprimer un module
  const deleteModule = (codMod) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce Module ?')) {
      moduleService.deleteModule(codMod).then(() => {
        setModule(module.filter((mod) => mod.codeMod !== codMod));
        setInitialModule(initialModule.filter((mod) => mod.codeMod !== codMod));
        toast.success('Module supprimé avec succès !', {
          position: toast.POSITION.TOP_CENTER,
        });
      }).catch((err) => {
        console.error('Error deleting module:', err);
        toast.error('Erreur lors de la suppression du module.', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    }
  };

  // Recherche
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = initialModule.filter((mod) =>
      mod.nomMod.toLowerCase().includes(term.toLowerCase())
    );
    setModule(filtered);
    setCurrentPage(1);
  };

  const reinitialiserPage = () => {
    setSearchTerm('');
    setModule(initialModule);
    setCurrentPage(1);
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setCodeMod('');
    setNomMod('');
    setNbTps('');
    setNbControles('');
    setNbExams('');
    setCoeffTps('');
    setCoeffControles('');
    setCoeffExams('');
    setCodeNiv('');
    setCodeFil('');
    setCodeNivSco('');
    setEnable(true);
    setEnable2(true);
  };

  // Handlers
  const changeCodeModHandler = (e) => setCodeMod(e.target.value);
  const changeNomModHandler = (e) => setNomMod(e.target.value);
  const changeNbTpsHandler = (e) => setNbTps(e.target.value);
  const changeNbControlesHandler = (e) => setNbControles(e.target.value);
  const changeNbExamsHandler = (e) => setNbExams(e.target.value);
  const changeCoeffTpsHandler = (e) => setCoeffTps(e.target.value);
  const changeCoeffControlesHandler = (e) => setCoeffControles(e.target.value);
  const changeCoeffExamsHandler = (e) => setCoeffExams(e.target.value);

  const handleChangeNiveau = (e) => {
    const codeNiv2 = e.target.value;
    setCodeNiv(codeNiv2);
    setCodeFil('');
    setCodeNivSco('');
    setNiveauScolaire([]);
    setEnable(codeNiv2 === '');
    setEnable2(true);
  };

  const handleChangeFilier = (e) => {
    const codeFil2 = e.target.value;
    setCodeFil(codeFil2);
    setCodeNivSco('');
    setEnable2(codeFil2 === '');
  };

  const handleChangeNiveauScolaire = (e) => {
    setCodeNivSco(e.target.value);
  };

  const Retour = () => {
    history.replace('/interface-principale-responsable');
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
          Gestion des Modules
        </h3>
        <div
          className="mb-4"
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
            Ajouter un Module
          </h4>
          <form onSubmit={saveModule}>
            {[
              {
                label: 'Niveau',
                value: codeNiv,
                onChange: handleChangeNiveau,
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
                onChange: handleChangeFilier,
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
                disabled: enable,
              },
              {
                label: 'Niveau Scolaire',
                value: codeNivSco,
                onChange: handleChangeNiveauScolaire,
                type: 'select',
                options: [
                  { value: '', label: 'Sélectionner un niveau scolaire' },
                  ...niveauScolaire.map((nivSco) => ({
                    value: nivSco.codeNivSco,
                    label: nivSco.designation,
                  })),
                ],
                required: true,
                disabled: enable2,
              },
              {
                label: 'Code Module',
                value: codeMod,
                onChange: changeCodeModHandler,
                type: 'text',
                placeholder: 'Code Module',
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
                  aria-label="Enregistrer le module"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={resetForm}
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
        <div
          className="mb-4"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            padding: '1rem',
            border: '2px solid #4dabf7',
            backdropFilter: 'blur(5px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="form-group d-flex align-items-center">
            <label
              htmlFor="search"
              style={{
                fontSize: '0.9rem',
                color: '#343a40',
                fontWeight: '500',
                marginRight: '1rem',
                marginBottom: '0',
              }}
            >
              Rechercher :
            </label>
            <input
              type="text"
              className="form-control"
              id="search"
              placeholder="Rechercher un module par nom"
              value={searchTerm}
              onChange={handleSearch}
              style={{
                borderRadius: '8px',
                border: '2px solid #4dabf7',
                padding: '0.5rem',
                fontSize: '0.9rem',
                flex: '1',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
              onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
              aria-label="Rechercher un module par nom"
            />
            <button
              className="btn"
              onClick={reinitialiserPage}
              style={{
                width: '120px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid #4dabf7',
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
                e.currentTarget.style.borderColor = '#1a91ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#4dabf7';
              }}
              aria-label="Réinitialiser la recherche"
            >
              Réinitialiser
            </button>
          </div>
        </div>
        <div
          style={{
            animation: 'slideIn 0.5s ease-in',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            border: '2px solid #4dabf7',
            overflowX: 'auto',
          }}
        >
          <table
            className="table table-bordered"
            style={{
              borderRadius: '10px',
              overflow: 'hidden',
              borderCollapse: 'separate',
              fontSize: '0.9rem',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#4dabf7',
                  color: '#fff',
                  fontWeight: '500',
                }}
              >
                <th>Niveau</th>
                <th>Filière</th>
                <th>Niveau Scolaire</th>
                <th>Code Module</th>
                <th>Nom Module</th>
                <th>Nb Contrôles</th>
                <th>Nb TPs</th>
                <th>Nb Examens</th>
                <th>Coeff Contrôles</th>
                <th>Coeff TPs</th>
                <th>Coeff Examens</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedModules.length === 0 ? (
                <tr>
                  <td colSpan="12" className="text-center" style={{ color: '#343a40' }}>
                    Aucun Module disponible
                  </td>
                </tr>
              ) : (
                displayedModules.map((mod) => (
                  <tr
                    key={mod.codeMod}
                    style={{
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f9ff')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td>{mod.niveauScolaire.filiere.niveau?.designation || 'N/A'}</td>
                    <td>{mod.niveauScolaire.filiere?.designation || 'N/A'}</td>
                    <td>{mod.niveauScolaire?.designation || 'N/A'}</td>
                    <td>{mod.codeMod}</td>
                    <td>{mod.nomMod}</td>
                    <td>{mod.nbControles}</td>
                    <td>{mod.nbTps}</td>
                    <td>{mod.nbExams}</td>
                    <td>{mod.coeffControles}</td>
                    <td>{mod.coeffTps}</td>
                    <td>{mod.coeffExams}</td>
                    <td>
                      <EditOutlined
                        style={{
                          color: '#28a745',
                          cursor: 'pointer',
                          fontSize: '22px',
                          marginRight: '15px',
                          transition: 'transform 0.3s ease',
                        }}
                        onClick={() => modifierModule(mod.codeMod)}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        aria-label={`Modifier le module ${mod.codeMod}`}
                      />
                      <DeleteOutlined
                        style={{
                          color: '#dc3545',
                          cursor: 'pointer',
                          fontSize: '22px',
                          transition: 'transform 0.3s ease',
                        }}
                        onClick={() => deleteModule(mod.codeMod)}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        aria-label={`Supprimer le module ${mod.codeMod}`}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            padding: '0.5rem',
            border: '2px solid #4dabf7',
            backdropFilter: 'blur(5px)',
            marginTop: '1rem',
          }}
        >
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            style={{
              border: '2px solid #4dabf7',
              borderRadius: '8px',
              marginRight: '0.5rem',
              backgroundColor: currentPage === 1 ? '#e9ecef' : 'transparent',
              transition: 'border-color 0.3s ease',
            }}
            onMouseEnter={(e) => currentPage !== 1 && (e.currentTarget.style.borderColor = '#1a91ff')}
            onMouseLeave={(e) => currentPage !== 1 && (e.currentTarget.style.borderColor = '#4dabf7')}
            aria-label="Page précédente"
          >
            <FaChevronLeft />
          </Pagination.Prev>
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
              style={{
                border: '2px solid #4dabf7',
                borderRadius: '8px',
                margin: '0 0.2rem',
                backgroundColor: index + 1 === currentPage ? '#4dabf7' : 'transparent',
                color: index + 1 === currentPage ? '#fff' : '#343a40',
                transition: 'border-color 0.3s ease, background-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (index + 1 !== currentPage) {
                  e.currentTarget.style.borderColor = '#1a91ff';
                  e.currentTarget.style.backgroundColor = '#f1f9ff';
                }
              }}
              onMouseLeave={(e) => {
                if (index + 1 !== currentPage) {
                  e.currentTarget.style.borderColor = '#4dabf7';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
              aria-label={`Page ${index + 1}`}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            style={{
              border: '2px solid #4dabf7',
              borderRadius: '8px',
              marginLeft: '0.5rem',
              backgroundColor: currentPage === totalPages ? '#e9ecef' : 'transparent',
              transition: 'border-color 0.3s ease',
            }}
            onMouseEnter={(e) => currentPage !== totalPages && (e.currentTarget.style.borderColor = '#1a91ff')}
            onMouseLeave={(e) => currentPage !== totalPages && (e.currentTarget.style.borderColor = '#4dabf7')}
            aria-label="Page suivante"
          >
            <FaChevronRight />
          </Pagination.Next>
        </Pagination>
        <div className="d-flex justify-content-end mt-4">
          <button
            className="btn"
            onClick={Retour}
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
            aria-label="Retour à l'interface principale"
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

export default InterfaceModuleRespo;