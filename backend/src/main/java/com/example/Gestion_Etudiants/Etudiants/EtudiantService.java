package com.example.Gestion_Etudiants.Etudiants;

import com.example.Gestion_Etudiants.ResourceNotFoundException;
import com.example.Gestion_Etudiants.Modules.Module;
import com.example.Gestion_Etudiants.Modules.ModuleRepository;
import com.example.Gestion_Etudiants.NoteNormaleEtd.noteNormaleEtd;
import com.example.Gestion_Etudiants.NoteNormaleEtd.noteNormaleRepository;
import com.example.Gestion_Etudiants.NoteRattEtd.noteRattEtd;
import com.example.Gestion_Etudiants.NoteRattEtd.noteRattEtdRepository;
import com.example.Gestion_Etudiants.Presences.Presence;
import com.example.Gestion_Etudiants.Presences.PresenceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class EtudiantService {

    private final EtudiantRepository etudiantRepository;
    private final ModuleRepository moduleRepository;
    private final noteNormaleRepository noteNormaleRepository;
    private final noteRattEtdRepository noteRattRepository;
    private final PresenceRepository presenceRepository;

    public EtudiantService(EtudiantRepository etudiantRepository,
                           ModuleRepository moduleRepository,
                           noteNormaleRepository noteNormaleRepository,
                           noteRattEtdRepository noteRattRepository,
                           PresenceRepository presenceRepository) {
        this.etudiantRepository = etudiantRepository;
        this.moduleRepository = moduleRepository;
        this.noteNormaleRepository = noteNormaleRepository;
        this.noteRattRepository = noteRattRepository;
        this.presenceRepository = presenceRepository;
    }

    public List<Etudiant> getAllEtudiants() {
        return etudiantRepository.findAll();
    }

    public Etudiant getEtudiantById(String cin) {
        return etudiantRepository.findEtudiantByCin(cin);
    }

    @Transactional
    public Etudiant createEtudiant(Etudiant etudiant) {
        Etudiant savedEtudiant = etudiantRepository.save(etudiant);

        List<Module> modules = moduleRepository.getAllByniveauEtd_Filiere_CodeFil(etudiant.getFiliere().getCodeFil());

        for (Module module : modules) {
            noteNormaleEtd note = new noteNormaleEtd();
            note.setEtudiant(savedEtudiant);
            note.setModule(module);
            noteNormaleRepository.save(note);

            Presence presence = new Presence();
            presence.setEtudiant(savedEtudiant);
            presence.setModule(module);
            presenceRepository.save(presence);
        }

        return savedEtudiant;
    }

    public Etudiant updateEtudiant(String cin, Etudiant etudiantDetails) {
        Etudiant etudiant = etudiantRepository.findEtudiantByCin(cin);
        if (etudiant == null) {
            throw new ResourceNotFoundException("Etudiant de CIN: " + cin + " n'existe pas");
        }

        // Mise à jour des champs
        etudiant.setNom(etudiantDetails.getNom());
        etudiant.setPrenom(etudiantDetails.getPrenom());
        etudiant.setDateNaissance(etudiantDetails.getDateNaissance());
        etudiant.setEmail(etudiantDetails.getEmail());
        etudiant.setTelephone(etudiantDetails.getTelephone());
        etudiant.setNationalite(etudiantDetails.getNationalite());
        etudiant.setVille(etudiantDetails.getVille());
        etudiant.setSexe(etudiantDetails.getSexe());
        etudiant.setStatut(etudiantDetails.getStatut());
        etudiant.setLogin(etudiantDetails.getLogin());
        etudiant.setPassword(etudiantDetails.getPassword());
        etudiant.setSection(etudiantDetails.getSection());
        etudiant.setFiliere(etudiantDetails.getFiliere());

        return etudiantRepository.save(etudiant);
    }

    @Transactional
    public void deleteEtudiant(String cin) {
        Etudiant etudiant = etudiantRepository.findEtudiantByCin(cin);
        if (etudiant == null) {
            throw new ResourceNotFoundException("Etudiant de cin : " + cin + " n'existe pas");
        }

        // Suppression des notes normales
        noteNormaleRepository.deleteByEtudiant_Cin(cin);

        // Suppression des notes de rattrapage
        noteRattRepository.deleteByEtudiant_Cin(cin);

        // Suppression des présences
        presenceRepository.deleteByEtudiant_Cin(cin);

        // Suppression de l'étudiant
        etudiantRepository.delete(etudiant);
    }

    public List<Etudiant> getEtudiantsByFiliere(String codeFil) {
        return etudiantRepository.findEtudiantByCodeFil(codeFil);
    }
}