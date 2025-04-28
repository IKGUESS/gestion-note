import React, { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import niveauService from '../Gestion Niveaux/NiveauService';
import filierService from '../Gestion Filieres/FilierService';
import sectionService from '../Gestion Sections/SectionService';
import sectionFilierService from './SectionFilierService';
import { toast } from 'react-toastify';
import { Pagination } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function InterfaceSectionFilier() {
  const [codeSec, setCodeSec] = useState('');
  const [codeNiv, setCodeNiv] = useState('');
  const [codeFil, setCodeFil] = useState('');
  const [section, setSection] = useState([]);
  const [filierOptions, setFilierOptions] = useState([]);
  const [niveauOptions, setNiveauOptions] = useState([]);
  const [sectionFilier, setSectionFilier] = useState([]);
  const [enable, setEnable] = useState(true);
  const [filiereRecherche, setFiliereRecherche] = useState('');
  const history = useHistory();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(sectionFilier.length / itemsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const displayedSectionsFilieres =
    sectionFilier.length !== 0
      ? sectionFilier.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      : [];

  // Fetch niveaux
  useEffect(() => {
    niveauService.getNiveau().then((reponse) => {
      setNiveauOptions(reponse.data);
    });
  }, []);

  // Fetch filières based on niveau
  useEffect(() => {
    filierService.getFilierNiveau(codeNiv).then((reponse) => {
      setFilierOptions(reponse.data);
      setCodeNiv(codeNiv);
    });
  }, [codeNiv]);

  // Fetch sections
  useEffect(() => {
    sectionService.getSection().then((reponse) => {
      setSection(reponse.data);
    });
  }, []);

  // Fetch section-filière mappings
  useEffect(() => {
    sectionFilierService.getSectionFilier().then((reponse) => {
      setSectionFilier(reponse.data);
    });
  }, []);

  // Form validation
  const validateForm = () => {
    return codeSec !== '' && codeFil !== '';
  };

  // Save section-filière mapping
  const saveSectionFilier = (e) => {
    e.preventDefault();
    if (validateForm()) {
      let secfil = {
        section: { codeSec: codeSec },
        filier: {
          codeFil: document.getElementById('Selectorfil').value,
          niveau: { codeNiv: document.getElementById('Selector').value },
        },
      };
      sectionFilierService.createSectionFilier(secfil).then((res) => {
        window.alert('Section Filiere ajoutée avec succès.');
        history.replace('/interface-section-filiere');
      });
    } else {
      toast.error('Veuillez remplir tous les champs.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  // Modify section-filière (currently a placeholder)
  function modifierSectionFilier(codeFil, codeSec) {
    if (window.confirm('Voulez-vous vraiment mettre à jour cette Affectation ?')) {
      // Placeholder for modification logic
    }
  }

  // Delete section-filière
  function deleteSectionFilier(codFil, codSec) {
    if (window.confirm('Voulez-vous vraiment supprimer cette Filière - Section ?')) {
      sectionFilierService.deleteSectionFilier(codFil, codSec).then((reponse) => {
        setSectionFilier((prevSectionFilier) =>
          prevSectionFilier.filter(
            (sectionFili) => sectionFili.filier.codeFil !== codFil || sectionFili.section.codeSec !== codSec
          )
        );
        toast.success('Filière - Section supprimée avec succès !', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    }
  }

  // Handle niveau selection
  const handleChange = (e) => {
    const codeNive2 = e.target.value;
    if (codeNive2 !== '') {
      filierService.getFilierNiveau(codeNive2).then((reponse) => {
        setFilierOptions(reponse.data);
      });
      setEnable(false);
    } else {
      setEnable(true);
    }
  };

  // Handle filière and section selection
  const handleChangeFilier = (e) => {
    setCodeFil(e.target.value);
  };

  const handleChangeSection = (e) => {
    setCodeSec(e.target.value);
  };

  // Reset form
  function HandlerAnnuler() {
    setCodeSec('');
    setCodeNiv('');
    setCodeFil('');
  }

  // Search filière by designation
  function rechercherFiliereParDesignation() {
    const results = sectionFilier.filter((sectionsFilieres) =>
      sectionsFilieres.filier.designation.toLowerCase().includes(filiereRecherche.toLowerCase())
    );
    setSectionFilier(results);
  }

  // Reset page
  function reinitialiserPage() {
    window.location.href = '/interface-section-filiere';
  }

  // Navigate back
  function Retour() {
    history.replace('/interface-principale-section');
  }

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
              Affecter Section - Filière
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
                      onChange={(e) => handleChange(e)}
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
                      <option value="">Sélectionner un niveau</option>
                      {niveauOptions.map((option) => (
                        <option key={option.codeNiv} value={option.codeNiv}>
                          {option.designation}
                        </option>
                      ))}
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
                      disabled={enable}
                      onChange={(e) => handleChangeFilier(e)}
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #4dabf7',
                        padding: '0.5rem',
                        fontSize: '0.9rem',
                        backgroundColor: enable ? '#f1f3f5' : 'white',
                        cursor: enable ? 'not-allowed' : 'pointer',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = enable ? '#4dabf7' : '#1a91ff')}
                      onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                      aria-label="Sélectionner une filière"
                    >
                      <option value="">Sélectionner une filière</option>
                      {filierOptions.map((option) => (
                        <option key={option.codeFil} value={option.codeFil}>
                          {option.designation}
                        </option>
                      ))}
                    </select>
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
                    Section :
                  </label>
                  <div className="col-sm-9">
                    <select
                      className="form-control"
                      id="Selecto"
                      placeholder="Section"
                      name="Section"
                      onChange={(e) => handleChangeSection(e)}
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #4dabf7',
                        padding: '0.5rem',
                        fontSize: '0.9rem',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                      onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                      aria-label="Sélectionner une section"
                    >
                      <option value="">Sélectionner une Section</option>
                      {section.map((option) => (
                        <option key={option.codeSec} value={option.codeSec}>
                          {option.designation}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-sm-5 offset-sm-8 d-flex justify-content-end">
                    <button
                      className="btn"
                      onClick={saveSectionFilier}
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
                      aria-label="Enregistrer l'affectation"
                    >
                      Enregistrer
                    </button>
                    <button
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
        <br />
        <div
          className="row"
          style={{
            animation: 'slideIn 0.5s ease-in',
          }}
        >
          <div className="col-md-12">
            <div className="form-group mb-4">
              <label
                htmlFor="search"
                style={{
                  marginLeft: '4%',
                  fontWeight: '600',
                  color: '#008080',
                  fontSize: '1rem',
                }}
              >
                Filière :
              </label>
              <input
                type="text"
                className="form-control col-sm-6"
                id="search"
                placeholder="Entrez la désignation de la Filière"
                value={filiereRecherche}
                onChange={(e) => setFiliereRecherche(e.target.value)}
                style={{
                  display: 'inline-block',
                  marginLeft: '1%',
                  borderRadius: '8px',
                  border: '2px solid #4dabf7',
                  padding: '0.5rem',
                  fontSize: '0.9rem',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                aria-label="Rechercher une filière par désignation"
              />
              <button
                className="btn"
                onClick={rechercherFiliereParDesignation}
                style={{
                  display: 'inline-block',
                  marginLeft: '1%',
                  width: '120px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid #008080',
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
                  e.currentTarget.style.borderColor = '#006666';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#008080';
                }}
                aria-label="Rechercher"
              >
                Rechercher
              </button>
              <button
                className="btn"
                onClick={reinitialiserPage}
                style={{
                  display: 'inline-block',
                  marginLeft: '1%',
                  width: '120px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid #008080',
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
                  e.currentTarget.style.borderColor = '#006666';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#008080';
                }}
                aria-label="Réinitialiser"
              >
                Réinitialiser
              </button>
            </div>
            <table
              className="table table-striped table-bordered"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
              }}
            >
              <thead
                style={{
                  background: 'linear-gradient(90deg, #4dabf7, #1a91ff)',
                  color: '#fff',
                  fontWeight: '600',
                }}
              >
                <tr>
                  <th>Niveau</th>
                  <th>Filière</th>
                  <th>Section</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sectionFilier.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center" style={{ color: '#343a40', fontWeight: '500' }}>
                      Aucun Filière disponible
                    </td>
                  </tr>
                ) : (
                  displayedSectionsFilieres.map((secfil) => (
                    <tr
                      key={secfil.id}
                      style={{
                        transition: 'background-color 0.3s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e7f1ff')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td>{secfil.filier.niveau.designation}</td>
                      <td>{secfil.filier.designation}</td>
                      <td>{secfil.section.designation}</td>
                      <td>
                        <EditOutlined
                          style={{
                            color: '#51cf66',
                            cursor: 'pointer',
                            marginLeft: '1px',
                            fontSize: '22px',
                            transition: 'color 0.3s ease, transform 0.3s ease',
                          }}
                          onClick={() => modifierSectionFilier(secfil.filier.codeFil, secfil.section.codeSec)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#37b24d';
                            e.currentTarget.style.transform = 'scale(1.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#51cf66';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                          aria-label="Modifier l'affectation"
                        />
                        <DeleteOutlined
                          style={{
                            color: '#ff6b6b',
                            cursor: 'pointer',
                            marginLeft: '8px',
                            fontSize: '22px',
                            transition: 'color 0.3s ease, transform 0.3s ease',
                          }}
                          onClick={() => deleteSectionFilier(secfil.filier.codeFil, secfil.section.codeSec)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#e63946';
                            e.currentTarget.style.transform = 'scale(1.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#ff6b6b';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                          aria-label="Supprimer l'affectation"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <Pagination
              prevLabel=""
              nextLabel=""
              style={{
                marginTop: '1rem',
                marginLeft: '3%',
                justifyContent: 'center',
              }}
            >
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                style={{
                  border: '2px solid #4dabf7',
                  borderRadius: '8px',
                  marginRight: '0.5rem',
                  transition: 'border-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#1a91ff')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#4dabf7')}
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
                    backgroundColor: index + 1 === currentPage ? '#4dabf7' : 'rgba(255, 255, 255, 0.9)',
                    color: index + 1 === currentPage ? '#fff' : '#343a40',
                    transition: 'background-color 0.3s ease, border-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (index + 1 !== currentPage) {
                      e.currentTarget.style.backgroundColor = '#e7f1ff';
                      e.currentTarget.style.borderColor = '#1a91ff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index + 1 !== currentPage) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.borderColor = '#4dabf7';
                    }
                  }}
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
                  transition: 'border-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#1a91ff')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#4dabf7')}
              >
                <FaChevronRight />
              </Pagination.Next>
            </Pagination>
          </div>
        </div>
        <div className="form-group row mt-4">
          <div className="col-sm-4 offset-sm-10 d-flex justify-content-end">
            <button
              className="btn"
              onClick={() => Retour()}
              style={{
                width: '120px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid #4dabf7',
                color: '#343a40',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontWeight: '500',
                fontSize: '1.1rem',
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
          .table th, .table td {
            padding: 0.75rem;
            vertical-align: middle;
          }
          .pagination {
            display: flex;
            justify-content: center;
          }
        `}
      </style>
    </div>
  );
}

export default InterfaceSectionFilier;