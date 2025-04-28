import React, { useState, useEffect } from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import niveauEtude from '../../services/NiveauEtude';
import noteService from '../../services/NoteService';
import _ from 'lodash';
import filierService from '../../components/Gestion Filieres/FilierService';
import { Pagination } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import HeaderResponsable from '../../Header and Footer/HeaderResponsable';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

function InterfaceGestionAbsencesRespo() {
  const history = useHistory();

  const [absencesModules, setAbsencesModules] = useState([]);
  const [initialAbsencesModules, setInitialAbsencesModules] = useState([]);
  const [absencesValues, setAbsencesValues] = useState({});
  const [niveaux, setNiveaux] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [niveauxScolaires, setNiveauxScolaires] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const cinRespo = localStorage.getItem('cinResponsable');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(absencesModules.length / itemsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const displayedAbsences = absencesModules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Load niveaux
  useEffect(() => {
    filierService.getAllFiliereByCinRespo(cinRespo).then((reponse) => {
      const filieresRespo = reponse.data;
      const niveauxRespo = filieresRespo.map((filiere) => filiere.niveau);
      const uniqueNiveauxRespo = _.uniqBy(niveauxRespo, 'codeNiv');
      setNiveaux(uniqueNiveauxRespo);
    }).catch((err) => {
      console.error('Error fetching niveaux:', err);
      toast.error('Erreur lors du chargement des niveaux.', {
        position: toast.POSITION.TOP_CENTER,
      });
    });
  }, [cinRespo]);

  // Handle niveau change
  const handleNiveauChange = (e) => {
    const selectedNiveauCode = e.target.value;
    if (selectedNiveauCode) {
      niveauEtude.getFilieresByCodeNiveau(selectedNiveauCode).then((reponse) => {
        const filieresRespo = reponse.data.filter((filie) => filie.responsable.cin === cinRespo);
        setFilieres(filieresRespo);
        setNiveauxScolaires([]);
        setModules([]);
        setSelectedModule('');
        setAbsencesModules([]);
      }).catch((err) => {
        console.error('Error fetching filières:', err);
        toast.error('Erreur lors du chargement des filières.', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    } else {
      setFilieres([]);
      setNiveauxScolaires([]);
      setModules([]);
      setSelectedModule('');
      setAbsencesModules([]);
    }
  };

  // Handle filière change
  const handleFiliereChange = (e) => {
    const selectedFiliereCode = e.target.value;
    if (selectedFiliereCode) {
      niveauEtude.getNiveauxScolairesByCodeFiliere(selectedFiliereCode).then((reponse) => {
        setNiveauxScolaires(reponse.data);
        setModules([]);
        setSelectedModule('');
        setAbsencesModules([]);
      }).catch((err) => {
        console.error('Error fetching niveaux scolaires:', err);
        toast.error('Erreur lors du chargement des niveaux scolaires.', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    } else {
      setNiveauxScolaires([]);
      setModules([]);
      setSelectedModule('');
      setAbsencesModules([]);
    }
  };

  // Handle niveau scolaire change
  const handleNiveauScolaireChange = (e) => {
    const selectedNiveauScolaireCode = e.target.value;
    if (selectedNiveauScolaireCode) {
      niveauEtude.getModulesByCodeNivSco(selectedNiveauScolaireCode).then((reponse) => {
        setModules(reponse.data);
        setSelectedModule('');
        setAbsencesModules([]);
      }).catch((err) => {
        console.error('Error fetching modules:', err);
        toast.error('Erreur lors du chargement des modules.', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    } else {
      setModules([]);
      setSelectedModule('');
      setAbsencesModules([]);
    }
  };

  // Handle module change
  const handleModuleChangeSelectionee = (e) => {
    const selectedModuleCode = e.target.value;
    setSelectedModule(selectedModuleCode);
    setCurrentPage(1);
  };

  // Load absences
  useEffect(() => {
    if (selectedModule) {
      noteService.getAllAbsences().then((reponse) => {
        const allAbsences = reponse.data;
        const filteredAbsences = allAbsences.filter(
          (absence) => absence.module.codeMod === selectedModule
        );
        setAbsencesModules(filteredAbsences);
        setInitialAbsencesModules(filteredAbsences);

        const newAbsencesValues = {};
        for (const absence of filteredAbsences) {
          const absenceKey = `${absence.etudiant.cin},${absence.module.codeMod}`;
          newAbsencesValues[absenceKey] = {
            nbAbsences: absence.nbAbsences || 0,
            nbRetards: absence.nbRetards || 0,
          };
        }
        setAbsencesValues(newAbsencesValues);
      }).catch((err) => {
        console.error('Error fetching absences:', err);
        toast.error('Erreur lors du chargement des absences.', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    }
  }, [selectedModule]);

  // Handle absence change
  const handleAbsenceChange = (event, cin, codeMod, columnName) => {
    const value = event.target.value;
    const newAbsencesValues = { ...absencesValues };
    newAbsencesValues[`${cin},${codeMod}`][columnName] = value;
    setAbsencesValues(newAbsencesValues);

    const absenceUpdate = { ...newAbsencesValues[`${cin},${codeMod}`] };
    noteService.updateAbsenceValue(cin, codeMod, absenceUpdate).then(() => {
      noteService.getAbsencesByCinAndCodeMod(cin, codeMod).then((reponse) => {
        setAbsencesModules((prev) =>
          prev.map((absence) =>
            absence.etudiant.cin === cin && absence.module.codeMod === codeMod
              ? reponse.data
              : absence
          )
        );
        toast.success('Absence mise à jour avec succès !', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    }).catch((err) => {
      console.error('Error updating absence:', err);
      toast.error('Erreur lors de la mise à jour de l\'absence.', {
        position: toast.POSITION.TOP_CENTER,
      });
    });
  };

  // Search
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = initialAbsencesModules.filter((absence) =>
      absence.etudiant.cin.toLowerCase().includes(term.toLowerCase())
    );
    setAbsencesModules(filtered);
    setCurrentPage(1);
  };

  // Reset search
  const reinitialiserPage = () => {
    setSearchTerm('');
    setAbsencesModules(initialAbsencesModules);
    setCurrentPage(1);
  };

  // Navigate back
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
          Gestion des Absences
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
          <div className="row">
            {[
              {
                label: 'Niveau',
                options: [
                  { value: '', label: 'Sélectionner un niveau' },
                  ...niveaux.map((niveau) => ({
                    value: niveau.codeNiv,
                    label: niveau.designation,
                  })),
                ],
                onChange: handleNiveauChange,
              },
              {
                label: 'Filière',
                options: [
                  { value: '', label: 'Sélectionner une filière' },
                  ...filieres.map((filiere) => ({
                    value: filiere.codeFil,
                    label: filiere.designation,
                  })),
                ],
                onChange: handleFiliereChange,
              },
              {
                label: 'Niveau Scolaire',
                options: [
                  { value: '', label: 'Sélectionner un niveau scolaire' },
                  ...niveauxScolaires.map((niveauScolaire) => ({
                    value: niveauScolaire.codeNivSco,
                    label: niveauScolaire.designation,
                  })),
                ],
                onChange: handleNiveauScolaireChange,
              },
              {
                label: 'Module',
                options: [
                  { value: '', label: 'Sélectionner un module' },
                  ...modules.map((module) => ({
                    value: module.codeMod,
                    label: module.nomMod,
                  })),
                ],
                onChange: handleModuleChangeSelectionee,
              },
            ].map((field) => (
              <div className="col-lg-6 mb-3" key={field.label}>
                <FormGroup className="d-flex align-items-center">
                  <Form.Label
                    style={{
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      width: '30%',
                      marginBottom: 0,
                    }}
                  >
                    {field.label} :
                  </Form.Label>
                  <Form.Control
                    as="select"
                    onChange={field.onChange}
                    style={{
                      borderRadius: '8px',
                      border: '2px solid #4dabf7',
                      padding: '0.5rem',
                      fontSize: '0.9rem',
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                    onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                    aria-label={`Sélectionner ${field.label.toLowerCase()}`}
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Control>
                </FormGroup>
              </div>
            ))}
          </div>
        </div>

        {selectedModule && (
          <>
            <div
              className="mb-4 mt-4"
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
                  Rechercher par CIN :
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="search"
                  placeholder="Entrez le CIN de l'étudiant"
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
                  aria-label="Rechercher par CIN"
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
                    <th className="text-center">CIN</th>
                    <th className="text-center">Nom</th>
                    <th className="text-center">Prénom</th>
                    <th className="text-center">Niveau</th>
                    <th className="text-center">Filière</th>
                    <th className="text-center">Niveau Scolaire</th>
                    <th className="text-center">Module</th>
                    <th className="text-center" style={{ width: '10%' }}>
                      Nb Absences
                    </th>
                    <th className="text-center" style={{ width: '10%' }}>
                      Nb Retards
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedAbsences.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center" style={{ color: '#343a40' }}>
                        Aucune absence disponible pour ce module
                      </td>
                    </tr>
                  ) : (
                    displayedAbsences.map((absence) => (
                      <tr
                        key={`${absence.etudiant.cin},${absence.module.codeMod}`}
                        style={{
                          transition: 'background-color 0.3s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f9ff')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <td>{absence.etudiant.cin}</td>
                        <td>{absence.etudiant.nom}</td>
                        <td>{absence.etudiant.prenom}</td>
                        <td>{absence.module.niveauScolaire.filiere.niveau?.designation || 'N/A'}</td>
                        <td>{absence.module.niveauScolaire.filiere?.designation || 'N/A'}</td>
                        <td>{absence.module.niveauScolaire?.designation || 'N/A'}</td>
                        <td>{absence.module.nomMod}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            className="form-control"
                            value={
                              absencesValues[`${absence.etudiant.cin},${absence.module.codeMod}`]
                                ?.nbAbsences || ''
                            }
                            onChange={(event) =>
                              handleAbsenceChange(
                                event,
                                absence.etudiant.cin,
                                absence.module.codeMod,
                                'nbAbsences'
                              )
                            }
                            style={{
                              borderRadius: '8px',
                              border: '2px solid #4dabf7',
                              padding: '0.3rem',
                              fontSize: '0.9rem',
                              transition: 'border-color 0.3s ease',
                            }}
                            onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                            onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                            aria-label={`Nombre d'absences pour ${absence.etudiant.cin}`}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            className="form-control"
                            value={
                              absencesValues[`${absence.etudiant.cin},${absence.module.codeMod}`]
                                ?.nbRetards || ''
                            }
                            onChange={(event) =>
                              handleAbsenceChange(
                                event,
                                absence.etudiant.cin,
                                absence.module.codeMod,
                                'nbRetards'
                              )
                            }
                            style={{
                              borderRadius: '8px',
                              border: '2px solid #4dabf7',
                              padding: '0.3rem',
                              fontSize: '0.9rem',
                              transition: 'border-color 0.3s ease',
                            }}
                            onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                            onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                            aria-label={`Nombre de retards pour ${absence.etudiant.cin}`}
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
          </>
        )}
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

export default InterfaceGestionAbsencesRespo;