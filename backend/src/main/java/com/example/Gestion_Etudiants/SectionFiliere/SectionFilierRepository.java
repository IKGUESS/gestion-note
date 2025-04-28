package com.example.Gestion_Etudiants.SectionFiliere;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SectionFilierRepository extends JpaRepository<SectionFilier, Long> {

	SectionFilier findByFiliereCodeFilAndSectionCodeSec(String codeFil, String codeSec);

	List<SectionFilier> findByFiliereDesignation(String designation);

	List<SectionFilier> findByFiliereCodeFil(String codeFil);

	List<SectionFilier> findBySectionCodeSec(String codeSec);
}