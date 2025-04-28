package com.example.Gestion_Etudiants.SectionFiliere;

import com.example.Gestion_Etudiants.ResourceNotFoundException;
import com.example.Gestion_Etudiants.Filieres.Filiere;
import com.example.Gestion_Etudiants.Filieres.FiliereRepository;
import com.example.Gestion_Etudiants.Section.Section;
import com.example.Gestion_Etudiants.Section.SectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class SectionFiliereService {

    private final SectionFilierRepository sectionFilierRepository;
    private final FiliereRepository filiereRepository;
    private final SectionRepository sectionRepository;

    public SectionFiliereService(SectionFilierRepository sectionFilierRepository,
                                 FiliereRepository filiereRepository,
                                 SectionRepository sectionRepository) {
        this.sectionFilierRepository = sectionFilierRepository;
        this.filiereRepository = filiereRepository;
        this.sectionRepository = sectionRepository;
    }

    public List<SectionFilier> getAllSectionFilieres() {
        return sectionFilierRepository.findAll();
    }

    public SectionFilier getSectionFiliereById(Long id) {
        return sectionFilierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Association Section-Filière non trouvée avec l'id: " + id));
    }

    public SectionFilier getSectionFiliereByCodes(String codeFil, String codeSec) {
        return sectionFilierRepository.findByFiliereCodeFilAndSectionCodeSec(codeFil, codeSec);
    }

    public List<SectionFilier> getSectionFilieresByFiliere(String codeFil) {
        return sectionFilierRepository.findByFiliereCodeFil(codeFil);
    }

    public List<SectionFilier> getSectionFilieresBySection(String codeSec) {
        return sectionFilierRepository.findBySectionCodeSec(codeSec);
    }

    public List<SectionFilier> getSectionFilieresByFiliereDesignation(String designation) {
        return sectionFilierRepository.findByFiliereDesignation(designation);
    }

    @Transactional
    public SectionFilier createSectionFiliere(SectionFilier sectionFilier) {
        // Vérifier et associer la filière
        Filiere filiere = filiereRepository.findFilierByCodeFil(sectionFilier.getFiliere().getCodeFil());
        if (filiere == null) {
            throw new ResourceNotFoundException("Filière non trouvée avec le code: " + sectionFilier.getFiliere().getCodeFil());
        }
        sectionFilier.setFiliere(filiere);

        // Vérifier et associer la section
        Section section = sectionRepository.findByCodeSec(sectionFilier.getSection().getCodeSec());
        if (section == null) {
            throw new ResourceNotFoundException("Section non trouvée avec le code: " + sectionFilier.getSection().getCodeSec());
        }
        sectionFilier.setSection(section);

        return sectionFilierRepository.save(sectionFilier);
    }

    @Transactional
    public void deleteSectionFiliere(String codeFil, String codeSec) {
        SectionFilier sectionFilier = sectionFilierRepository.findByFiliereCodeFilAndSectionCodeSec(codeFil, codeSec);
        if (sectionFilier == null) {
            throw new ResourceNotFoundException("Association Section-Filière non trouvée");
        }
        sectionFilierRepository.delete(sectionFilier);
    }
}