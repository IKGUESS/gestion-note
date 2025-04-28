import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import noteService from '../../services/NoteService';
import etudiantService from '../../services/EtudiantService';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import iconImprimerPDF from '../../components/images/imprimerPDF_icon.png';
import imgLogoEPG from '../images/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const InterfaceGestionBulletinsTest = (props) => {
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

  // Calcul des moyennes
  const calculateMoyenneAnnee = (studentCIN, year) => {
    const filteredNotes = notes.filter(
      note => note.etudiant.cin === studentCIN && note.module.niveauScolaire.designation === year
    );
    const sum = filteredNotes.reduce((total, note) => total + note.moyenne, 0);
    return sum / filteredNotes.length;
  };

  const calculateMoyenneAnneeTousEtud = (studentCIN, year) => {
    const filteredNotes = notesTousEtud.filter(
      note => note.etudiant.cin === studentCIN && note.module.niveauScolaire.designation === year
    );
    const sum = filteredNotes.reduce((total, note) => total + note.moyenne, 0);
    return sum / filteredNotes.length;
  };

  // Calcul du classement
  const calculateClassement = (year) => {
    const moyennes = etudiantsMemeFiliere.map(etudiant => ({
      etudiant,
      moyenneAnnee: calculateMoyenneAnneeTousEtud(etudiant.cin, year)
    }));

    const sorted = moyennes.sort((a, b) => b.moyenneAnnee - a.moyenneAnnee);
    setNoteMajorante(Math.max(...moyennes.map(note => note.moyenneAnnee)));
    setNoteMinorante(Math.min(...moyennes.map(note => note.moyenneAnnee)));
    setMoyennePromotion(sorted.reduce((total, etudiant) => total + etudiant.moyenneAnnee, 0) / sorted.length);

    return sorted;
  };

  // Chargement des données
  useEffect(() => {
    noteService.getNotesNormale().then(reponse => {
      setNotesTousEtud(reponse.data);
    });
  }, [selectedYear]);

  useEffect(() => {
    noteService.getNotesNormaleByCinEtu(cinEtud).then(reponse => {
      const notesData = reponse.data;
      setNotes(notesData);
      
      const niveauDesignations = notesData.map(note => note.module.niveauScolaire.designation);
      setNiveauScoDesignation(niveauDesignations);

      const codeFili = notesData[0]?.module.niveauScolaire.filiere.codeFil;
      if (codeFili) {
        etudiantService.getAllEtudiantsByCodeFil(codeFili).then(reponse => {
          setEtudiantsMemeFiliere(reponse.data);
        });
      }
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

  // Génération PDF pour une année spécifique
  const generatePDF = (year) => {
    const filteredNotes = notes.filter(
      note => note.etudiant.cin === cinEtud && note.module.niveauScolaire.designation === year
    );
    const moyenne = calculateMoyenneAnnee(cinEtud, year);

    const doc = new jsPDF();
    
    // En-tête
    doc.addImage(imgLogoEPG, "JPEG", 25, 0, 155, 35);
    doc.setFontSize(18);
    doc.text("RELEVE DE NOTES", 105, 50, "center");
    
    // Informations étudiant
    doc.setFontSize(13);
    doc.text(`M. (Mme) : ${filteredNotes[0]?.etudiant.nom} ${filteredNotes[0]?.etudiant.prenom}`, 30, 75);
    doc.text(`CIN : ${filteredNotes[0]?.etudiant.cin}`, 30, 83);
    doc.text(`Niveau : ${filteredNotes[0]?.module.niveauScolaire.filiere.niveau.designation}`, 30, 91);
    doc.text(`Filière : ${filteredNotes[0]?.module.niveauScolaire.filiere.designation}`, 30, 99);
    doc.text(`Année : ${year}`, 30, 107);

    // Tableau des notes
    doc.autoTable({
      startY: 115,
      head: [["Module", "Note", "Résultat"]],
      body: filteredNotes.map(note => [note.module.nomMod, `${note.moyenne}/20`, note.resultat]),
      styles: { font: "helvetica", fontSize: 10 },
      headStyles: { fillColor: "#4dabf7", textColor: "#fff" }
    });

    // Résultats
    const yPos = doc.previousAutoTable.finalY + 10;
    doc.text(`Moyenne ${year} : ${moyenne?.toFixed(3)}`, 30, yPos);
    doc.text(`Résultat : ${getResultat(moyenne)}`, 100, yPos);

    doc.save(`releve_notes_${year}.pdf`);
  };

  // Génération PDF final (1ère + 2ème année)
  const generateFinalPDF = () => {
    const doc = new jsPDF();
    
    // Première page (1ère année)
    const notesPremiereAnnee = notes.filter(note => note.module.niveauScolaire.designation === "1ère année");
    const moyennePremiereAnnee = calculateMoyenneAnnee(cinEtud, "1ère année");
    
    doc.addImage(imgLogoEPG, "JPEG", 25, 0, 155, 35);
    doc.setFontSize(18);
    doc.text("RELEVE DE NOTES - 1ÈRE ANNÉE", 105, 50, "center");
    
    // Informations étudiant
    doc.setFontSize(13);
    doc.text(`M. (Mme) : ${notesPremiereAnnee[0]?.etudiant.nom} ${notesPremiereAnnee[0]?.etudiant.prenom}`, 30, 75);
    doc.text(`CIN : ${notesPremiereAnnee[0]?.etudiant.cin}`, 30, 83);
    doc.text(`Niveau : ${notesPremiereAnnee[0]?.module.niveauScolaire.filiere.niveau.designation}`, 30, 91);
    doc.text(`Filière : ${notesPremiereAnnee[0]?.module.niveauScolaire.filiere.designation}`, 30, 99);

    // Tableau des notes
    doc.autoTable({
      startY: 107,
      head: [["Module", "Note", "Résultat"]],
      body: notesPremiereAnnee.map(note => [note.module.nomMod, `${note.moyenne}/20`, note.resultat]),
      styles: { font: "helvetica", fontSize: 10 },
      headStyles: { fillColor: "#4dabf7", textColor: "#fff" }
    });

    // Résultats
    const yPos1 = doc.previousAutoTable.finalY + 10;
    doc.text(`Moyenne 1ère année : ${moyennePremiereAnnee?.toFixed(3)}`, 30, yPos1);
    doc.text(`Résultat : ${getResultat(moyennePremiereAnnee)}`, 100, yPos1);

    // Deuxième page (2ème année)
    doc.addPage();
    const notesDeuxiemeAnnee = notes.filter(note => note.module.niveauScolaire.designation === "2ème année");
    const moyenneDeuxiemeAnnee = calculateMoyenneAnnee(cinEtud, "2ème année");
    const moyenneFinale = (moyennePremiereAnnee + moyenneDeuxiemeAnnee) / 2;
    
    doc.addImage(imgLogoEPG, "JPEG", 25, 0, 155, 35);
    doc.setFontSize(18);
    doc.text("RELEVE DE NOTES - 2ÈME ANNÉE", 105, 50, "center");
    
    // Tableau des notes
    doc.autoTable({
      startY: 60,
      head: [["Module", "Note", "Résultat"]],
      body: notesDeuxiemeAnnee.map(note => [note.module.nomMod, `${note.moyenne}/20`, note.resultat]),
      styles: { font: "helvetica", fontSize: 10 },
      headStyles: { fillColor: "#4dabf7", textColor: "#fff" }
    });

    // Résultats
    const yPos2 = doc.previousAutoTable.finalY + 10;
    doc.text(`Moyenne 2ème année : ${moyenneDeuxiemeAnnee?.toFixed(3)}`, 30, yPos2);
    doc.text(`Résultat : ${getResultat(moyenneDeuxiemeAnnee)}`, 100, yPos2);

    // Moyenne finale
    doc.text(`Moyenne finale : ${moyenneFinale.toFixed(3)}`, 30, yPos2 + 10);
    doc.text(`Résultat final : ${getResultat(moyenneFinale)}`, 100, yPos2 + 10);

    // Date
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    doc.text(`Fait le : ${today.toLocaleDateString("fr-FR", options)}`, 180, yPos2 + 20, "right");

    doc.save("releve_notes_final.pdf");
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
                  <tr><td><strong>Nom :</strong></td><td>{notes[0]?.etudiant.nom}</td></tr>
                  <tr><td><strong>Prénom :</strong></td><td>{notes[0]?.etudiant.prenom}</td></tr>
                  <tr><td><strong>CIN :</strong></td><td>{notes[0]?.etudiant.cin}</td></tr>
                  <tr><td><strong>Niveau :</strong></td><td>{notes[0]?.module.niveauScolaire.filiere.niveau.designation}</td></tr>
                  <tr><td><strong>Filière :</strong></td><td>{notes[0]?.module.niveauScolaire.filiere.designation}</td></tr>
                </tbody>
              </Table>
            </div>

            <div className="mt-3">
              <Button 
                variant={selectedYear === "1ère année" ? "primary" : "outline-primary"}
                className='w-100 mb-2'
                onClick={() => handleYearButtonClick("1ère année")}
              >
                1ère année
              </Button>
              
              {niveauScoDesignation.includes("2ème année") && (
                <Button 
                  variant={selectedYear === "2ème année" ? "primary" : "outline-primary"}
                  className='w-100'
                  onClick={() => handleYearButtonClick("2ème année")}
                >
                  2ème année
                </Button>
              )}
            </div>
          </div>

          <div className="col-md-9">
            {selectedYear && (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                border: '2px solid #4dabf7',
                padding: '15px',
                marginBottom: '20px'
              }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 style={{ margin: 0 }}>Relevé de notes - {selectedYear}</h5>
                  <Button 
                    variant="link" 
                    onClick={() => generatePDF(selectedYear)}
                    style={{ padding: 0 }}
                  >
                    <img src={iconImprimerPDF} alt="Imprimer" style={{ width: '24px' }} />
                  </Button>
                </div>
              </div>
            )}

            {selectedYear && (
              <Table bordered hover style={{ backgroundColor: 'white' }}>
                <thead style={{ backgroundColor: '#4dabf7', color: 'white' }}>
                  <tr>
                    <th>Module</th>
                    <th>Note</th>
                    <th>Résultat</th>
                  </tr>
                </thead>
                <tbody>
                  {notes
                    .filter(note => note.module.niveauScolaire.designation === selectedYear)
                    .map(note => (
                      <tr key={`${note.etudiant.cin}-${note.module.codeMod}`}>
                        <td>{note.module.nomMod}</td>
                        <td>{note.moyenne}</td>
                        <td>{note.resultat}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}

            {selectedYear && (
              <>
                <div className="mt-3 p-3" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  border: '2px solid #4dabf7'
                }}>
                  <div className="row">
                    <div className="col-md-4">
                      <strong>Moyenne :</strong> {moyenneAnnee?.toFixed(3)}
                    </div>
                    <div className="col-md-4">
                      <strong>Résultat :</strong> 
                      <span style={{ color: moyenneAnnee >= 10 ? '#28a745' : '#dc3545' }}>
                        {moyenneAnnee && getResultat(moyenneAnnee)}
                      </span>
                    </div>
                    <div className="col-md-4">
                      <strong>Classement :</strong> 
                      {classement?.map((item, index) => (
                        item.etudiant.cin === cinEtud && index + 1
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-2 p-3" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  border: '2px solid #4dabf7'
                }}>
                  <div className="row">
                    <div className="col-md-4">
                      <strong>Note majorante :</strong> {noteMajorante?.toFixed(3)}
                    </div>
                    <div className="col-md-4">
                      <strong>Note minorante :</strong> {noteMinorante?.toFixed(3)}
                    </div>
                    <div className="col-md-4">
                      <strong>Moyenne promotion :</strong> {moyennePromotion?.toFixed(3)}
                    </div>
                  </div>
                </div>
              </>
            )}

            {niveauScoDesignation.includes("2ème année") && (
              <div className="mt-3 text-center">
                <Button 
                  variant="primary"
                  onClick={generateFinalPDF}
                >
                  Générer le relevé final (1ère + 2ème année)
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterfaceGestionBulletinsTest;