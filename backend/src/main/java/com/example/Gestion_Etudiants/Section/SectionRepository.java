package com.example.Gestion_Etudiants.Section;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SectionRepository extends JpaRepository<Section, String> {
	Section findByCodeSec(String codeSec);
}