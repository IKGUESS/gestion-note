package com.example.Gestion_Etudiants.NoteNormaleEtd;

import com.example.Gestion_Etudiants.ResourceNotFoundException;
import com.example.Gestion_Etudiants.Etudiants.Etudiant;
import com.example.Gestion_Etudiants.Etudiants.EtudiantRepository;
import com.example.Gestion_Etudiants.Modules.Module;
import com.example.Gestion_Etudiants.Modules.ModuleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class noteNormaleService {

    private final noteNormaleRepository noteRepository;
    private final EtudiantRepository etudiantRepository;
    private final ModuleRepository moduleRepository;

    public noteNormaleService(noteNormaleRepository noteRepository,
                              EtudiantRepository etudiantRepository,
                              ModuleRepository moduleRepository) {
        this.noteRepository = noteRepository;
        this.etudiantRepository = etudiantRepository;
        this.moduleRepository = moduleRepository;
    }

    public List<noteNormaleEtd> getAllNotes() {
        return noteRepository.findAllWithEtudiant();
    }

    public List<noteNormaleEtd> getNotesByEtudiant(String cin) {
        return noteRepository.findByEtudiant_Cin(cin);
    }

    public noteNormaleEtd getNoteByEtudiantAndModule(String cin, String codeMod) {
        return noteRepository.findByEtudiant_CinAndModule_codeMod(cin, codeMod);
    }

    public noteNormaleEtd getNoteByEtudiantModuleAndSession(String cin, String codeMod, String session) {
        return noteRepository.findByEtudiant_CinAndModule_codeModAndSession(cin, codeMod, session);
    }

    @Transactional
    public noteNormaleEtd createNote(noteNormaleEtd note) {
        // Vérifier et associer l'étudiant
        Etudiant etudiant = etudiantRepository.findEtudiantByCin(note.getEtudiant().getCin());
        if (etudiant == null) {
            throw new ResourceNotFoundException("Étudiant non trouvé avec le CIN: " + note.getEtudiant().getCin());
        }
        note.setEtudiant(etudiant);

        // Vérifier et associer le module
        Module module = moduleRepository.findModuleByCodeMod(note.getModule().getCodeMod());
        if (module == null) {
            throw new ResourceNotFoundException("Module non trouvé avec le code: " + note.getModule().getCodeMod());
        }
        note.setModule(module);

        return noteRepository.save(note);
    }

    @Transactional
    public noteNormaleEtd updateNote(String cin, String codeMod, noteNormaleEtd noteDetails) {
        noteNormaleEtd note = noteRepository.findByEtudiant_CinAndModule_codeMod(cin, codeMod);
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

        return noteRepository.save(note);
    }

    @Transactional
    public void updateMoyenne(String cin, String codeMod, double moyenne, String resultat) {
        noteNormaleEtd note = noteRepository.findByEtudiant_CinAndModule_codeMod(cin, codeMod);
        if (note == null) {
            throw new ResourceNotFoundException("Note non trouvée pour l'étudiant: " + cin + " et le module: " + codeMod);
        }

        note.setMoyenne(moyenne);
        note.setResultat(resultat);
        noteRepository.save(note);
    }
}