package com.example.Gestion_Etudiants.Presences;

import com.example.Gestion_Etudiants.ResourceNotFoundException;
import com.example.Gestion_Etudiants.Etudiants.Etudiant;
import com.example.Gestion_Etudiants.Etudiants.EtudiantRepository;
import com.example.Gestion_Etudiants.Modules.Module;
import com.example.Gestion_Etudiants.Modules.ModuleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class PresenceService {

    private final PresenceRepository presenceRepository;
    private final EtudiantRepository etudiantRepository;
    private final ModuleRepository moduleRepository;

    public PresenceService(PresenceRepository presenceRepository,
                           EtudiantRepository etudiantRepository,
                           ModuleRepository moduleRepository) {
        this.presenceRepository = presenceRepository;
        this.etudiantRepository = etudiantRepository;
        this.moduleRepository = moduleRepository;
    }

    public List<Presence> getAllPresences() {
        return presenceRepository.findAllWithEtudiant();
    }

    public Presence getPresenceByEtudiantAndModule(String cin, String codeMod) {
        return presenceRepository.findByEtudiantCinAndModuleCodeMod(cin, codeMod);
    }

    public List<Presence> getPresencesByEtudiant(String cin) {
        return presenceRepository.findByEtudiantCin(cin);
    }

    @Transactional
    public Presence createPresence(Presence presence) {
        // Vérifier et associer l'étudiant
        Etudiant etudiant = etudiantRepository.findEtudiantByCin(presence.getEtudiant().getCin());
        if (etudiant == null) {
            throw new ResourceNotFoundException("Étudiant non trouvé avec le CIN: " + presence.getEtudiant().getCin());
        }
        presence.setEtudiant(etudiant);

        // Vérifier et associer le module
        Module module = moduleRepository.findModuleByCodeMod(presence.getModule().getCodeMod());
        if (module == null) {
            throw new ResourceNotFoundException("Module non trouvé avec le code: " + presence.getModule().getCodeMod());
        }
        presence.setModule(module);

        return presenceRepository.save(presence);
    }

    @Transactional
    public Presence updatePresence(String cin, String codeMod, Presence presenceDetails) {
        Presence presence = presenceRepository.findByEtudiantCinAndModuleCodeMod(cin, codeMod);
        if (presence == null) {
            throw new ResourceNotFoundException("Présence non trouvée pour l'étudiant: " + cin + " et le module: " + codeMod);
        }

        presence.setNbAbsences(presenceDetails.getNbAbsences());
        presence.setNbRetards(presenceDetails.getNbRetards());

        return presenceRepository.save(presence);
    }

    @Transactional
    public void deletePresence(String cin, String codeMod) {
        Presence presence = presenceRepository.findByEtudiantCinAndModuleCodeMod(cin, codeMod);
        if (presence == null) {
            throw new ResourceNotFoundException("Présence non trouvée pour l'étudiant: " + cin + " et le module: " + codeMod);
        }
        presenceRepository.delete(presence);
    }
}