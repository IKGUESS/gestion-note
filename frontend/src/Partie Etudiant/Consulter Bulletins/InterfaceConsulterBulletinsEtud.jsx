import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import noteService from '../../services/NoteService';
import etudiantService from '../../services/EtudiantService';
import imgLogoEPG from '../../components/images/logo.png';
import HeaderEtudiant from '../../Header and Footer/HeaderEtudiant';
import FooterComponent from '../../Header and Footer/FooterComponent';
import { FaFilePdf } from 'react-icons/fa';

const InterfaceConsulterBulletinsEtud = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [notes, setNotes] = useState([]);
  const [etudiantsMemeFiliere, setEtudiantsMemeFiliere] = useState([]);
  const [notesTousEtud, setNotesTousEtud] = useState([]);
  const [moyenneAnnee, setMoyenneAnnee] = useState(null);
  const [classement, setClassement] = useState(null);
  const [noteMajorante, setNoteMajorante] = useState(null);
  const [noteMinorante, setNoteMinorante] = useState(null);
  const [moyennePromotion, setMoyennePromotion] = useState(null);
  const [niveauScoDesignation, setNiveauScoDesignation] = useState([]);
  const cinEtud = localStorage.getItem('cinEtudiant');

  const calculateMoyenneAnnee = (studentCIN, year) => {
    const filteredNotes = notes.filter(
      (note) => note.etudiant.cin === studentCIN && note.module.niveauScolaire.designation === year
    );
    if (filteredNotes.length === 0) return null;
    const sum = filteredNotes.reduce((total, note) => total + (note.moyenne || 0), 0);
    return sum / filteredNotes.length;
  };

  const calculateMoyenneAnneeTousEtud = (studentCIN, year) => {
    const filteredNotes = notesTousEtud.filter(
      (note) => note.etudiant.cin === studentCIN && note.module.niveauScolaire.designation === year
    );
    if (filteredNotes.length === 0) return null;
    const sum = filteredNotes.reduce((total, note) => total + (note.moyenne || 0), 0);
    return sum / filteredNotes.length;
  };

  const calculateClassement = (year) => {
    const moyennes = etudiantsMemeFiliere
      .map((etudiant) => {
        const average = calculateMoyenneAnneeTousEtud(etudiant.cin, year);
        return { etudiant, moyenneAnnee: average || 0 };
      })
      .filter((item) => item.moyenneAnnee !== null);
    const classement = moyennes.sort((a, b) => b.moyenneAnnee - a.moyenneAnnee);
    if (moyennes.length === 0) return [];
    const maxNote = Math.max(...moyennes.map((note) => note.moyenneAnnee));
    const minNote = Math.min(...moyennes.map((note) => note.moyenneAnnee));
    const moyennePromo = moyennes.reduce((total, etudiant) => total + etudiant.moyenneAnnee, 0) / moyennes.length;
    setNoteMajorante(maxNote);
    setNoteMinorante(minNote);
    setMoyennePromotion(moyennePromo);
    return classement;
  };

  useEffect(() => {
    noteService.getNotesNormale().then((reponse) => {
      setNotesTousEtud(reponse.data);
    });
  }, []);

  useEffect(() => {
    noteService.getNotesNormaleByCinEtu(cinEtud).then((reponse) => {
      const notesData = reponse.data;
      setNotes(notesData);
      if (notesData.length > 0) {
        const niveauDesignations = [...new Set(notesData.map((note) => note.module.niveauScolaire.designation))];
        setNiveauScoDesignation(niveauDesignations);
        const codeFili = notesData[0].module.niveauScolaire.filiere.codeFil;
        etudiantService.getAllEtudiantsByCodeFil(codeFili).then((reponse) => {
          setEtudiantsMemeFiliere(reponse.data);
        });
      }
    });
  }, [cinEtud]);

  const handleYearButtonClick = (year) => {
    setSelectedYear(year);
    const average = calculateMoyenneAnnee(cinEtud, year);
    setMoyenneAnnee(average);
    const ranking = calculateClassement(year);
    setClassement(ranking);
  };

  const getResultat = (moyenne) => {
    if (moyenne >= 10 && moyenne <= 20) return 'Valider';
    return 'Non-Valider';
  };

  const MyDocumentsFinale = () => {
    const moyenne_1ereAnnee = calculateMoyenneAnnee(cinEtud, '1ère année');
    const filteredNotes = notes.filter(
      (note) => note.etudiant.cin === cinEtud && note.module.niveauScolaire.designation === '1ère année'
    );
    const moyenne_2emeAnnee = calculateMoyenneAnnee(cinEtud, '2ème année');
    const filteredNotes2 = notes.filter(
      (note) => note.etudiant.cin === cinEtud && note.module.niveauScolaire.designation === '2ème année'
    );

    const getCurrentDate = () => {
      const today = new Date();
      return today.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getCurrentYear = () => {
      const currentYear = new Date().getFullYear();
      return `${currentYear}/${currentYear + 1}`;
    };

    const doc = new jsPDF();
    doc.addImage(imgLogoEPG, 'JPEG', 25, 0, 155, 35);
    doc.setFontSize(11);
    doc.text(`Année universitaire : ${getCurrentYear()}`, 165, 60, null, null, 'center');
    doc.setFontSize(18);
    doc.text('RELEVE DE NOTES', 105, 50, null, null, 'center');
    doc.setFontSize(13);
    doc.text('M. (Mme) :', 30, 75);
    doc.text(filteredNotes.length > 0 ? `${filteredNotes[0].etudiant.nom} ${filteredNotes[0].etudiant.prenom}` : '', 55, 75);
    doc.text('CIN :', 30, 83);
    doc.text(filteredNotes.length > 0 ? filteredNotes[0].etudiant.cin : '', 45, 83);
    doc.text('Niveau :', 30, 91);
    doc.text(filteredNotes.length > 0 ? filteredNotes[0].module.niveauScolaire.filiere.niveau.designation : '', 50, 91);
    doc.text('Filière :', 30, 99);
    doc.text(filteredNotes.length > 0 ? filteredNotes[0].module.niveauScolaire.filiere.designation : '', 48, 99);
    doc.text('Les relevés de notes de la 1ère année', 60, 110);

    const tableData = [['Module', 'Note', 'Résultat'], ...filteredNotes.map((note) => [note.module.nomMod, `${note.moyenne}/20`, note.resultat])];
    doc.autoTable({
      startY: 117,
      head: [tableData[0]],
      body: tableData.slice(1),
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 2, lineColor: '#000', lineWidth: 0.1 },
      headStyles: { fillColor: '#ccc' },
      columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 40 }, 2: { cellWidth: 50 } },
    });

    doc.setFontSize(13);
    const lastTableLineY = doc.previousAutoTable.finalY;
    doc.text('Moyenne du 1ère année :', 19, lastTableLineY + 10);
    doc.text(moyenne_1ereAnnee ? moyenne_1ereAnnee.toFixed(3) : 'N/A', 75, lastTableLineY + 10);
    doc.text('Résultat du 1ère année :', 19, lastTableLineY + 18);
    doc.text(moyenne_1ereAnnee ? getResultat(moyenne_1ereAnnee) : 'N/A', 73, lastTableLineY + 18);

    doc.addPage();
    doc.text('Les relevés de notes de la 2ème année', 60, 10);
    const tableData2 = [['Module', 'Note', 'Résultat'], ...filteredNotes2.map((note) => [note.module.nomMod, `${note.moyenne}/20`, note.resultat])];
    doc.autoTable({
      startY: 17,
      head: [tableData2[0]],
      body: tableData2.slice(1),
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 2, lineColor: '#000', lineWidth: 0.1 },
      headStyles: { fillColor: '#ccc' },
      columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 40 }, 2: { cellWidth: 50 } },
    });

    doc.setFontSize(13);
    const lastTableLineY2 = doc.previousAutoTable.finalY;
    doc.text('Moyenne du 2ème année :', 19, lastTableLineY2 + 10);
    doc.text(moyenne_2emeAnnee ? moyenne_2emeAnnee.toFixed(3) : 'N/A', 75, lastTableLineY2 + 10);
    doc.text('Résultat du 2ème année :', 19, lastTableLineY2 + 18);
    doc.text(moyenne_2emeAnnee ? getResultat(moyenne_2emeAnnee) : 'N/A', 73, lastTableLineY2 + 18);
    doc.text('-----------------------------------------------------------------------------------------------------------------------------------------------', 0, lastTableLineY2 + 25);
    const moyenneFiliere = moyenne_1ereAnnee && moyenne_2emeAnnee ? (moyenne_1ereAnnee + moyenne_2emeAnnee) / 2 : null;
    doc.text('Moyenne de la Filière :', 19, lastTableLineY2 + 32);
    doc.text(moyenneFiliere ? moyenneFiliere.toFixed(3) : 'N/A', 68, lastTableLineY2 + 32);
    doc.text('Résultat de la Filière :', 19, lastTableLineY2 + 40);
    doc.text(moyenneFiliere ? getResultat(moyenneFiliere) : 'N/A', 65, lastTableLineY2 + 40);
    doc.setFontSize(11);
    doc.text(`Fès le : ${getCurrentDate()}`, 180, lastTableLineY2 + 48, null, null, 'right');
    doc.save('notesFinales.pdf');
  };

  const MyDocuments = () => {
    const filteredNotes = notes.filter(
      (note) => note.etudiant.cin === cinEtud && note.module.niveauScolaire.designation === selectedYear
    );

    const getCurrentDate = () => {
      const today = new Date();
      return today.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getCurrentYear = () => {
      const currentYear = new Date().getFullYear();
      return `${currentYear}/${currentYear + 1}`;
    };

    const doc = new jsPDF();
    doc.addImage(imgLogoEPG, 'JPEG', 25, 0, 155, 35);
    doc.setFontSize(11);
    doc.text(`Année universitaire : ${getCurrentYear()}`, 165, 60, null, null, 'center');
    doc.setFontSize(18);
    doc.text('RELEVE DE NOTES', 105, 50, null, null, 'center');
    doc.setFontSize(13);
    doc.text('M. (Mme) :', 30, 75);
    doc.text(filteredNotes.length > 0 ? `${filteredNotes[0].etudiant.nom} ${filteredNotes[0].etudiant.prenom}` : '', 55, 75);
    doc.text('CIN :', 30, 83);
    doc.text(filteredNotes.length > 0 ? filteredNotes[0].etudiant.cin : '', 45, 83);
    doc.text('Niveau :', 30, 91);
    doc.text(filteredNotes.length > 0 ? filteredNotes[0].module.niveauScolaire.filiere.niveau.designation : '', 50, 91);
    doc.text('Filière :', 30, 99);
    doc.text(filteredNotes.length > 0 ? filteredNotes[0].module.niveauScolaire.filiere.designation : '', 48, 99);
    doc.text(`Niveau Scolaire : ${selectedYear}`, 30, 107);
    const tableData = [['Module', 'Note', 'Résultat'], ...filteredNotes.map((note) => [note.module.nomMod, `${note.moyenne}/20`, note.resultat])];
    doc.autoTable({
      startY: 115,
      head: [tableData[0]],
      body: tableData.slice(1),
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 2, lineColor: '#000', lineWidth: 0.1 },
      headStyles: { fillColor: '#ccc' },
      columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 40 }, 2: { cellWidth: 50 } },
    });
    doc.setFontSize(13);
    const lastTableLineY = doc.previousAutoTable.finalY;
    doc.text(`Moyenne du ${selectedYear} :`, 19, lastTableLineY + 10);
    doc.text(moyenneAnnee ? moyenneAnnee.toFixed(3) : 'N/A', 75, lastTableLineY + 10);
    doc.text(`Résultat du ${selectedYear} :`, 19, lastTableLineY + 18);
    doc.text(moyenneAnnee ? getResultat(moyenneAnnee) : 'N/A', 73, lastTableLineY + 18);
    doc.setFontSize(11);
    doc.text(`Fès le : ${getCurrentDate()}`, 180, lastTableLineY + 16, null, null, 'right');
    doc.save('notes.pdf');
  };

  const renderResultsTable = () => {
    if (!selectedYear) return null;
    const filteredNotes = notes.filter((note) => note.module.niveauScolaire.designation === selectedYear);
    if (filteredNotes.length === 0) return <p className="text-center">Aucune note disponible pour {selectedYear}</p>;
    return (
      <div style={{ overflowX: 'auto' }}>
        <Table
          bordered
          striped
          hover
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
              <th scope="col">Module</th>
              <th scope="col">Résultat</th>
              <th scope="col">Note</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotes.map((note) => (
              <tr key={`${note.etudiant.cin}-${note.module.codeMod}`}>
                <td>{note.module.nomMod}</td>
                <td>{note.resultat}</td>
                <td>{note.moyenne.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#e7f1ff' }}>
      <HeaderEtudiant />
      <div className="container py-5">
        <h4 className="text-center mb-5" style={{ fontWeight: '600', color: '#343a40', fontSize: '1.8rem' }}>
          Consulter Bulletins - ENSA Béni Mellal
        </h4>
        <div className="row justify-content-center">
          <div
            className="col-12 col-md-4 mb-4"
            style={{ animation: `slideIn 0.5s ease-in`, animationFillMode: 'both' }}
          >
            <Table
              style={{
                border: '2px solid #4dabf7',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(5px)',
              }}
            >
              <tbody>
                {[
                  { label: 'Nom', value: notes.length > 0 ? notes[0].etudiant.nom : 'N/A' },
                  { label: 'Prénom', value: notes.length > 0 ? notes[0].etudiant.prenom : 'N/A' },
                  { label: 'CIN', value: notes.length > 0 ? notes[0].etudiant.cin : 'N/A' },
                  { label: 'Niveau', value: notes.length > 0 ? notes[0].module.niveauScolaire.filiere.niveau.designation : 'N/A' },
                  { label: 'Filière', value: notes.length > 0 ? notes[0].module.niveauScolaire.filiere.designation : 'N/A' },
                ].map((item, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: '500', color: '#343a40' }}>{item.label} :</td>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div
            className="col-12 col-md-2 mb-4"
            style={{ animation: `slideIn 0.5s ease-in`, animationDelay: '0.1s', animationFillMode: 'both' }}
          >
            {[
              { year: '1ère année', label: '1ère Année' },
              ...(niveauScoDesignation.includes('2ème année') ? [{ year: '2ème année', label: '2ème Année' }] : []),
            ].map((item, index) => (
              <button
                key={item.year}
                className="text-center d-flex flex-column align-items-center justify-content-center mb-3"
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
                }}
                onClick={() => handleYearButtonClick(item.year)}
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
                aria-label={`Consulter les notes de ${item.year}`}
              >
                <span style={{ fontWeight: '500', color: '#343a40', fontSize: '0.85rem', lineHeight: '1.2' }}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
          <div
            className="col-12 col-md-6 mb-4"
            style={{ animation: `slideIn 0.5s ease-in`, animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            {selectedYear && (
              <div className="mb-4">
                <div
                  className="d-flex justify-content-center mb-3"
                  style={{ animation: `slideIn 0.5s ease-in`, animationDelay: '0.3s', animationFillMode: 'both' }}
                >
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
                    }}
                    onClick={MyDocuments}
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
                    aria-label={`Télécharger le relevé de notes de ${selectedYear}`}
                  >
                    <div style={{ fontSize: '1.8rem', color: '#343a40', marginBottom: '0.5rem' }}>
                      <FaFilePdf />
                    </div>
                    <span style={{ fontWeight: '500', color: '#343a40', fontSize: '0.85rem', lineHeight: '1.2' }}>
                      Relevé {selectedYear}
                    </span>
                  </button>
                </div>
                {niveauScoDesignation.includes('2ème année') && (
                  <div
                    className="d-flex justify-content-center mb-3"
                    style={{ animation: `slideIn 0.5s ease-in`, animationDelay: '0.4s', animationFillMode: 'both' }}
                  >
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
                      }}
                      onClick={MyDocumentsFinale}
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
                      aria-label="Télécharger le relevé de notes final"
                    >
                      <div style={{ fontSize: '1.8rem', color: '#343a40', marginBottom: '0.5rem' }}>
                        <FaFilePdf />
                      </div>
                      <span style={{ fontWeight: '500', color: '#343a40', fontSize: '0.85rem', lineHeight: '1.2' }}>
                        Relevé Final
                      </span>
                    </button>
                  </div>
                )}
                {renderResultsTable()}
              </div>
            )}
            {selectedYear && (
              <div className="row mb-4">
                {[
                  { label: 'Moyenne d’année', value: moyenneAnnee ? moyenneAnnee.toFixed(3) : 'N/A' },
                  { label: 'Résultat', value: moyenneAnnee ? getResultat(moyenneAnnee) : 'N/A' },
                  {
                    label: 'Classement',
                    value:
                      classement && classement.length > 0
                        ? classement.findIndex((item) => item.etudiant.cin === cinEtud) + 1
                        : 'N/A',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="col-12 col-sm-4 mb-3"
                    style={{
                      animation: `slideIn 0.5s ease-in`,
                      animationDelay: `${0.5 + index * 0.1}s`,
                      animationFillMode: 'both',
                    }}
                  >
                    <div
                      style={{
                        border: '2px solid #4dabf7',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(5px)',
                        padding: '15px',
                        textAlign: 'center',
                      }}
                    >
                      <span style={{ fontWeight: '500', color: '#343a40' }}>{item.label} :</span>
                      <span style={{ color: '#008080', marginLeft: '5px', fontWeight: '600' }}>{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {selectedYear && (
              <div className="row">
                {[
                  { label: 'Note Majorante', value: noteMajorante ? noteMajorante.toFixed(3) : 'N/A' },
                  { label: 'Note Minorante', value: noteMinorante ? noteMinorante.toFixed(3) : 'N/A' },
                  { label: 'Moyenne de la Promotion', value: moyennePromotion ? moyennePromotion.toFixed(3) : 'N/A' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="col-12 col-sm-4 mb-3"
                    style={{
                      animation: `slideIn 0.5s ease-in`,
                      animationDelay: `${0.8 + index * 0.1}s`,
                      animationFillMode: 'both',
                    }}
                  >
                    <div
                      style={{
                        border: '2px solid #4dabf7',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(5px)',
                        padding: '15px',
                        textAlign: 'center',
                      }}
                    >
                      <span style={{ fontWeight: '500', color: '#343a40' }}>{item.label} :</span>
                      <span style={{ color: '#008080', marginLeft: '5px', fontWeight: '600' }}>{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
};

export default InterfaceConsulterBulletinsEtud;