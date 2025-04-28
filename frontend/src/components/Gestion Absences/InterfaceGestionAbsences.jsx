import React, { useState, useEffect } from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import niveauEtude from '../../services/NiveauEtude';
import noteService from '../../services/NoteService';
import { Pagination } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function InterfaceGestionAbsences() {
  const history = useHistory();
  const [absences, setAbsences] = useState([]);
  const [absencesModules, setAbsencesModules] = useState([]);
  const [absencesValues, setAbsencesValues] = useState({});
  const [niveaux, setNiveaux] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [niveauxScolaires, setNiveauxScolaires] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(absencesModules.length / itemsPerPage);
  const handlePageChange = (page) => setCurrentPage(page);
  const displayedAbsences = absencesModules.length !== 0 ? absencesModules.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

  // Fetch niveaux on mount
  useEffect(() => {
    niveauEtude.getNiveaux().then((reponse) => {
      setNiveaux(reponse.data);
    });
  }, []);

  // Dropdown handlers
  const handleNiveauChange = (e) => {
    const selectedNiveauCode = e.target.value;
    niveauEtude.getFilieresByCodeNiveau(selectedNiveauCode).then((reponse) => {
      setFilieres(reponse.data);
      setNiveauxScolaires([]);
      setModules([]);
      setSelectedModule('');
    });
  };

  const handleFiliereChange = (e) => {
    const selectedFiliereCode = e.target.value;
    niveauEtude.getNiveauxScolairesByCodeFiliere(selectedFiliereCode).then((reponse) => {
      setNiveauxScolaires(reponse.data);
      setModules([]);
      setSelectedModule('');
    });
  };

  const handleNiveauScolaireChange = (e) => {
    const selectedNiveauScolaireCode = e.target.value;
    niveauEtude.getModulesByCodeNivSco(selectedNiveauScolaireCode).then((reponse) => {
      setModules(reponse.data);
      setSelectedModule('');
    });
  };

  const handleModuleChangeSelectionee = (e) => {
    setSelectedModule(e.target.value);
  };

  // Fetch and filter absences
  useEffect(() => {
    noteService.getAllAbsences().then((reponse) => {
      const allAbsences = reponse.data;
      setAbsences(allAbsences);
      const filteredAbsences = selectedModule ? allAbsences.filter((absence) => absence.module.codeMod === selectedModule) : allAbsences;
      setAbsencesModules(filteredAbsences);

      const newAbsencesValues = {};
      for (const absence of allAbsences) {
        const absenceKey = `${absence.etudiant.cin},${absence.module.codeMod}`;
        newAbsencesValues[absenceKey] = {
          nbAbsences: absence.nbAbsences || 0,
          nbRetards: absence.nbRetards || 0,
        };
      }
      setAbsencesValues(newAbsencesValues);
    });
  }, [selectedModule]);

  // Handle absence input changes
  const handleAbsenceChange = (event, cin, codeMod, columnName) => {
    const newAbsencesValues = { ...absencesValues };
    newAbsencesValues[`${cin},${codeMod}`][columnName] = event.target.value;
    setAbsencesValues(newAbsencesValues);

    const absenceUpdate = { ...newAbsencesValues[`${cin},${codeMod}`] };
    noteService.updateAbsenceValue(cin, codeMod, absenceUpdate).then(() => {
      noteService.getAbsencesByCinAndCodeMod(cin, codeMod).then((reponse) => {
        setAbsences(absences.map((absence) => (absence.etudiant.cin === cin && absence.module.codeMod === codeMod ? reponse.data : absence)));
      });
    });
  };

  // Search functionality
  const handleSearch = (event) => {
    const term = event ? event.target.value : searchTerm;
    setSearchTerm(term);
    const results = absences.filter((absence) => absence.etudiant.cin.toLowerCase().includes(term.toLowerCase()));
    setAbsencesModules(selectedModule ? results.filter((absence) => absence.module.codeMod === selectedModule) : results);
    setCurrentPage(1);
  };

  // Reset and navigation
  const reinitialiserPage = () => {
    window.location.href = '/gestion-absences';
  };

  const Retour = () => {
    history.replace('/interface-admin');
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
        <div
          className="row justify-content-center"
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
            Gestion des Absences
          </h3>
          <div className="row mb-4">
            {[
              { label: 'Niveau', onChange: handleNiveauChange, options: [{ value: '', label: 'Sélectionner un niveau' }, ...niveaux.map((niveau) => ({ value: niveau.codeNiv, label: niveau.designation }))] },
              { label: 'Filière', onChange: handleFiliereChange, options: [{ value: '', label: 'Sélectionner une filière' }, ...filieres.map((filiere) => ({ value: filiere.codeFil, label: filiere.designation }))] },
              { label: 'Niveau Scolaire', onChange: handleNiveauScolaireChange, options: [{ value: '', label: 'Sélectionner un niveau scolaire' }, ...niveauxScolaires.map((niveauScolaire) => ({ value: niveauScolaire.codeNivSco, label: niveauScolaire.designation }))] },
              { label: 'Module', onChange: handleModuleChangeSelectionee, options: [{ value: '', label: 'Sélectionner un module' }, ...modules.map((module) => ({ value: module.codeMod, label: module.nomMod }))] },
            ].map((field) => (
              <div className="col-lg-6 mb-3" key={field.label}>
                <FormGroup className="row align-items-center">
                  <Form.Label
                    className="col-sm-4 col-form-label"
                    style={{
                      fontSize: '0.9rem',
                      color: '#343a40',
                      fontWeight: '500',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {field.label} :
                  </Form.Label>
                  <div className="col-sm-8">
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
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Form.Control>
                  </div>
                </FormGroup>
              </div>
            ))}
          </div>

          {selectedModule && (
            <>
              <div className="form-group row mb-4">
                <label
                  className="col-sm-2 col-form-label"
                  style={{
                    fontSize: '0.9rem',
                    color: '#343a40',
                    fontWeight: '500',
                    transition: 'color 0.3s ease',
                  }}
                >
                  CIN :
                </label>
                <div className="col-sm-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Entrez CIN"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                      borderRadius: '8px',
                      border: '2px solid #4dabf7',
                      padding: '0.5rem',
                      fontSize: '0.9rem',
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                    onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                    aria-label="Rechercher par CIN"
                  />
                </div>
                <div className="col-sm-4">
                  <button
                    className="btn"
                    onClick={() => handleSearch()}
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
                    aria-label="Rechercher absences"
                  >
                    Rechercher
                  </button>
                  <button
                    className="btn"
                    onClick={reinitialiserPage}
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
                    aria-label="Réinitialiser recherche"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>

              {absencesModules.length === 0 ? (
                <div className="text-center" style={{ color: '#343a40', fontWeight: '500' }}>
                  Aucune absence disponible pour ce module.
                </div>
              ) : (
                <div className="table-responsive">
                  <table
                    className="table table-striped table-bordered"
                    style={{
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(5px)',
                    }}
                  >
                    <thead
                      style={{
                        backgroundColor: '#4dabf7',
                        color: '#fff',
                        fontWeight: '600',
                      }}
                    >
                      <tr>
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
                      {displayedAbsences.map((absence) => (
                        <tr
                          key={`${absence.etudiant.cin},${absence.module.codeMod}`}
                          style={{
                            transition: 'background-color 0.3s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(77, 171, 247, 0.1)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <td>{absence.etudiant.cin}</td>
                          <td>{absence.etudiant.nom}</td>
                          <td>{absence.etudiant.prenom}</td>
                          <td>{absence.module.niveauScolaire.filiere.niveau.designation}</td>
                          <td>{absence.module.niveauScolaire.filiere.designation}</td>
                          <td>{absence.module.niveauScolaire.designation}</td>
                          <td>{absence.module.nomMod}</td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              className="form-control"
                              value={absencesValues[`${absence.etudiant.cin},${absence.module.codeMod}`]?.nbAbsences ?? ''}
                              onChange={(event) => handleAbsenceChange(event, absence.etudiant.cin, absence.module.codeMod, 'nbAbsences')}
                              style={{
                                borderRadius: '8px',
                                border: '2px solid #4dabf7',
                                padding: '0.5rem',
                                fontSize: '0.9rem',
                                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                              }}
                              onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                              onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                              aria-label="Nombre d'absences"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              className="form-control"
                              value={absencesValues[`${absence.etudiant.cin},${absence.module.codeMod}`]?.nbRetards ?? ''}
                              onChange={(event) => handleAbsenceChange(event, absence.etudiant.cin, absence.module.codeMod, 'nbRetards')}
                              style={{
                                borderRadius: '8px',
                                border: '2px solid #4dabf7',
                                padding: '0.5rem',
                                fontSize: '0.9rem',
                                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                              }}
                              onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                              onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                              aria-label="Nombre de retards"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center mt-4">
                <Pagination>
                  <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    style={{
                      border: '2px solid #4dabf7',
                      borderRadius: '8px',
                      marginRight: '0.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#343a40',
                      transition: 'border-color 0.3s ease, background-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#1a91ff';
                      e.currentTarget.style.backgroundColor = 'rgba(77, 171, 247, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#4dabf7';
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    }}
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
                        margin: '0 0.25rem',
                        backgroundColor: index + 1 === currentPage ? '#4dabf7' : 'rgba(255, 255, 255, 0.9)',
                        color: index + 1 === currentPage ? '#fff' : '#343a40',
                        transition: 'border-color 0.3s ease, background-color 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (index + 1 !== currentPage) {
                          e.currentTarget.style.borderColor = '#1a91ff';
                          e.currentTarget.style.backgroundColor = 'rgba(77, 171, 247, 0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (index + 1 !== currentPage) {
                          e.currentTarget.style.borderColor = '#4dabf7';
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
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
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#343a40',
                      transition: 'border-color 0.3s ease, background-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#1a91ff';
                      e.currentTarget.style.backgroundColor = 'rgba(77, 171, 247, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#4dabf7';
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    }}
                  >
                    <FaChevronRight />
                  </Pagination.Next>
                </Pagination>
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
                  aria-label="Retour à l'interface admin"
                >
                  Retour
                </button>
              </div>
            </>
          )}
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
          .table th, .table td {
            vertical-align: middle;
            padding: 0.75rem;
            font-size: 0.9rem;
          }
          .table thead th {
            border: none;
          }
        `}
      </style>
    </div>
  );
}

export default InterfaceGestionAbsences;