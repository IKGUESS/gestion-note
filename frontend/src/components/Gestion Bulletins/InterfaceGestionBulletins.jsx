import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import noteService from '../../services/NoteService';
import etudiantService from '../../services/EtudiantService';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import iconImprimerPDF from '../../components/images/imprimerPDF_icon.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const InterfaceGestionBulletins = (props) => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [notes, setNotes] = useState([]);
  const [etudiantsMemeFiliere, setEtudiantsMemeFiliere] = useState([]);
  const [notesTousEtud, setNotesTousEtud] = useState([]);
  const [niveauScoDesignation, setNiveauScoDesignation] = useState([]);
  const [moyenneAnnee, setMoyenneAnnee] = useState(null);
  const [classement, setClassement] = useState(null);
  const [noteMajorante, setNoteMajorante] = useState(null);
  const [noteMinorante, setNoteMinorante] = useState(null);
  const [moyennePromotion, setMoyennePromotion] = useState(null);

  const cinEtud = props.match.params.CinStudent;

  // Calcul des moyennes et classements
  const calculateMoyenneAnnee = (studentCIN, year) => {
    const filteredNotes = notes.filter(
      (note) => note.etudiant.cin === studentCIN && note.module.niveauScolaire.designation === year
    );
    const sum = filteredNotes.reduce((total, note) => total + note.moyenne, 0);
    return sum / filteredNotes.length;
  };

  const calculateMoyenneAnneeTousEtud = (studentCIN, year) => {
    const filteredNotes = notesTousEtud.filter(
      (note) => note.etudiant.cin === studentCIN && note.module.niveauScolaire.designation === year
    );
    const sum = filteredNotes.reduce((total, note) => total + note.moyenne, 0);
    return sum / filteredNotes.length;
  };

  const calculateClassement = (year) => {
    const moyennes = etudiantsMemeFiliere.map((etudiant) => {
      const average = calculateMoyenneAnneeTousEtud(etudiant.cin, year);
      return { etudiant, moyenneAnnee: average };
    });

    const sorted = moyennes.sort((a, b) => b.moyenneAnnee - a.moyenneAnnee);
    setNoteMajorante(Math.max(...moyennes.map(note => note.moyenneAnnee)));
    setNoteMinorante(Math.min(...moyennes.map(note => note.moyenneAnnee)));
    setMoyennePromotion(sorted.reduce((total, etudiant) => total + etudiant.moyenneAnnee, 0) / sorted.length);

    return sorted;
  };

  // Effets pour charger les données
  useEffect(() => {
    noteService.getNotesNormale().then((reponse) => {
      setNotesTousEtud(reponse.data);
    });
  }, [selectedYear]);

  useEffect(() => {
    noteService.getNotesNormaleByCinEtu(cinEtud).then((reponse) => {
      const notesData = reponse.data;
      setNotes(notesData);
      
      const niveauDesignations = notesData.map((note) => note.module.niveauScolaire.designation);
      setNiveauScoDesignation(niveauDesignations);

      const codeFili = notesData.length > 0 ? notesData[0].module.niveauScolaire.filiere.codeFil : null;
      etudiantService.getAllEtudiantsByCodeFil(codeFili).then((reponse) => {
        setEtudiantsMemeFiliere(reponse.data);
      });
    });
  }, [selectedYear, classement, cinEtud]);

  // Gestion des événements
  const handleYearButtonClick = (year) => {
    setSelectedYear(year);
    const average = calculateMoyenneAnnee(cinEtud, year);
    setMoyenneAnnee(average);
    setClassement(calculateClassement(year));
  };

  const getResultat = (moyenne) => {
    return moyenne >= 10 ? 'Valider' : 'Non-Valider';
  };

  // Rendu des composants
  const renderResultsTable = () => {
    if (!selectedYear) return null;

    return (
      <Table bordered striped hover style={{ backgroundColor: 'white' }}>
        <thead style={{ backgroundColor: '#4dabf7', color: 'white' }}>
          <tr>
            <th>Module</th>
            <th>Résultat</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {notes.filter(note => note.module.niveauScolaire.designation === selectedYear)
            .map((note) => (
              <tr key={note.etudiant.cin}>
                <td>{note.module.nomMod}</td>
                <td>{note.resultat}</td>
                <td>{note.moyenne}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    );
  };

  const renderYearAnnouncement = (year) => {
    return (
      <div style={{ 
        textAlign: 'center', 
        fontWeight: 'bold', 
        fontSize: '17px', 
        border: '2px solid #4dabf7',
        borderRadius: '8px',
        padding: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(5px)'
      }}>
        Les relevés de notes de la {year}
        <img 
          src={iconImprimerPDF} 
          style={{ marginLeft: '30px', width: '25px', cursor: 'pointer' }} 
          alt="Imprimer PDF"
          onClick={() => console.log('Impression PDF')}
        />
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e7f1ff' }}>
      <HeaderAdmin />
      <div className="container py-4">
        <h3 className="text-center mb-4" style={{
          fontWeight: '600',
          background: 'linear-gradient(90deg, #4dabf7, #1a91ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Gestion des Bulletins de Notes
        </h3>

        <div className="row">
          <div className="col-md-3">
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '10px',
              padding: '15px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              border: '2px solid #4dabf7'
            }}>
              <Table borderless>
                <tbody>
                  <tr>
                    <td><strong>Nom :</strong></td>
                    <td>{notes[0]?.etudiant.nom}</td>
                  </tr>
                  <tr>
                    <td><strong>Prénom :</strong></td>
                    <td>{notes[0]?.etudiant.prenom}</td>
                  </tr>
                  <tr>
                    <td><strong>CIN :</strong></td>
                    <td>{notes[0]?.etudiant.cin}</td>
                  </tr>
                  <tr>
                    <td><strong>Niveau :</strong></td>
                    <td>{notes[0]?.module.niveauScolaire.filiere.niveau.designation}</td>
                  </tr>
                  <tr>
                    <td><strong>Filière :</strong></td>
                    <td>{notes[0]?.module.niveauScolaire.filiere.designation}</td>
                  </tr>
                </tbody>
              </Table>
            </div>

            <div className="mt-3">
              <Button 
                variant="outline-primary" 
                className='w-100 mb-2'
                onClick={() => handleYearButtonClick('1ère année')}
                style={{
                  border: '2px solid #4dabf7',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                1ère année
              </Button>
              
              {niveauScoDesignation.includes('2ème année') && (
                <Button 
                  variant="outline-primary" 
                  className='w-100'
                  onClick={() => handleYearButtonClick('2ème année')}
                  style={{
                    border: '2px solid #4dabf7',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                >
                  2ème année
                </Button>
              )}
            </div>
          </div>

          <div className="col-md-9">
            {selectedYear && renderYearAnnouncement(selectedYear)}
            
            <div className="mt-3">
              {renderResultsTable()}
            </div>

            {selectedYear && (
              <>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  border: '2px solid #4dabf7',
                  marginTop: '20px',
                  padding: '15px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>Moyenne d'année :</strong> 
                      <span style={{ color: '#1a91ff', marginLeft: '5px' }}>
                        {moyenneAnnee?.toFixed(3)}
                      </span>
                    </div>
                    <div>
                      <strong>Résultat :</strong> 
                      <span style={{ color: moyenneAnnee >= 10 ? '#28a745' : '#dc3545', marginLeft: '5px' }}>
                        {moyenneAnnee && getResultat(moyenneAnnee)}
                      </span>
                    </div>
                    <div>
                      <strong>Classement :</strong> 
                      {classement?.map((item, index) => (
                        item.etudiant.cin === cinEtud && (
                          <span style={{ color: '#1a91ff', marginLeft: '5px' }} key={index}>
                            {index + 1}
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  border: '2px solid #4dabf7',
                  marginTop: '10px',
                  padding: '15px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>Note majorante :</strong> 
                      <span style={{ color: '#28a745', marginLeft: '5px' }}>
                        {noteMajorante?.toFixed(3)}
                      </span>
                    </div>
                    <div>
                      <strong>Note minorante :</strong> 
                      <span style={{ color: '#dc3545', marginLeft: '5px' }}>
                        {noteMinorante?.toFixed(3)}
                      </span>
                    </div>
                    <div>
                      <strong>Moyenne promotion :</strong> 
                      <span style={{ color: '#1a91ff', marginLeft: '5px' }}>
                        {moyennePromotion?.toFixed(3)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterfaceGestionBulletins;