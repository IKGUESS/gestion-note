package com.example.Gestion_Etudiants.NiveauEtude;

import com.example.Gestion_Etudiants.ResourceNotFoundException;
import com.example.Gestion_Etudiants.Filieres.Filiere;
import com.example.Gestion_Etudiants.Filieres.FiliereRepository;
import com.example.Gestion_Etudiants.Modules.Module;
import com.example.Gestion_Etudiants.Modules.ModuleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class NiveauEtudeService {

    private final NiveauEtudeRepository niveauEtudeRepository;
    private final FiliereRepository filiereRepository;
    private final ModuleRepository moduleRepository;

    public NiveauEtudeService(NiveauEtudeRepository niveauEtudeRepository,
                              FiliereRepository filiereRepository,
                              ModuleRepository moduleRepository) {
        this.niveauEtudeRepository = niveauEtudeRepository;
        this.filiereRepository = filiereRepository;
        this.moduleRepository = moduleRepository;
    }

    public List<niveauEtd> getAllNiveauxScolaires() {
        return niveauEtudeRepository.findAll();
    }

    public niveauEtd getNiveauScolaireById(String codeNivSco) {
        return niveauEtudeRepository.findByCodeNivSco(codeNivSco);
    }

    public List<niveauEtd> getNiveauxScolairesByFiliere(String codeFil) {
        return niveauEtudeRepository.findNiveauxScolairesByCodeFiliere(codeFil);
    }

    @Transactional
    public niveauEtd createNiveauScolaire(niveauEtd niveauScolaire) {
        // Vérifier et associer la filière
        if (niveauScolaire.getFiliere() != null && niveauScolaire.getFiliere().getCodeFil() != null) {
            Filiere filiere = filiereRepository.findFilierByCodeFil(niveauScolaire.getFiliere().getCodeFil());
            if (filiere == null) {
                throw new ResourceNotFoundException("Filière non trouvée avec le code: " + niveauScolaire.getFiliere().getCodeFil());
            }
            niveauScolaire.setFiliere(filiere);
        }
        return niveauEtudeRepository.save(niveauScolaire);
    }

    @Transactional
    public niveauEtd updateNiveauScolaire(String codeNivSco, niveauEtd niveauScolaireDetails) {
        niveauEtd niveauScolaire = niveauEtudeRepository.findByCodeNivSco(codeNivSco);
        if (niveauScolaire == null) {
            throw new ResourceNotFoundException("Niveau scolaire non trouvé avec le code: " + codeNivSco);
        }

        niveauScolaire.setDesignation(niveauScolaireDetails.getDesignation());

        if (niveauScolaireDetails.getFiliere() != null && niveauScolaireDetails.getFiliere().getCodeFil() != null) {
            Filiere filiere = filiereRepository.findFilierByCodeFil(niveauScolaireDetails.getFiliere().getCodeFil());
            if (filiere == null) {
                throw new ResourceNotFoundException("Filière non trouvée avec le code: " + niveauScolaireDetails.getFiliere().getCodeFil());
            }
            niveauScolaire.setFiliere(filiere);
        }

        return niveauEtudeRepository.save(niveauScolaire);
    }

    @Transactional
    public void deleteNiveauScolaire(String codeNivSco) {
        niveauEtd niveauScolaire = niveauEtudeRepository.findByCodeNivSco(codeNivSco);
        if (niveauScolaire == null) {
            throw new ResourceNotFoundException("Niveau scolaire non trouvé avec le code: " + codeNivSco);
        }

        // Suppression des modules associés
        List<Module> modules = moduleRepository.findModulesByCodeniveauEtd(codeNivSco);
        moduleRepository.deleteAll(modules);

        niveauEtudeRepository.delete(niveauScolaire);
    }
}