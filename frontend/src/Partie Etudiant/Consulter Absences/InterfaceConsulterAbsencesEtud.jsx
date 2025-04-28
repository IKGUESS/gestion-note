import React, { useState, useEffect } from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import niveauEtude from '../../services/NiveauEtude';
import noteService from '../../services/NoteService';
import etudiantService from '../../components/Gestion Etudiants/EtudiantService';
import HeaderEtudiant from '../../Header and Footer/HeaderEtudiant';
import FooterComponent from '../../Header and Footer/FooterComponent';
import { useHistory } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function InterfaceConsulterAbsencesEtud() {
  const history = useHistory();
  const [absences, setAbsences] = useState([]);
  const [absencesModules, setAbsencesModules] = useState([]);
  const [absencesValues, setAbsencesValues] = useState({});
  const [niveaux, setNiveaux] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [niveauxScolaires, setNiveauxScolaires] = useState([]);
  const [modules, setModules] = useState([]);
  const cinEtud = localStorage.getItem('cinEtudiant');
  const [selectedModule, setSelectedModule] = useState('');

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

  const handleModuleChangeSelectionee = (e) => {
    const selectedModuleCode = e.target.value;
    setSelectedModule(selectedModuleCode);
  };

  useEffect(() => {
    noteService.getAllAbsences().then((reponse) => {
      setAbsences([]);
      setAbsencesModules([]);
      setAbsences(reponse.data);
      setAbsencesModules(reponse.data.filter((absence) => absence.module.codeMod === selectedModule));

      const newAbsencesValues = {};
      for (const absence of reponse.data) {
        const absenceKey = `${absence.etudiant.cin},${absence.module.codeMod}`;
        newAbsencesValues[absenceKey] = {
          nbAbsences: absence.nbAbsences,
          nbRetards: absence.nbRetards,
        };
      }
      setAbsencesValues(newAbsencesValues);
    });
  }, [selectedModule]);

  const handleAbsenceChange = (event, cin, codeMod, columnName) => {
    const newAbsencesValues = { ...absencesValues };
    newAbsencesValues[`${cin},${codeMod}`][columnName] = event.target.value;
    setAbsencesValues(newAbsencesValues);
    let absenceUpdate = { ...newAbsencesValues[`${cin},${codeMod}`] };
    noteService.updateAbsenceValue(cin, codeMod, absenceUpdate).then(() => {
      noteService.getAbsencesByCinAndCodeMod(cin, codeMod).then((reponse) => {
        setAbsences(absences.map((absence) => (absence.etudiant.cin === cin && absence.module.codeMod === codeMod ? reponse.data : absence)));
      });
    });
  };

  const Retour = () => {
    history.replace('/interface-principale-etudiant');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#e7f1ff' }}>
      <HeaderEtudiant />
      <div className="container py-5">
        <h4 className="text-center mb-5" style={{ fontWeight: '600', color: '#343a40', fontSize: '1.8rem' }}>
          Consulter Absences - ENSA Béni Mellal
        </h4>
        <div className="row justify-content-center">
          {[
            { label: 'Choisir Niveau', id: 'niveau', options: niveaux, value: niveaux[0]?.codeNiv, onChange: handleNiveauChange },
            { label: 'Choisir Filière', id: 'filiere', options: filieres, value: filieres[0]?.codeFil, onChange: handleFiliereChange },
            { label: 'Choisir Niveau Scolaire', id: 'niveauScolaire', options: niveauxScolaires, onChange: handleNiveauScolaireChange },
            { label: 'Choisir Module', id: 'module', options: modules, onChange: handleModuleChangeSelectionee },
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
                    <option
                      key={option.codeNiv || option.codeFil || option.codeNivSco || option.codeMod}
                      value={option.codeNiv || option.codeFil || option.codeNivSco || option.codeMod}
                    >
                      {option.designation || option.nomMod}
                    </option>
                  ))}
                </Form.Control>
              </FormGroup>
            </div>
          ))}
        </div>
        {selectedModule && absencesModules.length !== 0 && (
          <div
            className="row justify-content-center mb-4"
            style={{
              animation: `slideIn 0.5s ease-in`,
              animationDelay: '0.4s',
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
                    <th className="text-center" scope="col">
                      CIN
                    </th>
                    <th className="text-center" scope="col">
                      Nom
                    </th>
                    <th className="text-center" scope="col">
                      Prénom
                    </th>
                    <th className="text-center" scope="col">
                      Niveau
                    </th>
                    <th className="text-center" scope="col">
                      Filière
                    </th>
                    <th className="text-center" scope="col">
                      Niveau Scolaire
                    </th>
                    <th className="text-center" scope="col">
                      Module
                    </th>
                    <th className="text-center" scope="col">
                      Nombre d’Absences
                    </th>
                    <th className="text-center" scope="col">
                      Nombre de Retards
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {absencesModules
                    .filter((absence) => absence.module.codeMod === selectedModule && absence.etudiant.cin === cinEtud)
                    .map((absence) => (
                      <tr key={absence.etudiant.cin}>
                        <td>{absence.etudiant.cin}</td>
                        <td>{absence.etudiant.nom}</td>
                        <td>{absence.etudiant.prenom}</td>
                        <td>{absence.module.niveauScolaire.filiere.niveau.designation}</td>
                        <td>{absence.module.niveauScolaire.filiere.designation}</td>
                        <td>{absence.module.niveauScolaire.designation}</td>
                        <td>{absence.module.nomMod}</td>
                        <td>
                          <input
                            readOnly
                            type="number"
                            min="0"
                            style={{
                              width: '100%',
                              border: '2px solid #4dabf7',
                              borderRadius: '8px',
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              textAlign: 'center',
                              padding: '0.25rem',
                              transition: 'border-color 0.3s ease',
                            }}
                            value={
                              absencesValues[`${absence.etudiant.cin},${absence.module.codeMod}`]?.nbAbsences !== undefined
                                ? absencesValues[`${absence.etudiant.cin},${absence.module.codeMod}`].nbAbsences
                                : ''
                            }
                            onChange={(event) => handleAbsenceChange(event, absence.etudiant.cin, absence.module.codeMod, 'nbAbsences')}
                            aria-describedby="nbAbsences-label"
                          />
                        </td>
                        <td>
                          <input
                            readOnly
                            type="number"
                            min="0"
                            style={{
                              width: '100%',
                              border: '2px solid #4dabf7',
                              borderRadius: '8px',
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              textAlign: 'center',
                              padding: '0.25rem',
                              transition: 'border-color 0.3s ease',
                            }}
                            value={
                              absencesValues[`${absence.etudiant.cin},${absence.module.codeMod}`]?.nbRetards !== undefined
                                ? absencesValues[`${absence.etudiant.cin},${absence.module.codeMod}`].nbRetards
                                : ''
                            }
                            onChange={(event) => handleAbsenceChange(event, absence.etudiant.cin, absence.module.codeMod, 'nbRetards')}
                            aria-describedby="nbRetards-label"
                          />
                        </td>
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
            animationDelay: '0.5s',
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

export default InterfaceConsulterAbsencesEtud;