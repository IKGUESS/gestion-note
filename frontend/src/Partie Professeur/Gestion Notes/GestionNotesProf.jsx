import React, { useState, useEffect, useCallback } from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import noteService from '../../services/NoteService';
import _ from 'lodash';
import { Pagination } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import professeurService from '../../components/Gestion Profs/ProfesseurService';
import HeaderProfesseur from '../../Header and Footer/HeaderProfesseur';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

function GestionNotesProf() {
  const history = useHistory();

  const [notesModules, setNotesModules] = useState([]);
  const [initialNotesModules, setInitialNotesModules] = useState([]);
  const [notesValues, setNotesValues] = useState({});
  const [moyennes, setMoyennes] = useState({});
  const [niveaux, setNiveaux] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [niveauxScolaires, setNiveauxScolaires] = useState([]);
  const [modules, setModules] = useState([]);
  const [sectionsOptions, setSectionsOptions] = useState([]);
  const [selectedSession, setSelectedSession] = useState('Normale');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const cinProfes = localStorage.getItem('cinProfesseur');

  const nbControles = 2;
  const nbTps = 1;
  const nbExams = 1;
  const coeffControles = 0.25;
  const coeffTps = 0.25;
  const coeffExams = 0.5;

  const ctrlColumns = Array.from({ length: nbControles }, (_, i) => `ctrl_${i + 1}`);
  const tpColumns = Array.from({ length: nbTps }, (_, i) => `tp_${i + 1}`);
  const examColumns = Array.from({ length: nbExams }, (_, i) => `exam_${i + 1}`);
  const columns = [...ctrlColumns, ...tpColumns, ...examColumns];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(notesModules.length / itemsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const displayedNotes = notesModules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Load niveaux and modules
  const [detailsModulesProf, setDetailsModulesProf] = useState([]);
  useEffect(() => {
    professeurService.getAllModulesByCINProf(cinProfes).then((reponse) => {
      const modulesProf = reponse.data;
      setDetailsModulesProf(modulesProf);
      const niveauxProf = modulesProf.map((detailsModule) => detailsModule.module.niveauScolaire.filiere.niveau);
      const uniqueNiveauxProf = _.uniqBy(niveauxProf, 'codeNiv');
      setNiveaux(uniqueNiveauxProf);
    }).catch((err) => {
      console.error('Error fetching modules:', err);
      toast.error('Erreur lors du chargement des modules.', {
        position: toast.POSITION.TOP_CENTER,
      });
    });
  }, [cinProfes]);

  // Handle niveau change
  const handleNiveauChange = (e) => {
    const selectedNiveauCode = e.target.value;
    if (selectedNiveauCode) {
      const filieresProf = detailsModulesProf
        .filter((detailsModule) => detailsModule.module.niveauScolaire.filiere.niveau.codeNiv === selectedNiveauCode)
        .map((detailsModule) => detailsModule.module.niveauScolaire.filiere);
      const uniqueFilieresProf = _.uniqBy(filieresProf, 'codeFil');
      setFilieres(uniqueFilieresProf);
      setNiveauxScolaires([]);
      setModules([]);
      setSectionsOptions([]);
      setSelectedModule('');
      setSelectedSection('');
      setNotesModules([]);
    } else {
      setFilieres([]);
      setNiveauxScolaires([]);
      setModules([]);
      setSectionsOptions([]);
      setSelectedModule('');
      setSelectedSection('');
      setNotesModules([]);
    }
  };

  // Handle filière change
  const handleFiliereChange = (e) => {
    const selectedFiliereCode = e.target.value;
    if (selectedFiliereCode) {
      const niveauScolaireProf = detailsModulesProf
        .filter((detailsModule) => detailsModule.module.niveauScolaire.filiere.codeFil === selectedFiliereCode)
        .map((detailsModule) => detailsModule.module.niveauScolaire);
      const uniqueNiveauScolaireProf = _.uniqBy(niveauScolaireProf, 'codeNivSco');
      setNiveauxScolaires(uniqueNiveauScolaireProf);
      setModules([]);
      setSectionsOptions([]);
      setSelectedModule('');
      setSelectedSection('');
      setNotesModules([]);
    } else {
      setNiveauxScolaires([]);
      setModules([]);
      setSectionsOptions([]);
      setSelectedModule('');
      setSelectedSection('');
      setNotesModules([]);
    }
  };

  // Handle niveau scolaire change
  const handleNiveauScolaireChange = (e) => {
    const selectedNiveauScolaireCode = e.target.value;
    if (selectedNiveauScolaireCode) {
      const modullesProf = detailsModulesProf
        .filter((detailsModule) => detailsModule.module.niveauScolaire.codeNivSco === selectedNiveauScolaireCode)
        .map((detailsModule) => detailsModule.module);
      const uniqueModullesProf = _.uniqBy(modullesProf, 'codeMod');
      setModules(uniqueModullesProf);

      const sectionsProf = detailsModulesProf
        .filter((detailsModule) => detailsModule.module.niveauScolaire.codeNivSco === selectedNiveauScolaireCode)
        .map((detailsModule) => detailsModule.section);
      const uniqueSectionsProf = _.uniqBy(sectionsProf, 'section');
      setSectionsOptions(uniqueSectionsProf);
      setSelectedModule('');
      setSelectedSection('');
      setNotesModules([]);
    } else {
      setModules([]);
      setSectionsOptions([]);
      setSelectedModule('');
      setSelectedSection('');
      setNotesModules([]);
    }
  };

  // Handle module change
  const handleModuleChangeSelectionee = (e) => {
    const selectedModuleCode = e.target.value;
    setSelectedModule(selectedModuleCode);
    setCurrentPage(1);
  };

  // Handle section change
  const handleSectionChange = (e) => {
    const selectedSectionValue = e.target.value;
    setSelectedSection(selectedSectionValue);
    setCurrentPage(1);
  };

  // Handle session change
  const handleSessionChange = (e) => {
    const selectedSession = e.target.value;
    setSelectedSession(selectedSession);
    setCurrentPage(1);
  };

  // Calculate result
  const getResult = useCallback((average) => {
    if (selectedSession === 'Normale') {
      if (average >= 0 && average < 5) return 'Non-Valider';
      if (average >= 5 && average < 10) return 'Rattrapage';
      if (average >= 10 && average <= 20) return 'Valider';
    } else if (selectedSession === 'Rattrapage') {
      if (average >= 0 && average < 7) return 'Non-Validé';
      if (average >= 7 && average <= 20) return 'Validé';
    }
    return '';
  }, [selectedSession]);

  // Calculate average
  const calculateAverage = useCallback(
    (cin, codeMod) => {
      const noteKey = `${cin},${codeMod}`;
      const note = notesValues[noteKey];
      if (!note) return;

      let sumControles = 0;
      let validControles = 0;
      for (let i = 1; i <= nbControles; i++) {
        const value = parseFloat(note[`ctrl_${i}`]);
        if (!isNaN(value) && value >= 0 && value <= 20) {
          sumControles += value;
          validControles++;
        }
      }
      const moyControles = validControles > 0 ? sumControles / validControles : 0;

      let sumTps = 0;
      let validTps = 0;
      for (let i = 1; i <= nbTps; i++) {
        const value = parseFloat(note[`tp_${i}`]);
        if (!isNaN(value) && value >= 0 && value <= 20) {
          sumTps += value;
          validTps++;
        }
      }
      const moyTps = validTps > 0 ? sumTps / validTps : 0;

      let sumExams = 0;
      let validExams = 0;
      for (let i = 1; i <= nbExams; i++) {
        const value = parseFloat(note[`exam_${i}`]);
        if (!isNaN(value) && value >= 0 && value <= 20) {
          sumExams += value;
          validExams++;
        }
      }
      const moyExams = validExams > 0 ? sumExams / validExams : 0;

      const moyEtudiant = coeffControles * moyControles + coeffTps * moyTps + coeffExams * moyExams;
      if (!isNaN(moyEtudiant)) {
        setMoyennes((prev) => ({ ...prev, [noteKey]: moyEtudiant.toFixed(2) }));

        const result = getResult(moyEtudiant);
        if (selectedSession === 'Normale') {
          noteService.updateNoteNormaleMoyenne(cin, codeMod, moyEtudiant, result).catch((err) => {
            console.error('Error updating normale moyenne:', err);
            toast.error('Erreur lors de la mise à jour de la moyenne normale.', {
              position: toast.POSITION.TOP_CENTER,
            });
          });

          if (result === 'Rattrapage') {
            noteService.addEtudiantToNoteRattrapage(cin, codeMod).catch((err) => {
              console.error('Error adding to rattrapage:', err);
              toast.error('Erreur lors de l\'ajout à la session de rattrapage.', {
                position: toast.POSITION.TOP_CENTER,
              });
            });
          } else {
            noteService.removeNonRattrapageStudentsDansNoteRattrapage(cin, codeMod).catch((err) => {
              console.error('Error removing from rattrapage:', err);
              toast.error('Erreur lors de la suppression de la session de rattrapage.', {
                position: toast.POSITION.TOP_CENTER,
              });
            });
          }
        } else if (selectedSession === 'Rattrapage') {
          noteService.updateNoteRattrapageMoyenne(cin, codeMod, moyEtudiant, result).catch((err) => {
            console.error('Error updating rattrapage moyenne:', err);
            toast.error('Erreur lors de la mise à jour de la moyenne de rattrapage.', {
              position: toast.POSITION.TOP_CENTER,
            });
          });
        }
      }
    },
    [selectedSession, getResult, notesValues, nbControles, nbTps, nbExams, coeffControles, coeffTps, coeffExams]
  );

  // Load notes
  useEffect(() => {
    if (selectedModule && selectedSection) {
      const notesPromise =
        selectedSession === 'Normale' ? noteService.getNotesNormale() : noteService.getNotesRattrapage();
      notesPromise.then((reponse) => {
        const allNotes = reponse.data;
        const filteredNotes = allNotes.filter(
          (note) => note.module.codeMod === selectedModule && note.etudiant.section === selectedSection
        );
        setNotesModules(filteredNotes);
        setInitialNotesModules(filteredNotes);

        const newNotesValues = {};
        for (const note of filteredNotes) {
          const noteKey = `${note.etudiant.cin},${note.module.codeMod}`;
          newNotesValues[noteKey] = {};
          for (let i = 1; i <= nbControles; i++) {
            newNotesValues[noteKey][`ctrl_${i}`] = note[`ctrl_${i}`] || '';
          }
          for (let i = 1; i <= nbTps; i++) {
            newNotesValues[noteKey][`tp_${i}`] = note[`tp_${i}`] || '';
          }
          for (let i = 1; i <= nbExams; i++) {
            newNotesValues[noteKey][`exam_${i}`] = note[`exam_${i}`] || '';
          }
        }
        setNotesValues(newNotesValues);
      }).catch((err) => {
        console.error('Error fetching notes:', err);
        toast.error('Erreur lors du chargement des notes.', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    }
  }, [selectedSession, selectedModule, selectedSection]);

  // Handle note change
  const handleNoteChange = (event, cin, codeMod, columnName) => {
    const value = event.target.value;
    if (value !== '' && (isNaN(value) || value < 0 || value > 20)) {
      toast.error('La note doit être un nombre entre 0 et 20.', {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    const newNotesValues = { ...notesValues };
    newNotesValues[`${cin},${codeMod}`][columnName] = value;
    setNotesValues(newNotesValues);

    const noteUpdate = { ...newNotesValues[`${cin},${codeMod}`] };
    const updateNoteValue =
      selectedSession === 'Normale'
        ? noteService.updateNoteNormaleValue(cin, codeMod, noteUpdate)
        : noteService.updateNoteRattrapageValue(cin, codeMod, noteUpdate);
    const getNotesByCinAndCodeMod =
      selectedSession === 'Normale'
        ? noteService.getNotesNormaleByCinAndCodeMod(cin, codeMod)
        : noteService.getNotesRattrapageByCinAndCodeMod(cin, codeMod);

    updateNoteValue
      .then(() => {
        getNotesByCinAndCodeMod.then((reponse) => {
          setNotesModules((prev) =>
            prev.map((note) =>
              note.etudiant.cin === cin && note.module.codeMod === codeMod ? reponse.data : note
            )
          );
          calculateAverage(cin, codeMod);
          toast.success('Note mise à jour avec succès !', {
            position: toast.POSITION.TOP_CENTER,
          });
        });
      })
      .catch((err) => {
        console.error('Error updating note:', err);
        toast.error('Erreur lors de la mise à jour de la note.', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  };

  // Search
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = initialNotesModules.filter((note) =>
      note.etudiant.cin.toLowerCase().includes(term.toLowerCase())
    );
    setNotesModules(filtered);
    setCurrentPage(1);
  };

  // Reset search
  const reinitialiserPage = () => {
    setSearchTerm('');
    setNotesModules(initialNotesModules);
    setCurrentPage(1);
  };

  // Navigate back
  const Retour = () => {
    history.replace('/interface-principale-professeur');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#e7f1ff',
        animation: 'fadeIn 1s ease-in',
      }}
    >
      <HeaderProfesseur />
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
          Gestion des Notes
        </h3>
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
          {[
            {
              label: 'Niveau',
              options: [{ value: '', label: 'Sélectionner un niveau' }, ...niveaux.map((niveau) => ({
                value: niveau.codeNiv,
                label: niveau.designation,
              }))],
              onChange: handleNiveauChange,
            },
            {
              label: 'Filière',
              options: [{ value: '', label: 'Sélectionner une filière' }, ...filieres.map((filiere) => ({
                value: filiere.codeFil,
                label: filiere.designation,
              }))],
              onChange: handleFiliereChange,
            },
            {
              label: 'Niveau Scolaire',
              options: [{ value: '', label: 'Sélectionner un niveau scolaire' }, ...niveauxScolaires.map((niveauScolaire) => ({
                value: niveauScolaire.codeNivSco,
                label: niveauScolaire.designation,
              }))],
              onChange: handleNiveauScolaireChange,
            },
            {
              label: 'Module',
              options: [{ value: '', label: 'Sélectionner un module' }, ...modules.map((module) => ({
                value: module.codeMod,
                label: module.nomMod,
              }))],
              onChange: handleModuleChangeSelectionee,
            },
            {
              label: 'Section',
              options: [{ value: '', label: 'Sélectionner une section' }, ...sectionsOptions.map((section) => ({
                value: section,
                label: section,
              }))],
              onChange: handleSectionChange,
              id: 'SelectorSection',
            },
            {
              label: 'Session',
              options: [
                { value: 'Normale', label: 'Normale' },
                { value: 'Rattrapage', label: 'Rattrapage' },
              ],
              onChange: handleSessionChange,
            },
          ].map((field) => (
            <div className="col-md-6 col-lg-4 mb-4" key={field.label}>
              <FormGroup className="d-flex align-items-center">
                <Form.Label
                  style={{
                    fontSize: '0.9rem',
                    color: '#343a40',
                    fontWeight: '500',
                    width: '40%',
                    marginBottom: 0,
                  }}
                >
                  {field.label} :
                </Form.Label>
                <Form.Control
                  as="select"
                  id={field.id}
                  value={field.label === 'Session' ? selectedSession : undefined}
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

        {selectedModule && selectedSection && (
          <>
            <div
              className="row justify-content-center mb-4 mt-4"
              style={{
                animation: 'slideIn 0.5s ease-in',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '10px',
                padding: '1rem',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                border: '2px solid #4dabf7',
              }}
            >
              <div className="col-md-8">
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
                      transition: 'border-color 0.3s ease',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                    onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                    aria-label="Rechercher par CIN"
                  />
                  <button
                    className="d-flex align-items-center justify-content-center"
                    onClick={reinitialiserPage}
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '2px solid #4dabf7',
                      borderRadius: '50%',
                      marginLeft: '1rem',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                      animation: 'pulse 2s infinite',
                      backdropFilter: 'blur(5px)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                      e.currentTarget.style.borderColor = '#1a91ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.borderColor = '#4dabf7';
                    }}
                    aria-label="Réinitialiser la recherche"
                  >
                    <span
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: '#343a40',
                        textAlign: 'center',
                      }}
                    >
                      Réinitialiser
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div
              className="row justify-content-center"
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
                    <th className="text-center" colSpan="3" scope="colgroup">
                      Étudiant
                    </th>
                    {nbControles > 0 && (
                      <th className="text-center" colSpan={nbControles} scope="colgroup">
                        Contrôles
                      </th>
                    )}
                    {nbTps > 0 && (
                      <th className="text-center" colSpan={nbTps} scope="colgroup">
                        TPs
                      </th>
                    )}
                    {nbExams > 0 && (
                      <th className="text-center" colSpan={nbExams} scope="colgroup">
                        Examens
                      </th>
                    )}
                    <th className="text-center" colSpan="2" scope="colgroup">
                      Résultat
                    </th>
                  </tr>
                  <tr
                    style={{
                      backgroundColor: '#4dabf7',
                      color: '#fff',
                      fontWeight: '500',
                    }}
                  >
                    <th className="text-center" scope="col">
                      CIN
                    </th>
                    <th className="text-center" scope="col">
                      Nom
                    </th>
                    <th className="text-center" scope="col">
                      Prénom
                    </th>
                    {columns.map((column) => (
                      <th className="text-center" key={column} scope="col">
                        {column.replace('ctrl_', 'Contrôle ').replace('tp_', 'TP ').replace('exam_', 'Examen ')}
                      </th>
                    ))}
                    <th className="text-center" scope="col">
                      Moyenne
                    </th>
                    <th className="text-center" scope="col">
                      Résultat
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedNotes.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 5} className="text-center" style={{ color: '#343a40' }}>
                        Aucune note disponible pour ce module et cette section
                      </td>
                    </tr>
                  ) : (
                    displayedNotes.map((note) => (
                      <tr
                        key={`${note.etudiant.cin},${note.module.codeMod}`}
                        style={{
                          transition: 'background-color 0.3s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f9ff')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <td>{note.etudiant.cin}</td>
                        <td>{note.etudiant.nom}</td>
                        <td>{note.etudiant.prenom}</td>
                        {columns.map((column) => (
                          <td key={column}>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="20"
                              className="form-control"
                              value={
                                notesValues[`${note.etudiant.cin},${note.module.codeMod}`]?.[column] || ''
                              }
                              onChange={(event) =>
                                handleNoteChange(event, note.etudiant.cin, note.module.codeMod, column)
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
                              aria-label={`${column.replace('ctrl_', 'Contrôle ').replace('tp_', 'TP ').replace('exam_', 'Examen ')} pour ${note.etudiant.cin}`}
                            />
                          </td>
                        ))}
                        <td>{moyennes[`${note.etudiant.cin},${note.module.codeMod}`] || 'N/A'}</td>
                        <td>
                          {getResult(moyennes[`${note.etudiant.cin},${note.module.codeMod}`]) || 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div
              className="row justify-content-center"
              style={{
                animation: 'slideIn 0.5s ease-in',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '10px',
                padding: '0.5rem',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                border: '2px solid #4dabf7',
                marginTop: '1rem',
              }}
            >
              <Pagination>
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid #4dabf7',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '0.5rem',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                    animation: 'pulse 2s infinite',
                    backdropFilter: 'blur(5px)',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => currentPage !== 1 && (e.currentTarget.style.borderColor = '#1a91ff')}
                  onMouseLeave={(e) => currentPage !== 1 && (e.currentTarget.style.borderColor = '#4dabf7')}
                  aria-label="Page précédente"
                >
                  <FaChevronLeft style={{ color: '#343a40' }} />
                </Pagination.Prev>
                {Array.from({ length: totalPages }, (_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                    style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: index + 1 === currentPage ? '#4dabf7' : 'rgba(255, 255, 255, 0.9)',
                      border: '2px solid #4dabf7',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 0.2rem',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                      animation: index + 1 === currentPage ? 'none' : 'pulse 2s infinite',
                      backdropFilter: 'blur(5px)',
                      color: index + 1 === currentPage ? '#fff' : '#343a40',
                      cursor: 'pointer',
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
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
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
                    width: '60px',
                    height: '60px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid #4dabf7',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '0.5rem',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                    animation: 'pulse 2s infinite',
                    backdropFilter: 'blur(5px)',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => currentPage !== totalPages && (e.currentTarget.style.borderColor = '#1a91ff')}
                  onMouseLeave={(e) => currentPage !== totalPages && (e.currentTarget.style.borderColor = '#4dabf7')}
                  aria-label="Page suivante"
                >
                  <FaChevronRight style={{ color: '#343a40' }} />
                </Pagination.Next>
              </Pagination>
            </div>

            <div className="row justify-content-center mt-4">
              <div className="col-auto">
                <button
                  className="d-flex align-items-center justify-content-center"
                  onClick={Retour}
                  style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid #4dabf7',
                    borderRadius: '50%',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                    animation: 'pulse 2s infinite',
                    backdropFilter: 'blur(5px)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                    e.currentTarget.style.borderColor = '#1a91ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.borderColor = '#4dabf7';
                  }}
                  aria-label="Retour à l'interface principale"
                >
                  <span
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: '#343a40',
                      textAlign: 'center',
                    }}
                  >
                    Retour
                  </span>
                </button>
              </div>
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

export default GestionNotesProf;