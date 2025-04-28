import React, { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import niveauScolaireService from './NiveauScolaireService';
import filierService from '../../components/Gestion Filieres/FilierService';
import { toast } from 'react-toastify';
import { Pagination } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import _ from 'lodash';
import HeaderResponsable from '../../Header and Footer/HeaderResponsable';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function InterfaceNiveauScolaireRespo() {
  const history = useHistory();

  const [codeNivSco, setCodeNivSco] = useState('');
  const [codeNiv, setCodeNiv] = useState('');
  const [designation, setDesignation] = useState('');
  const [niveauScolaire, setNiveauScolaire] = useState([]);
  const [filierOptions, setFilierOptions] = useState([]);
  const [niveauOptions, setNiveauOptions] = useState([]);
  const [enable, setEnable] = useState(true);
  const [formIsValid, setFormIsValid] = useState(false);

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

  // Charger les niveaux scolaires
  useEffect(() => {
    niveauScolaireService.getNiveauScolaire().then((reponse) => {
      const niveauxScolairesRespo = reponse.data.filter(
        (niveauScol) => niveauScol.filiere.responsable.cin === cinRespo
      );
      setNiveauScolaire(niveauxScolairesRespo);
    }).catch((err) => {
      console.error('Error fetching niveaux scolaires:', err);
      toast.error('Erreur lors du chargement des niveaux scolaires.', {
        position: toast.POSITION.TOP_CENTER,
      });
    });
  }, [cinRespo]);

  // Validation du formulaire
  useEffect(() => {
    setFormIsValid(
      codeNivSco !== '' &&
      designation !== '' &&
      codeNiv !== '' &&
      document.getElementById('Selectorfil')?.value !== ''
    );
  }, [codeNivSco, designation, codeNiv]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(niveauScolaire.length / itemsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const displayedNiveauxScolaires = niveauScolaire.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Ajouter un niveau scolaire
  const saveNiveauScolaire = (e) => {
    e.preventDefault();
    if (formIsValid) {
      const niveauScolaireData = {
        codeNivSco,
        designation,
        filiere: {
          codeFil: document.getElementById('Selectorfil').value,
          niveau: { codeNiv },
        },
      };
      niveauScolaireService.getNiveauScolaireById(codeNivSco).then((res) => {
        toast.error(
          `Le Niveau Scolaire ${codeNivSco} existe déjà dans la base de données.`,
          { position: toast.POSITION.TOP_CENTER }
        );
      }).catch((err) => {
        if (err.response?.status === 404) {
          niveauScolaireService.createNiveauScolaire(niveauScolaireData).then(() => {
            toast.success('Niveau Scolaire ajouté avec succès !', {
              position: toast.POSITION.TOP_CENTER,
            });
            setNiveauScolaire([...niveauScolaire, niveauScolaireData]);
            setCodeNivSco('');
            setDesignation('');
            setCodeNiv('');
            setEnable(true);
          }).catch((createErr) => {
            console.error('Error creating niveau scolaire:', createErr);
            toast.error('Erreur lors de l\'ajout du niveau scolaire.', {
              position: toast.POSITION.TOP_CENTER,
            });
          });
        } else {
          console.error('Error checking niveau scolaire existence:', err);
          toast.error('Erreur lors de la vérification du niveau scolaire.', {
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

  // Modifier un niveau scolaire
  const modifierNiveauScolaire = (codeNivSco) => {
    if (window.confirm('Voulez-vous vraiment mettre à jour ce Niveau Scolaire ?')) {
      history.replace(`/modifier-niveau-scolaire-respo/${codeNivSco}`);
    }
  };

  // Supprimer un niveau scolaire
  const deleteNiveauScolaire = (codNivSco) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce Niveau Scolaire ?')) {
      niveauScolaireService.deleteNiveauScolaire(codNivSco).then(() => {
        setNiveauScolaire(niveauScolaire.filter((niveauScol) => niveauScol.codeNivSco !== codNivSco));
        toast.success('Niveau Scolaire supprimé avec succès !', {
          position: toast.POSITION.TOP_CENTER,
        });
      }).catch((err) => {
        console.error('Error deleting niveau scolaire:', err);
        toast.error('Erreur lors de la suppression du niveau scolaire.', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    }
  };

  // Handlers
  const changeCodeNivScoHandler = (e) => setCodeNivSco(e.target.value);
  const changeDesignationHandler = (e) => setDesignation(e.target.value);
  const handleChange = (e) => {
    const codeNive2 = e.target.value;
    setCodeNiv(codeNive2);
    if (codeNive2 !== '') {
      setEnable(false);
    } else {
      setEnable(true);
      setFilierOptions([]);
    }
  };

  const HandlerAnnuler = () => {
    setCodeNiv('');
    setCodeNivSco('');
    setDesignation('');
    setEnable(true);
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
          Gestion des Niveaux Scolaires
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
            Ajouter un Niveau Scolaire
          </h4>
          <form onSubmit={saveNiveauScolaire}>
            {[
              {
                label: 'Niveau',
                value: codeNiv,
                onChange: handleChange,
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
                value: document.getElementById('Selectorfil')?.value || '',
                disabled: enable,
                type: 'select',
                options: [
                  { value: '', label: 'Sélectionner une filière' },
                  ...filierOptions
                    .filter((option) => option.responsable.cin === cinRespo)
                    .map((fil) => ({
                      value: fil.codeFil,
                      label: fil.designation,
                    })),
                ],
                required: true,
              },
              {
                label: 'Code Niveau Scolaire',
                value: codeNivSco,
                onChange: changeCodeNivScoHandler,
                type: 'text',
                placeholder: 'Code Niveau Scolaire',
                required: true,
              },
              {
                label: 'Désignation',
                value: designation,
                onChange: changeDesignationHandler,
                type: 'text',
                placeholder: 'Désignation',
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
                      id={field.label === 'Filière' ? 'Selectorfil' : 'Selector'}
                      value={field.value}
                      onChange={field.onChange}
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
                  aria-label="Enregistrer le niveau scolaire"
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
                  aria-label="Annuler"
                >
                  Annuler
                </button>
              </div>
            </div>
          </form>
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
                <th>Code Niveau Scolaire</th>
                <th>Désignation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedNiveauxScolaires.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center" style={{ color: '#343a40' }}>
                    Aucun Niveau Scolaire disponible
                  </td>
                </tr>
              ) : (
                displayedNiveauxScolaires.map((niveauScol) => (
                  <tr
                    key={niveauScol.codeNivSco}
                    style={{
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f9ff')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td>{niveauScol.filiere.niveau?.designation || 'N/A'}</td>
                    <td>{niveauScol.filiere?.designation || 'N/A'}</td>
                    <td>{niveauScol.codeNivSco}</td>
                    <td>{niveauScol.designation}</td>
                    <td>
                      <EditOutlined
                        style={{
                          color: '#28a745',
                          cursor: 'pointer',
                          fontSize: '22px',
                          marginRight: '15px',
                          transition: 'transform 0.3s ease',
                        }}
                        onClick={() => modifierNiveauScolaire(niveauScol.codeNivSco)}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        aria-label={`Modifier le niveau scolaire ${niveauScol.codeNivSco}`}
                      />
                      <DeleteOutlined
                        style={{
                          color: '#dc3545',
                          cursor: 'pointer',
                          fontSize: '22px',
                          transition: 'transform 0.3s ease',
                        }}
                        onClick={() => deleteNiveauScolaire(niveauScol.codeNivSco)}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        aria-label={`Supprimer le niveau scolaire ${niveauScol.codeNivSco}`}
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

export default InterfaceNiveauScolaireRespo;