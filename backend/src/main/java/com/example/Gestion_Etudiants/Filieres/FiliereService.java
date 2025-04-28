package com.example.Gestion_Etudiants.Filieres;

import com.example.Gestion_Etudiants.ResourceNotFoundException;
import com.example.Gestion_Etudiants.Modules.Module;
import com.example.Gestion_Etudiants.Modules.ModuleRepository;
import com.example.Gestion_Etudiants.NiveauEtude.niveauEtd;
import com.example.Gestion_Etudiants.NiveauEtude.NiveauEtudeRepository;
import com.example.Gestion_Etudiants.Responsable.Responsable;
import com.example.Gestion_Etudiants.Responsable.ResponsableRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class FiliereService {

    private final FiliereRepository filiereRepository;
    private final ResponsableRepository responsableRepository;
    private final NiveauEtudeRepository niveauEtudeRepository;
    private final ModuleRepository moduleRepository;

    public FiliereService(FiliereRepository filiereRepository,
                          ResponsableRepository responsableRepository,
                          NiveauEtudeRepository niveauEtudeRepository,
                          ModuleRepository moduleRepository) {
        this.filiereRepository = filiereRepository;
        this.responsableRepository = responsableRepository;
        this.niveauEtudeRepository = niveauEtudeRepository;
        this.moduleRepository = moduleRepository;
    }

    public List<Filiere> getAllFilieres() {
        return filiereRepository.findAll();
    }

    public Filiere getFiliereById(String codeFil) {
        return filiereRepository.findFilierByCodeFil(codeFil);
    }

    public List<Filiere> getFilieresByCodeNiveau(String codeNiv) {
        return filiereRepository.findFilieresByCodeNiveau(codeNiv);
    }

    public List<Filiere> getFilieresByResponsable(String cin) {
        return filiereRepository.findFilieresByCINResponsable(cin);
    }

    public Filiere createFiliere(Filiere filiere) {
        // Assigner un responsable par défaut si non spécifié
        if (filiere.getResponsable() == null) {
            Responsable defaultResponsable = responsableRepository.findResponsableByCin("CN47852");
            filiere.setResponsable(defaultResponsable);
        }
        return filiereRepository.save(filiere);
    }

    public Filiere updateFiliere(String codeFil, Filiere filiereDetails) {
        Filiere filiere = filiereRepository.findFilierByCodeFil(codeFil);
        if (filiere == null) {
            throw new ResourceNotFoundException("Filière de codeFil: " + codeFil + " n'existe pas");
        }

        filiere.setDesignation(filiereDetails.getDesignation());
        filiere.setStatut(filiereDetails.getStatut());

        if (filiereDetails.getResponsable() != null) {
            Responsable responsable = responsableRepository.findResponsableByCin(filiereDetails.getResponsable().getCin());
            filiere.setResponsable(responsable);
        }

        return filiereRepository.save(filiere);
    }

    @Transactional
    public void deleteFiliere(String codeFil) {
        Filiere filiere = filiereRepository.findFilierByCodeFil(codeFil);
        if (filiere == null) {
            throw new ResourceNotFoundException("Filière de codeFil: " + codeFil + " n'existe pas");
        }

        // Suppression en cascade des éléments associés
        List<niveauEtd> niveauxEtude = niveauEtudeRepository.findNiveauxScolairesByCodeFiliere(codeFil);
        for (niveauEtd niveauScolaire : niveauxEtude) {
            List<Module> modules = moduleRepository.findModulesByCodeniveauEtd(niveauScolaire.getCodeNivSco());
            moduleRepository.deleteAll(modules);
        }
        niveauEtudeRepository.deleteAll(niveauxEtude);

        filiereRepository.delete(filiere);
    }
}