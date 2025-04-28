import React, { useState, useEffect, useCallback } from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import niveauEtude from '../../services/NiveauEtude';
import noteService from '../../services/NoteService';
import { Pagination } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function InterfaceGestionNotesAdmin() {
  const history = useHistory();
  const [notes, setNotes] = useState([]);
  const [notesModules, setNotesModules] = useState([]);
  const [notesValues, setNotesValues] = useState({});
  const [selectedSession, setSelectedSession] = useState('Normale');
  const [niveaux, setNiveaux] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [niveauxScolaires, setNiveauxScolaires] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [moyennes, setMoyennes] = useState([]);

  const nbControles = 2;
  const nbTps = 1;
  const nbExams = 1;
  const coeffControles = 0.25;
  const coeffTps = 0.25;
  const coeffExams = 0.5;

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(notesModules.length / itemsPerPage);
  const handlePageChange = (page) => setCurrentPage(page);
  const displayedNotes = notesModules.length !== 0 ? notesModules.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

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

  const handleSessionChange = (e) => {
    setSelectedSession(e.target.value);
  };

  // Calculate result
  const getResult = useCallback(
    (average) => {
      if (selectedSession === 'Normale') {
        if (average >= 0 && average < 5) return 'Non-Valider';
        if (average >= 5 && average < 10) return 'Rattrapage';
        if (average >= 10 && average <= 20) return 'Valider';
      } else if (selectedSession === 'Rattrapage') {
        if (average >= 0 && average < 7) return 'Non-Validé';
        if (average >= 7 && average <= 20) return 'Validé';
      }
      return '';
    },
    [selectedSession]
  );

  // Calculate average
  const calculateAverage = useCallback(() => {
    const newMoyennes = {};
    for (const note of notes) {
      const noteKey = `${note.etudiant.cin},${note.module.codeMod}`;
      let sumControles = 0;
      for (let i = 1; i <= nbControles; i++) {
        sumControles += parseFloat(notesValues[noteKey]?.[`ctrl_${i}`] || 0);
      }
      const moyControles = sumControles / nbControles;
      let sumTps = 0;
      for (let i = 1; i <= nbTps; i++) {
        sumTps += parseFloat(notesValues[noteKey]?.[`tp_${i}`] || 0);
      }
      const moyTps = sumTps / nbTps;
      let sumExams = 0;
      for (let i = 1; i <= nbExams; i++) {
        sumExams += parseFloat(notesValues[noteKey]?.[`exam_${i}`] || 0);
      }
      const moyExams = sumExams / nbExams;
      const moyEtudiant = coeffControles * moyControles + coeffTps * moyTps + coeffExams * moyExams;
      newMoyennes[noteKey] = isNaN(moyEtudiant) ? 0 : moyEtudiant.toFixed(2);

      if (!isNaN(moyEtudiant)) {
        if (selectedSession === 'Normale') {
          noteService.updateNoteNormaleMoyenne(note.etudiant.cin, note.module.codeMod, parseFloat(moyEtudiant), getResult(moyEtudiant));
        } else if (selectedSession === 'Rattrapage') {
          noteService.updateNoteRattrapageMoyenne(note.etudiant.cin, note.module.codeMod, parseFloat(moyEtudiant), getResult(moyEtudiant));
        }
      }
    }
    setMoyennes(newMoyennes);
  }, [notes, notesValues, selectedSession, getResult]);

  // Fetch and filter notes
  useEffect(() => {
    const notesPromise = selectedSession === 'Normale' ? noteService.getNotesNormale() : noteService.getNotesRattrapage();
    notesPromise.then((reponse) => {
      const allNotes = reponse.data;
      setNotes(allNotes);
      setNotesModules(allNotes.filter((note) => note.module.codeMod === selectedModule && note.session === selectedSession));

      const newNotesValues = {};
      for (const note of allNotes) {
        const noteKey = `${note.etudiant.cin},${note.module.codeMod}`;
        newNotesValues[noteKey] = {};
        for (let i = 1; i <= nbControles; i++) {
          newNotesValues[noteKey][`ctrl_${i}`] = note[`ctrl_${i}`] ?? '';
        }
        for (let i = 1; i <= nbTps; i++) {
          newNotesValues[noteKey][`tp_${i}`] = note[`tp_${i}`] ?? '';
        }
        for (let i = 1; i <= nbExams; i++) {
          newNotesValues[noteKey][`exam_${i}`] = note[`exam_${i}`] ?? '';
        }

        const moyEtudiant = moyennes[noteKey];
        const result = getResult(moyEtudiant);
        if (result === 'Rattrapage' && !note.etudiantDansNoteRattrapage) {
          noteService.addEtudiantToNoteRattrapage(note.etudiant.cin, note.module.codeMod).then(() => {
            note.etudiantDansNoteRattrapage = true;
          });
        }
      }
      setNotesValues(newNotesValues);
      calculateAverage();
    });
  }, [selectedSession, selectedModule, moyennes, calculateAverage, getResult]);

  // Handle note input changes
  const handleNoteChange = (event, cin, codeMod, columnName) => {
    noteService.removeNonRattrapageStudentsDansNoteRattrapage();
    const newNotesValues = { ...notesValues };
    newNotesValues[`${cin},${codeMod}`][columnName] = event.target.value;
    setNotesValues(newNotesValues);
    const noteUpdate = { ...newNotesValues[`${cin},${codeMod}`] };

    const updateNoteValue = selectedSession === 'Normale' ? noteService.updateNoteNormaleValue(cin, codeMod, noteUpdate) : noteService.updateNoteRattrapageValue(cin, codeMod, noteUpdate);
    const getNotesByCinAndCodeMod = selectedSession === 'Normale' ? noteService.getNotesNormaleByCinAndCodeMod(cin, codeMod) : noteService.getNotesRattrapageByCinAndCodeMod(cin, codeMod);

    updateNoteValue.then(() => {
      getNotesByCinAndCodeMod.then((reponse) => {
        setNotes(notes.map((note) => (note.etudiant.cin === cin && note.module.codeMod === codeMod ? reponse.data : note)));
      });
    });
  };

  const ctrlColumns = Array.from({ length: nbControles }, (_, i) => `ctrl_${i + 1}`);
  const tpColumns = Array.from({ length: nbTps }, (_, i) => `tp_${i + 1}`);
  const examColumns = Array.from({ length: nbExams }, (_, i) => `exam_${i + 1}`);
  const columns = [...ctrlColumns, ...tpColumns, ...examColumns];

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
            Gestion des Notes
          </h3>
          <div className="row mb-4">
            {[
              { label: 'Niveau', onChange: handleNiveauChange, options: [{ value: '', label: 'Sélectionner un niveau' }, ...niveaux.map((niveau) => ({ value: niveau.codeNiv, label: niveau.designation }))] },
              { label: 'Filière', onChange: handleFiliereChange, options: [{ value: '', label: 'Sélectionner une filière' }, ...filieres.map((filiere) => ({ value: filiere.codeFil, label: filiere.designation }))] },
              { label: 'Niveau Scolaire', onChange: handleNiveauScolaireChange, options: [{ value: '', label: 'Sélectionner un niveau scolaire' }, ...niveauxScolaires.map((niveauScolaire) => ({ value: niveauScolaire.codeNivSco, label: niveauScolaire.designation }))] },
              { label: 'Module', onChange: handleModuleChangeSelectionee, options: [{ value: '', label: 'Sélectionner un module' }, ...modules.map((module) => ({ value: module.codeMod, label: module.nomMod }))] },
              { label: 'Session', onChange: handleSessionChange, value: selectedSession, options: [{ value: 'Normale', label: 'Normale' }, { value: 'Rattrapage', label: 'Rattrapage' }] },
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
                      value={field.value}
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

          {selectedModule && notes.length !== 0 && (
            <div>
              {notesModules.length === 0 ? (
                <div className="text-center" style={{ color: '#343a40', fontWeight: '500' }}>
                  Aucune note disponible pour ce module et cette session.
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
                        <th className="text-center" colSpan="3">
                          Étudiant
                        </th>
                        {nbControles > 0 && (
                          <th className="text-center" colSpan={nbControles}>
                            Contrôles
                          </th>
                        )}
                        {nbTps > 0 && (
                          <th className="text-center" colSpan={nbTps}>
                            TPs
                          </th>
                        )}
                        {nbExams > 0 && (
                          <th className="text-center" colSpan={nbExams}>
                            Examens
                          </th>
                        )}
                        <th className="text-center" colSpan="2">
                          Résultat
                        </th>
                      </tr>
                      <tr>
                        <th className="text-center">CIN</th>
                        <th className="text-center">Nom</th>
                        <th className="text-center">Prénom</th>
                        {columns.map((column, index) => (
                          <th className="text-center" key={index}>
                            {column}
                          </th>
                        ))}
                        <th className="text-center">Moyenne</th>
                        <th className="text-center">Résultat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedNotes.map((note) => (
                        <tr
                          key={`${note.etudiant.cin},${note.module.codeMod}`}
                          style={{
                            transition: 'background-color 0.3s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(77, 171, 247, 0.1)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <td>{note.etudiant.cin}</td>
                          <td>{note.etudiant.nom}</td>
                          <td>{note.etudiant.prenom}</td>
                          {ctrlColumns.map((column, index) => (
                            <td key={index}>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="20"
                                className="form-control"
                                value={notesValues[`${note.etudiant.cin},${note.module.codeMod}`]?.[column] ?? ''}
                                onChange={(event) => handleNoteChange(event, note.etudiant.cin, note.module.codeMod, column)}
                                style={{
                                  borderRadius: '8px',
                                  border: '2px solid #4dabf7',
                                  padding: '0.5rem',
                                  fontSize: '0.9rem',
                                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                                onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                                aria-label={`Note contrôle ${index + 1}`}
                              />
                            </td>
                          ))}
                          {tpColumns.map((column, index) => (
                            <td key={index}>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="20"
                                className="form-control"
                                value={notesValues[`${note.etudiant.cin},${note.module.codeMod}`]?.[column] ?? ''}
                                onChange={(event) => handleNoteChange(event, note.etudiant.cin, note.module.codeMod, column)}
                                style={{
                                  borderRadius: '8px',
                                  border: '2px solid #4dabf7',
                                  padding: '0.5rem',
                                  fontSize: '0.9rem',
                                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                                onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                                aria-label={`Note TP ${index + 1}`}
                              />
                            </td>
                          ))}
                          {examColumns.map((column, index) => (
                            <td key={index}>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="20"
                                className="form-control"
                                value={notesValues[`${note.etudiant.cin},${note.module.codeMod}`]?.[column] ?? ''}
                                onChange={(event) => handleNoteChange(event, note.etudiant.cin, note.module.codeMod, column)}
                                style={{
                                  borderRadius: '8px',
                                  border: '2px solid #4dabf7',
                                  padding: '0.5rem',
                                  fontSize: '0.9rem',
                                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                                }}
                                onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                                onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                                aria-label={`Note examen ${index + 1}`}
                              />
                            </td>
                          ))}
                          <td>{moyennes[`${note.etudiant.cin},${note.module.codeMod}`]}</td>
                          <td>{getResult(moyennes[`${note.etudiant.cin},${note.module.codeMod}`])}</td>
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
            </div>
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

export default InterfaceGestionNotesAdmin;