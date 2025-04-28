package com.example.Gestion_Etudiants.Niveau;

import com.example.Gestion_Etudiants.ResourceNotFoundException;
import com.example.Gestion_Etudiants.Filieres.Filiere;
import com.example.Gestion_Etudiants.Filieres.FiliereRepository;
import com.example.Gestion_Etudiants.Modules.Module;
import com.example.Gestion_Etudiants.Modules.ModuleRepository;
import com.example.Gestion_Etudiants.NiveauEtude.niveauEtd;
import com.example.Gestion_Etudiants.NiveauEtude.NiveauEtudeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class NiveauService {

    private final NiveauRepository niveauRepository;
    private final FiliereRepository filiereRepository;
    private final NiveauEtudeRepository niveauEtudeRepository;
    private final ModuleRepository moduleRepository;

    public NiveauService(NiveauRepository niveauRepository,
                         FiliereRepository filiereRepository,
                         NiveauEtudeRepository niveauEtudeRepository,
                         ModuleRepository moduleRepository) {
        this.niveauRepository = niveauRepository;
        this.filiereRepository = filiereRepository;
        this.niveauEtudeRepository = niveauEtudeRepository;
        this.moduleRepository = moduleRepository;
    }

    public List<niveau> getAllNiveaux() {
        return niveauRepository.findAll();
    }

    public niveau getNiveauById(String codeNiv) {
        return niveauRepository.findNiveauByCodeNiv(codeNiv);
    }

    @Transactional
    public niveau createNiveau(niveau niveau) {
        return niveauRepository.save(niveau);
    }

    @Transactional
    public niveau updateNiveau(String codeNiv, niveau niveauDetails) {
        niveau niveau = niveauRepository.findNiveauByCodeNiv(codeNiv);
        if (niveau == null) {
            throw new ResourceNotFoundException("Niveau non trouvé avec le code: " + codeNiv);
        }

        niveau.setDesignation(niveauDetails.getDesignation());
        niveau.setStatut(niveauDetails.getStatut());

        return niveauRepository.save(niveau);
    }

    @Transactional
    public void deleteNiveau(String codeNiv) {
        niveau niveau = niveauRepository.findNiveauByCodeNiv(codeNiv);
        if (niveau == null) {
            throw new ResourceNotFoundException("Niveau non trouvé avec le code: " + codeNiv);
        }

        // Suppression en cascade des éléments associés
        List<Filiere> filieres = filiereRepository.findFilieresByCodeNiveau(codeNiv);

        for (Filiere filiere : filieres) {
            List<niveauEtd> niveauxScolaires = niveauEtudeRepository.findNiveauxScolairesByCodeFiliere(filiere.getCodeFil());

            for (niveauEtd niveauScolaire : niveauxScolaires) {
                List<Module> modules = moduleRepository.findModulesByCodeniveauEtd(niveauScolaire.getCodeNivSco());
                moduleRepository.deleteAll(modules);
                niveauEtudeRepository.delete(niveauScolaire);
            }
            filiereRepository.delete(filiere);
        }

        niveauRepository.delete(niveau);
    }
}