package com.example.Gestion_Etudiants.DetailProfesseur;

import com.example.Gestion_Etudiants.Professeurs.Professeur;
import com.example.Gestion_Etudiants.Professeurs.ProfesseurRepository;
import com.example.Gestion_Etudiants.ResourceNotFoundException;
import com.example.Gestion_Etudiants.Modules.Module;
import com.example.Gestion_Etudiants.Modules.ModuleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class DetailProfesseurService {

    private final DetailProfesseurRepository detailRepository;
    private final ProfesseurRepository professeurRepository;
    private final ModuleRepository moduleRepository;

    public DetailProfesseurService(DetailProfesseurRepository detailRepository,
                                         ProfesseurRepository professeurRepository,
                                         ModuleRepository moduleRepository) {
        this.detailRepository = detailRepository;
        this.professeurRepository = professeurRepository;
        this.moduleRepository = moduleRepository;
    }

    public List<DetailProfesseurs> getAllDetails() {
        return detailRepository.findAll();
    }

    public DetailProfesseurs getDetailByProfesseurAndModule(String cin, String codeMod) {
        return detailRepository.findByProfesseurCinAndModuleCodeMod(cin, codeMod);
    }

    public List<DetailProfesseurs> getDetailsByProfesseur(String cin) {
        return detailRepository.findByProfesseurCin(cin);
    }

    public List<DetailProfesseurs> getDetailsByModule(String codeMod) {
        return detailRepository.findByModuleCodeMod(codeMod);
    }

    @Transactional
    public DetailProfesseurs createDetail(DetailProfesseurs detail) {
        // Vérifier et associer le professeur
        Professeur professeur = professeurRepository.findByCin(detail.getProfesseur().getCin());
        if (professeur == null) {
            throw new ResourceNotFoundException("Professeur non trouvé avec le CIN: " + detail.getProfesseur().getCin());
        }
        detail.setProfesseur(professeur);

        // Vérifier et associer le module
        Module module = moduleRepository.findModuleByCodeMod(detail.getModule().getCodeMod());
        if (module == null) {
            throw new ResourceNotFoundException("Module non trouvé avec le code: " + detail.getModule().getCodeMod());
        }
        detail.setModule(module);

        return detailRepository.save(detail);
    }

    @Transactional
    public DetailProfesseurs updateDetail(String cin, String codeMod, DetailProfesseurs detailDetails) {
        DetailProfesseurs detail = detailRepository.findByProfesseurCinAndModuleCodeMod(cin, codeMod);
        if (detail == null) {
            throw new ResourceNotFoundException("Détail non trouvé pour le professeur: " + cin + " et le module: " + codeMod);
        }

        detail.setStatut(detailDetails.getStatut());
        detail.setSection(detailDetails.getSection());

        return detailRepository.save(detail);
    }

    @Transactional
    public void deleteDetail(String cin, String codeMod) {
        DetailProfesseurs detail = detailRepository.findByProfesseurCinAndModuleCodeMod(cin, codeMod);
        if (detail == null) {
            throw new ResourceNotFoundException("Détail non trouvé pour le professeur: " + cin + " et le module: " + codeMod);
        }
        detailRepository.delete(detail);
    }
}