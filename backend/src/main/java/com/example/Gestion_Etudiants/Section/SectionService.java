package com.example.Gestion_Etudiants.Section;

import com.example.Gestion_Etudiants.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class SectionService {

    private final SectionRepository sectionRepository;

    public SectionService(SectionRepository sectionRepository) {
        this.sectionRepository = sectionRepository;
    }

    public List<Section> getAllSections() {
        return sectionRepository.findAll();
    }

    public Section getSectionById(String codeSec) {
        return sectionRepository.findById(codeSec)
                .orElseThrow(() -> new ResourceNotFoundException("Section non trouvée avec le code: " + codeSec));
    }

    @Transactional
    public Section createSection(Section section) {
        return sectionRepository.save(section);
    }

    @Transactional
    public Section updateSection(String codeSec, Section sectionDetails) {
        Section section = getSectionById(codeSec);
        section.setDesignation(sectionDetails.getDesignation());
        return sectionRepository.save(section);
    }

    @Transactional
    public void deleteSection(String codeSec) {
        Section section = getSectionById(codeSec);
        sectionRepository.delete(section);
    }
}