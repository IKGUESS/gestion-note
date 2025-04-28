package com.example.Gestion_Etudiants.NoteRattEtd;

import com.example.Gestion_Etudiants.ResourceNotFoundException;
import com.example.Gestion_Etudiants.Etudiants.Etudiant;
import com.example.Gestion_Etudiants.Etudiants.EtudiantRepository;
import com.example.Gestion_Etudiants.Modules.Module;
import com.example.Gestion_Etudiants.Modules.ModuleRepository;
import com.example.Gestion_Etudiants.NoteNormaleEtd.noteNormaleEtd;
import com.example.Gestion_Etudiants.NoteNormaleEtd.noteNormaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class noteRattEtdService {

    private final noteRattEtdRepository noteRattrapageRepository;
    private final noteNormaleRepository noteNormaleRepository;
    private final EtudiantRepository etudiantRepository;
    private final ModuleRepository moduleRepository;

    public noteRattEtdService(noteRattEtdRepository noteRattrapageRepository,
                              noteNormaleRepository noteNormaleRepository,
                              EtudiantRepository etudiantRepository,
                              ModuleRepository moduleRepository) {
        this.noteRattrapageRepository = noteRattrapageRepository;
        this.noteNormaleRepository = noteNormaleRepository;
        this.etudiantRepository = etudiantRepository;
        this.moduleRepository = moduleRepository;
    }

    public List<noteRattEtd> getAllNotes() {
        return noteRattrapageRepository.findAllWithEtudiant();
    }

    public List<noteRattEtd> getNotesByEtudiant(String cin) {
        return noteRattrapageRepository.findByEtudiant_Cin(cin);
    }

    public noteRattEtd getNoteByEtudiantAndModule(String cin, String codeMod) {
        return noteRattrapageRepository.findByEtudiant_CinAndModule_CodeMod(cin, codeMod);
    }

    public noteRattEtd getNoteByEtudiantModuleAndSession(String cin, String codeMod, String session) {
        return noteRattrapageRepository.findByEtudiant_CinAndModule_CodeModAndSession(cin, codeMod, session);
    }

    @Transactional
    public noteRattEtd createNoteRattrapage(String cin, String codeMod) {
        // Vérifier si la note existe déjà
        noteRattEtd existingNote = noteRattrapageRepository.findByEtudiant_CinAndModule_CodeMod(cin, codeMod);
        if (existingNote != null) {
            throw new ResourceNotFoundException("Note de rattrapage existe déjà pour cet étudiant et module");
        }

        // Vérifier et associer l'étudiant
        Etudiant etudiant = etudiantRepository.findEtudiantByCin(cin);
        if (etudiant == null) {
            throw new ResourceNotFoundException("Étudiant non trouvé avec le CIN: " + cin);
        }

        // Vérifier et associer le module
        Module module = moduleRepository.findModuleByCodeMod(codeMod);
        if (module == null) {
            throw new ResourceNotFoundException("Module non trouvé avec le code: " + codeMod);
        }

        noteRattEtd note = new noteRattEtd();
        note.setEtudiant(etudiant);
        note.setModule(module);
        note.setSession("Rattrapage");
        note.setEtudiantDansNoteRattrapage(true);

        return noteRattrapageRepository.save(note);
    }

    @Transactional
    public noteRattEtd updateNote(String cin, String codeMod, noteRattEtd noteDetails) {
        noteRattEtd note = noteRattrapageRepository.findByEtudiant_CinAndModule_CodeMod(cin, codeMod);
        if (note == null) {
            throw new ResourceNotFoundException("Note non trouvée pour l'étudiant: " + cin + " et le module: " + codeMod);
        }

        note.setCtrl_1(noteDetails.getCtrl_1());
        note.setCtrl_2(noteDetails.getCtrl_2());
        note.setCtrl_3(noteDetails.getCtrl_3());
        note.setTp_1(noteDetails.getTp_1());
        note.setTp_2(noteDetails.getTp_2());
        note.setTp_3(noteDetails.getTp_3());
        note.setExam_1(noteDetails.getExam_1());
        note.setExam_2(noteDetails.getExam_2());
        note.setExam_3(noteDetails.getExam_3());
        note.setMoyenne(noteDetails.getMoyenne());
        note.setResultat(noteDetails.getResultat());

        return noteRattrapageRepository.save(note);
    }

    @Transactional
    public void updateMoyenne(String cin, String codeMod, double moyenne, String resultat) {
        noteRattEtd note = noteRattrapageRepository.findByEtudiant_CinAndModule_CodeMod(cin, codeMod);
        if (note == null) {
            throw new ResourceNotFoundException("Note non trouvée pour l'étudiant: " + cin + " et le module: " + codeMod);
        }

        note.setMoyenne(moyenne);
        note.setResultat(resultat);
        noteRattrapageRepository.save(note);
    }

    @Transactional
    public void deleteNote(String cin, String codeMod) {
        noteRattEtd note = noteRattrapageRepository.findByEtudiant_CinAndModule_CodeMod(cin, codeMod);
        if (note == null) {
            throw new ResourceNotFoundException("Note non trouvée pour l'étudiant: " + cin + " et le module: " + codeMod);
        }
        noteRattrapageRepository.delete(note);
    }

    @Transactional
    public void removeNonRattrapageStudents() {
        List<noteNormaleEtd> nonRattrapageStudents = noteNormaleRepository.findByResultatNot("Rattrapage");

        for (noteNormaleEtd noteNormale : nonRattrapageStudents) {
            noteRattEtd noteRattrapage = noteRattrapageRepository.findByEtudiantAndModule(
                    noteNormale.getEtudiant(),
                    noteNormale.getModule()
            );
            if (noteRattrapage != null) {
                noteRattrapageRepository.delete(noteRattrapage);
            }
        }
    }

}