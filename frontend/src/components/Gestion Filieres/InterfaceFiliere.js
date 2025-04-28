import React, { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import filierService from './FilierService';
import niveauService from '../Gestion Niveaux/NiveauService';
import { toast } from 'react-toastify';
import { Pagination } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function InterfaceFiliere() {
  const history = useHistory();
  const [codeFil, setCodeFil] = useState('');
  const [designation, setDesignation] = useState('');
  const [statut, setStatut] = useState('');
  const [codeNiv, setCodeNiv] = useState('');
  const [filier, setFilier] = useState([]);
  const [initialFilier, setInitialFilier] = useState([]);
  const [niveauOptions, setNiveauOptions] = useState([]);
  const [formIsValid, setFormIsValid] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(filier.length / itemsPerPage);
  const displayedFilieres = filier.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    niveauService.getNiveau().then((reponse) => {
      setNiveauOptions(reponse.data);
    }).catch((err) => {
      console.error('Error fetching niveaux:', err);
      toast.error('Erreur lors du chargement des niveaux.', {
        position: toast.POSITION.TOP_CENTER,
      });
    });
  }, []);

  useEffect(() => {
    filierService.getFilier().then((reponse) => {
      setFilier(reponse.data);
      setInitialFilier(reponse.data);
    }).catch((err) => {
      console.error('Error fetching filières:', err);
      toast.error('Erreur lors du chargement des filières.', {
        position: toast.POSITION.TOP_CENTER,
      });
    });
  }, []);

  useEffect(() => {
    setFormIsValid(codeFil !== '' && designation !== '' && statut !== '' && codeNiv !== '');
  }, [codeFil, designation, statut, codeNiv]);

  const saveFilier = (e) => {
    e.preventDefault();
    if (formIsValid) {
      const filierData = { codeFil, designation, statut, niveau: { codeNiv } };
      filierService.getFilierById(codeFil).then(() => {
        toast.error(`La filière ${codeFil} existe déjà dans la base de données.`, {
          position: toast.POSITION.TOP_CENTER,
        });
      }).catch((err) => {
        if (err.response?.status === 404) {
          filierService.createFilier(filierData).then(() => {
            toast.success('Filière ajoutée avec succès.', {
              position: toast.POSITION.TOP_CENTER,
            });
            setFilier([...filier, filierData]);
            setInitialFilier([...initialFilier, filierData]);
            setCodeFil('');
            setDesignation('');
            setStatut('');
            setCodeNiv('');
          }).catch((createErr) => {
            console.error('Error creating filière:', createErr);
            toast.error('Erreur lors de l\'ajout de la filière.', {
              position: toast.POSITION.TOP_CENTER,
            });
          });
        } else {
          console.error('Error checking filière existence:', err);
          toast.error('Erreur lors de la vérification de la filière.', {
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

  const modifierFilier = (codeFil) => {
    if (window.confirm('Voulez-vous vraiment mettre à jour cette Filière ?')) {
      history.push(`/modifier-filiere/${codeFil}`);
    }
  };

  const deleteFilier = (codFil) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette Filière ?')) {
      filierService.deleteFiliere(codFil).then(() => {
        setFilier(filier.filter((filiere) => filiere.codeFil !== codFil));
        setInitialFilier(initialFilier.filter((filiere) => filiere.codeFil !== codFil));
        toast.success('Filière supprimée avec succès !', {
          position: toast.POSITION.TOP_CENTER,
        });
      }).catch((err) => {
        console.error('Error deleting filière:', err);
        toast.error('Erreur lors de la suppression de la filière.', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = initialFilier.filter((fili) =>
      fili.designation.toLowerCase().includes(term.toLowerCase())
    );
    setFilier(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  const reinitialiserPage = () => {
    setSearchTerm('');
    setFilier(initialFilier);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
        <h3
          className="text-center mb-4"
          style={{
            fontWeight: '600',
            background: 'linear-gradient(90deg, #4dabf7, #1a91ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Gestion des Filières
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
            Ajouter une Filière
          </h4>
          <form onSubmit={saveFilier}>
            {[
              {
                label: 'Niveau',
                value: codeNiv,
                onChange: (e) => setCodeNiv(e.target.value),
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
                label: 'Code Filière',
                value: codeFil,
                onChange: (e) => setCodeFil(e.target.value),
                type: 'text',
                placeholder: 'Code Filière',
                required: true,
              },
              {
                label: 'Désignation',
                value: designation,
                onChange: (e) => setDesignation(e.target.value),
                type: 'text',
                placeholder: 'Désignation',
                required: true,
              },
              {
                label: 'Statut',
                value: statut,
                onChange: (e) => setStatut(e.target.value),
                type: 'select',
                options: [
                  { value: '', label: 'Sélectionner le statut' },
                  { value: 'En cours', label: 'En cours' },
                  { value: 'En attente', label: 'En attente' },
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
                      aria-label={field.label}
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
                  aria-label="Enregistrer la filière"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setCodeFil('');
                    setDesignation('');
                    setStatut('');
                    setCodeNiv('');
                  }}
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
        <div className="mb-4">
          <div
            className="form-group d-flex align-items-center"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              padding: '1rem',
              border: '2px solid #4dabf7',
              backdropFilter: 'blur(5px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
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
              placeholder="Rechercher une filière"
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
              aria-label="Rechercher une filière par désignation"
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
                <th>Code Niveau</th>
                <th>Code Filière</th>
                <th>Désignation</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedFilieres.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center" style={{ color: '#343a40' }}>
                    Aucune Filière disponible
                  </td>
                </tr>
              ) : (
                displayedFilieres.map((fili) => (
                  <tr
                    key={fili.codeFil}
                    style={{
                      transition: 'background-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f9ff')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td>{fili.niveau?.designation || 'N/A'}</td>
                    <td>{fili.niveau?.codeNiv || 'N/A'}</td>
                    <td>{fili.codeFil}</td>
                    <td>{fili.designation}</td>
                    <td>{fili.statut}</td>
                    <td>
                      <EditOutlined
                        style={{
                          color: '#28a745',
                          cursor: 'pointer',
                          fontSize: '22px',
                          marginRight: '15px',
                          transition: 'transform 0.3s ease',
                        }}
                        onClick={() => modifierFilier(fili.codeFil)}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        aria-label={`Modifier la filière ${fili.codeFil}`}
                      />
                      <DeleteOutlined
                        style={{
                          color: '#dc3545',
                          cursor: 'pointer',
                          fontSize: '22px',
                          transition: 'transform 0.3s ease',
                        }}
                        onClick={() => deleteFilier(fili.codeFil)}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        aria-label={`Supprimer la filière ${fili.codeFil}`}
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
            onClick={() => history.push('/interface-principale-niveaux')}
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
            aria-label="Retour à l'interface principale des niveaux"
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

export default InterfaceFiliere;