package com.example.Gestion_Etudiants.Modules;

import com.example.Gestion_Etudiants.ResourceNotFoundException;
import com.example.Gestion_Etudiants.NiveauEtude.niveauEtd;
import com.example.Gestion_Etudiants.NiveauEtude.NiveauEtudeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final NiveauEtudeRepository niveauEtudeRepository;

    public ModuleService(ModuleRepository moduleRepository,
                         NiveauEtudeRepository niveauEtudeRepository) {
        this.moduleRepository = moduleRepository;
        this.niveauEtudeRepository = niveauEtudeRepository;
    }

    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    public Module getModuleById(String codeMod) {
        return moduleRepository.findModuleByCodeMod(codeMod);
    }

    public List<Module> getModulesByNiveauScolaire(String codeNivSco) {
        return moduleRepository.findModulesByCodeniveauEtd(codeNivSco);
    }

    public List<Module> getModulesByFiliere(String codeFil) {
        return moduleRepository.getAllByniveauEtd_Filiere_CodeFil(codeFil);
    }

    @Transactional
    public Module createModule(Module module) {
        // Vérifier et associer le niveau scolaire si nécessaire
        if (module.getNiveauEtd() != null && module.getNiveauEtd().getCodeNivSco() != null) {
            niveauEtd niveau = niveauEtudeRepository.findByCodeNivSco(module.getNiveauEtd().getCodeNivSco());
            if (niveau == null) {
                throw new ResourceNotFoundException("Niveau scolaire non trouvé avec le code: " + module.getNiveauEtd().getCodeNivSco());
            }
            module.setNiveauEtd(niveau);
        }
        return moduleRepository.save(module);
    }

    @Transactional
    public Module updateModule(String codeMod, Module moduleDetails) {
        Module module = moduleRepository.findModuleByCodeMod(codeMod);
        if (module == null) {
            throw new ResourceNotFoundException("Module non trouvé avec le code: " + codeMod);
        }

        module.setNomMod(moduleDetails.getNomMod());
        module.setNbExams(moduleDetails.getNbExams());
        module.setNbTps(moduleDetails.getNbTps());
        module.setNbControles(moduleDetails.getNbControles());
        module.setCoeffExams(moduleDetails.getCoeffExams());
        module.setCoeffTps(moduleDetails.getCoeffTps());
        module.setCoeffControles(moduleDetails.getCoeffControles());

        if (moduleDetails.getNiveauEtd() != null && moduleDetails.getNiveauEtd().getCodeNivSco() != null) {
            niveauEtd niveau = niveauEtudeRepository.findByCodeNivSco(moduleDetails.getNiveauEtd().getCodeNivSco());
            if (niveau == null) {
                throw new ResourceNotFoundException("Niveau scolaire non trouvé avec le code: " + moduleDetails.getNiveauEtd().getCodeNivSco());
            }
            module.setNiveauEtd(niveau);
        }

        return moduleRepository.save(module);
    }

    @Transactional
    public void deleteModule(String codeMod) {
        Module module = moduleRepository.findModuleByCodeMod(codeMod);
        if (module == null) {
            throw new ResourceNotFoundException("Module non trouvé avec le code: " + codeMod);
        }
        moduleRepository.delete(module);
    }

    @Transactional
    public void deleteAllModulesByNiveauScolaire(String codeNivSco) {
        moduleRepository.deleteAllModulesByCodeNivSco(codeNivSco);
    }
}