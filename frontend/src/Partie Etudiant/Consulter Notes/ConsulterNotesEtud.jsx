import React, { useState, useEffect, useCallback } from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import niveauEtude from '../../services/NiveauEtude';
import noteService from '../../services/NoteService';
import etudiantService from '../../components/Gestion Etudiants/EtudiantService';
import HeaderEtudiant from '../../Header and Footer/HeaderEtudiant';
import FooterComponent from '../../Header and Footer/FooterComponent';
import { useHistory } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function ConsulterNotesEtud() {
  const history = useHistory();
  const [notes, setNotes] = useState([]);
  const [notesModules, setNotesModules] = useState([]);
  const [notesValues, setNotesValues] = useState({});
  const [selectedSession, setSelectedSession] = useState('Normale');
  const nbControles = 2;
  const nbTps = 1;
  const nbExams = 1;
  const coeffControles = 0.25;
  const coeffTps = 0.25;
  const coeffExams = 0.5;
  const [niveaux, setNiveaux] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [niveauxScolaires, setNiveauxScolaires] = useState([]);
  const [modules, setModules] = useState([]);
  const cinEtud = localStorage.getItem('cinEtudiant');
  const [selectedModule, setSelectedModule] = useState('');
  const [moyennes, setMoyennes] = useState({});

  useEffect(() => {
    etudiantService.getEtudiantById(cinEtud).then((reponse) => {
      const etudiant = reponse.data;
      setNiveaux([etudiant.filiere.niveau]);
      setFilieres([etudiant.filiere]);
    });
  }, [cinEtud]);

  const handleNiveauChange = (e) => {
    etudiantService.getEtudiantById(cinEtud).then((reponse) => {
      const etudiant = reponse.data;
      setFilieres([etudiant.filiere]);
      setNiveauxScolaires([]);
      setModules([]);
    });
  };

  const handleFiliereChange = (e) => {
    const selectedFiliereCode = e.target.value;
    if (selectedFiliereCode !== '') {
      niveauEtude.getNiveauxScolairesByCodeFiliere(selectedFiliereCode).then((reponse) => {
        setNiveauxScolaires(reponse.data);
      });
    }
  };

  const handleNiveauScolaireChange = (e) => {
    const selectedNiveauScolaireCode = e.target.value;
    if (selectedNiveauScolaireCode !== '') {
      niveauEtude.getModulesByCodeNivSco(selectedNiveauScolaireCode).then((reponse) => {
        setModules(reponse.data);
      });
    }
  };

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

  const calculateAverage = useCallback(() => {
    const newMoyennes = {};
    for (const note of notes) {
      const noteKey = `${note.etudiant.cin},${note.module.codeMod}`;
      let sumControles = 0;
      for (let i = 1; i <= nbControles; i++) {
        sumControles += parseFloat(notesValues[noteKey][`ctrl_${i}`]);
      }
      const moyControles = sumControles / nbControles;
      let sumTps = 0;
      for (let i = 1; i <= nbTps; i++) {
        sumTps += parseFloat(notesValues[noteKey][`tp_${i}`]);
      }
      const moyTps = sumTps / nbTps;
      let sumExams = 0;
      for (let i = 1; i <= nbExams; i++) {
        sumExams += parseFloat(notesValues[noteKey][`exam_${i}`]);
      }
      const moyExams = sumExams / nbExams;
      const moyEtudiant = coeffControles * moyControles + coeffTps * moyTps + coeffExams * moyExams;
      newMoyennes[noteKey] = moyEtudiant;

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

  const handleModuleChangeSelectionee = (e) => {
    const selectedModuleCode = e.target.value;
    setSelectedModule(selectedModuleCode);
  };

  useEffect(() => {
    let notesPromise;
    if (selectedSession === 'Normale') {
      notesPromise = noteService.getNotesNormale();
    } else if (selectedSession === 'Rattrapage') {
      notesPromise = noteService.getNotesRattrapage();
    }
    notesPromise.then((reponse) => {
      setNotes([]);
      setNotesModules([]);
      setNotes(reponse.data);
      setNotesModules(reponse.data.filter((note) => note.module.codeMod === selectedModule && note.session === selectedSession));

      const newNotesValues = {};
      for (const note of reponse.data) {
        const noteKey = `${note.etudiant.cin},${note.module.codeMod}`;
        newNotesValues[noteKey] = {};
        for (let i = 1; i <= nbControles; i++) {
          newNotesValues[noteKey][`ctrl_${i}`] = note[`ctrl_${i}`];
        }
        for (let i = 1; i <= nbTps; i++) {
          newNotesValues[noteKey][`tp_${i}`] = note[`tp_${i}`];
        }
        for (let i = 1; i <= nbExams; i++) {
          newNotesValues[noteKey][`exam_${i}`] = note[`exam_${i}`];
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

  const handleNoteChange = (event, cin, codeMod, columnName) => {
    noteService.removeNonRattrapageStudentsDansNoteRattrapage();
    const newNotesValues = { ...notesValues };
    newNotesValues[`${cin},${codeMod}`][columnName] = event.target.value;
    setNotesValues(newNotesValues);
    let noteUpdate = { ...newNotesValues[`${cin},${codeMod}`] };
    let updateNoteValue, getNotesByCinAndCodeMod;
    if (selectedSession === 'Normale') {
      updateNoteValue = noteService.updateNoteNormaleValue(cin, codeMod, noteUpdate);
      getNotesByCinAndCodeMod = noteService.getNotesNormaleByCinAndCodeMod(cin, codeMod);
    } else if (selectedSession === 'Rattrapage') {
      updateNoteValue = noteService.updateNoteRattrapageValue(cin, codeMod, noteUpdate);
      getNotesByCinAndCodeMod = noteService.getNotesRattrapageByCinAndCodeMod(cin, codeMod);
    }
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

  const handleSessionChange = (e) => {
    setSelectedSession(e.target.value);
  };

  const Retour = () => {
    history.replace('/interface-principale-etudiant');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#e7f1ff' }}>
      <HeaderEtudiant />
      <div className="container py-5">
        <h4 className="text-center mb-5" style={{ fontWeight: '600', color: '#343a40', fontSize: '1.8rem' }}>
          Consulter Notes - ENSA Béni Mellal
        </h4>
        <div className="row justify-content-center">
          {[
            { label: 'Choisir Niveau', id: 'niveau', options: niveaux, value: niveaux[0]?.codeNiv, onChange: handleNiveauChange },
            { label: 'Choisir Filière', id: 'filiere', options: filieres, value: filieres[0]?.codeFil, onChange: handleFiliereChange },
            { label: 'Choisir Niveau Scolaire', id: 'niveauScolaire', options: niveauxScolaires, onChange: handleNiveauScolaireChange },
            { label: 'Choisir Module', id: 'module', options: modules, onChange: handleModuleChangeSelectionee },
            { label: 'Choisir la Session', id: 'session', options: [{ value: 'Normale' }, { value: 'Rattrapage' }], value: selectedSession, onChange: handleSessionChange },
          ].map((field, index) => (
            <div
              key={field.id}
              className="col-12 col-sm-6 mb-4"
              style={{
                animation: `slideIn 0.5s ease-in`,
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both',
              }}
            >
              <FormGroup className="d-flex align-items-center">
                <Form.Label htmlFor={field.id} style={{ width: '40%', fontWeight: '500', color: '#343a40' }}>
                  {field.label} :
                </Form.Label>
                <Form.Control
                  as="select"
                  id={field.id}
                  value={field.value || ''}
                  onChange={field.onChange}
                  style={{
                    width: '60%',
                    border: '2px solid #4dabf7',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    animation: 'pulse 2s infinite',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1a91ff';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                    e.currentTarget.style.animation = 'none';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#4dabf7';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.animation = 'pulse 2s infinite';
                  }}
                  aria-describedby={`${field.id}-label`}
                >
                  <option className="text-center" value="">
                    Sélectionner {field.label.toLowerCase().split('choisir ')[1]}
                  </option>
                  {field.options.map((option) => (
                    <option key={option.codeNiv || option.codeFil || option.codeNivSco || option.codeMod || option.value} value={option.codeNiv || option.codeFil || option.codeNivSco || option.codeMod || option.value}>
                      {option.designation || option.nomMod || option.value}
                    </option>
                  ))}
                </Form.Control>
              </FormGroup>
            </div>
          ))}
        </div>
        {selectedModule && notesModules.length !== 0 && (
          <div
            className="row justify-content-center mb-4"
            style={{
              animation: `slideIn 0.5s ease-in`,
              animationDelay: '0.5s',
              animationFillMode: 'both',
            }}
          >
            <div className="col-12" style={{ overflowX: 'auto' }}>
              <table
                className="table table-striped table-bordered"
                style={{
                  border: '2px solid #4dabf7',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(5px)',
                }}
              >
                <thead>
                  <tr>
                    <th className="text-center" colSpan="3" scope="col">
                      Étudiant
                    </th>
                    {nbControles > 0 && (
                      <th className="text-center" colSpan={nbControles} scope="col">
                        Contrôles
                      </th>
                    )}
                    {nbTps > 0 && (
                      <th className="text-center" colSpan={nbTps} scope="col">
                        TPs
                      </th>
                    )}
                    {nbExams > 0 && (
                      <th className="text-center" colSpan={nbExams} scope="col">
                        Examens
                      </th>
                    )}
                    <th className="text-center" colSpan="2" scope="col">
                      Résultat
                    </th>
                  </tr>
                  <tr>
                    <th className="text-center" scope="col">
                      CIN
                    </th>
                    <th className="text-center" scope="col">
                      Nom
                    </th>
                    <th className="text-center" scope="col">
                      Prénom
                    </th>
                    {columns.map((column, index) => (
                      <th className="text-center" key={index} scope="col">
                        {column}
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
                  {notesModules
                    .filter((note) => note.module.codeMod === selectedModule && note.session === selectedSession && note.etudiant.cin === cinEtud)
                    .map((note) => (
                      <tr key={note.etudiant.cin}>
                        <td>{note.etudiant.cin}</td>
                        <td>{note.etudiant.nom}</td>
                        <td>{note.etudiant.prenom}</td>
                        {ctrlColumns.map((column, index) => (
                          <td key={index}>
                            <input
                              readOnly
                              type="number"
                              step="0.01"
                              min="0"
                              max="20"
                              style={{
                                width: '100%',
                                border: '2px solid #4dabf7',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                textAlign: 'center',
                                padding: '0.25rem',
                                transition: 'border-color 0.3s ease',
                              }}
                              value={notesValues[`${note.etudiant.cin},${note.module.codeMod}`]?.[column] !== undefined ? notesValues[`${note.etudiant.cin},${note.module.codeMod}`][column] : ''}
                              onChange={(event) => handleNoteChange(event, note.etudiant.cin, note.module.codeMod, column)}
                              aria-describedby={`${column}-label`}
                            />
                          </td>
                        ))}
                        {tpColumns.map((column, index) => (
                          <td key={index}>
                            <input
                              readOnly
                              type="number"
                              step="0.01"
                              min="0"
                              max="20"
                              style={{
                                width: '100%',
                                border: '2px solid #4dabf7',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                textAlign: 'center',
                                padding: '0.25rem',
                                transition: 'border-color 0.3s ease',
                              }}
                              value={notesValues[`${note.etudiant.cin},${note.module.codeMod}`]?.[column] !== undefined ? notesValues[`${note.etudiant.cin},${note.module.codeMod}`][column] : ''}
                              onChange={(event) => handleNoteChange(event, note.etudiant.cin, note.module.codeMod, column)}
                              aria-describedby={`${column}-label`}
                            />
                          </td>
                        ))}
                        {examColumns.map((column, index) => (
                          <td key={index}>
                            <input
                              readOnly
                              type="number"
                              step="0.01"
                              min="0"
                              max="20"
                              style={{
                                width: '100%',
                                border: '2px solid #4dabf7',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                textAlign: 'center',
                                padding: '0.25rem',
                                transition: 'border-color 0.3s ease',
                              }}
                              value={notesValues[`${note.etudiant.cin},${note.module.codeMod}`]?.[column] !== undefined ? notesValues[`${note.etudiant.cin},${note.module.codeMod}`][column] : ''}
                              onChange={(event) => handleNoteChange(event, note.etudiant.cin, note.module.codeMod, column)}
                              aria-describedby={`${column}-label`}
                            />
                          </td>
                        ))}
                        <td>{moyennes[`${note.etudiant.cin},${note.module.codeMod}`]?.toFixed(2) || ''}</td>
                        <td>{getResult(moyennes[`${note.etudiant.cin},${note.module.codeMod}`])}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div
          className="row justify-content-center"
          style={{
            animation: `slideIn 0.5s ease-in`,
            animationDelay: '0.6s',
            animationFillMode: 'both',
          }}
        >
          <div className="col-12 col-sm-6 col-md-4">
            <button
              className="text-center d-flex flex-column align-items-center justify-content-center"
              style={{
                width: '140px',
                height: '100px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease',
                cursor: 'pointer',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid #4dabf7',
                animation: 'pulse 2s infinite',
                backdropFilter: 'blur(5px)',
                margin: '0 auto',
              }}
              onClick={Retour}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.borderColor = '#1a91ff';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                e.currentTarget.style.animation = 'none';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#4dabf7';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.animation = 'pulse 2s infinite';
              }}
              aria-label="Retour à l'interface principale"
            >
              <div style={{ fontSize: '1.8rem', color: '#343a40', marginBottom: '0.5rem' }}>
                <FaArrowLeft />
              </div>
              <span style={{ fontWeight: '500', color: '#343a40', fontSize: '0.85rem', lineHeight: '1.2' }}>
                Retour
              </span>
            </button>
          </div>
        </div>
      </div>
      <FooterComponent />
      <style>
        {`
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

export default ConsulterNotesEtud;